import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { apiFetch } from "@/lib/supabase"

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

export function StoreSuiteProvider({ children }: { children: ReactNode }) {
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
