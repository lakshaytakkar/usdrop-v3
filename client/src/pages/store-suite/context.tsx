import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

/* Shared state for the dedicated Shopify Management Suite — the connected
   stores + which one is active, shared across all suite tabs. */

export interface SuiteStore {
  id: string
  name?: string | null
  store_name?: string | null
  shop_domain?: string | null
  url?: string | null
  status?: string | null
  is_active?: boolean
  sync_status?: string | null
  last_synced_at?: string | null
  products_count?: number
  orders_count?: number
  currency?: string
  plan?: string | null
}

interface StoreSuiteCtx {
  stores: SuiteStore[]
  activeStore: SuiteStore | null
  activeStoreId: string | null
  setActiveStoreId: (id: string) => void
  loading: boolean
  syncing: boolean
  syncNow: () => Promise<void>
  refresh: () => Promise<void>
}

const Ctx = createContext<StoreSuiteCtx | null>(null)
const LS_KEY = "usdrop_suite_active_store"

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "That connection link expired. Please try connecting again.",
  shop_mismatch: "The store you approved didn't match the one you entered.",
  hmac_verification_failed: "We couldn't verify the response from Shopify. Please try again.",
  missing_parameters: "Shopify didn't send back everything we needed. Please try again.",
  store_already_exists: "That store is already connected to another account.",
  create_failed: "We couldn't save your store. Please try again.",
  update_failed: "We couldn't update your store. Please try again.",
  access_denied: "You cancelled the Shopify authorization.",
  store_not_found: "We couldn't reach that Shopify store. Check the store ID and try again.",
  connection_failed: "Something went wrong talking to Shopify. Please try again.",
}

export function StoreSuiteProvider({ children }: { children: ReactNode }) {
  const { showSuccess, showError } = useToast()
  const [stores, setStores] = useState<SuiteStore[]>([])
  const [activeStoreId, setActiveStoreIdState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const setActiveStoreId = useCallback((id: string) => {
    setActiveStoreIdState(id)
    try { localStorage.setItem(LS_KEY, id) } catch { /* ignore */ }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/shopify-stores")
      const list: SuiteStore[] = res.ok ? ((await res.json()).stores || []) : []
      setStores(list)
      setActiveStoreIdState((prev) => {
        if (prev && list.some((s) => s.id === prev)) return prev
        let saved: string | null = null
        try { saved = localStorage.getItem(LS_KEY) } catch { /* ignore */ }
        if (saved && list.some((s) => s.id === saved)) return saved
        return list[0]?.id ?? null
      })
    } catch {
      setStores([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  /* The Shopify OAuth callback returns here with ?success= or ?error=. Report the
     outcome — before this, a failed connect bounced the user back to an unchanged
     "Connect your Shopify store" screen with no explanation at all. */
  const oauthHandled = useRef(false)
  useEffect(() => {
    if (oauthHandled.current) return

    const params = new URLSearchParams(window.location.search)
    const success = params.get("success")
    const errorCode = params.get("error")
    if (!success && !errorCode) return

    oauthHandled.current = true

    if (success) {
      showSuccess(success === "store_updated" ? "Store reconnected successfully" : "Store connected successfully")
      refresh()
    } else if (errorCode) {
      showError(OAUTH_ERROR_MESSAGES[errorCode] || `Could not connect your store (${errorCode})`)
    }

    params.delete("success")
    params.delete("error")
    const query = params.toString()
    window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`)
  }, [showSuccess, showError, refresh])

  const syncNow = useCallback(async () => {
    if (!activeStoreId) return
    setSyncing(true)
    try {
      await apiFetch(`/api/shopify-stores/${activeStoreId}/sync`, { method: "POST" })
      await refresh()
    } finally {
      setSyncing(false)
    }
  }, [activeStoreId, refresh])

  const activeStore = stores.find((s) => s.id === activeStoreId) || null

  return (
    <Ctx.Provider value={{ stores, activeStore, activeStoreId, setActiveStoreId, loading, syncing, syncNow, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStoreSuite(): StoreSuiteCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useStoreSuite must be used within StoreSuiteProvider")
  return ctx
}
