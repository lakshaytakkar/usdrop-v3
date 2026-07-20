import { ReactNode, useState } from "react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useUserPlan } from "@/hooks/use-user-plan"
import { useStoreSuite } from "./context"
import { ConnectStoreModal } from "@/pages/my-store/components/connect-store-modal"
import { cn } from "@/lib/utils"
import { Store, Lock, RefreshCw, ExternalLink } from "lucide-react"

/* Standard framework toolbar for the Store space — store switcher + sync.
   (Replaces the old dedicated sidebar layout; the Store is now a normal
   top-nav group with sub-nav tabs like every other space.) */
function StoreToolbar() {
  const { stores, activeStoreId, setActiveStoreId, activeStore, syncNow, syncing } = useStoreSuite()
  if (stores.length === 0) return null
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={activeStoreId || undefined} onValueChange={setActiveStoreId}>
        <SelectTrigger className="w-[220px] h-9" data-testid="suite-store-switcher"><SelectValue placeholder="Select store" /></SelectTrigger>
        <SelectContent>
          {stores.map((s) => <SelectItem key={s.id} value={s.id}>{s.store_name || s.name || s.shop_domain || "Store"}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="ml-auto flex items-center gap-2">
        {activeStore?.shop_domain && (
          <a href={`https://${activeStore.shop_domain}/admin`} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Shopify admin
          </a>
        )}
        <Button size="sm" onClick={syncNow} disabled={syncing} data-testid="suite-sync">
          <RefreshCw className={cn("h-4 w-4 mr-1.5", syncing && "animate-spin")} /> {syncing ? "Syncing…" : "Sync now"}
        </Button>
      </div>
    </div>
  )
}

/* Gate: Pro check + loading + no-store (with inline connect). */
export function SuiteGate({ children }: { children: ReactNode }) {
  const { isPro, isLoading: planLoading } = useUserPlan()
  const { loading, stores, refresh } = useStoreSuite()
  const [connectOpen, setConnectOpen] = useState(false)

  if (planLoading || loading) {
    return <div className="flex justify-center py-24"><BlueSpinner size="lg" label="Loading…" /></div>
  }

  if (!isPro) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-4"><Lock className="h-6 w-6" /></div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Your Store is a Pro feature</h3>
        <p className="text-sm text-slate-500 mb-6">Upgrade to manage your Shopify products, orders, inventory and customers in one place.</p>
        <Link href="/llc"><Button>See plans</Button></Link>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-4"><Store className="h-6 w-6" /></div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Connect your Shopify store</h3>
        <p className="text-sm text-slate-500 mb-6">Link a store to manage products, orders, inventory and customers from here.</p>
        <Button onClick={() => setConnectOpen(true)} data-testid="button-suite-connect"><Store className="h-4 w-4 mr-2" /> Connect store</Button>
        <ConnectStoreModal open={connectOpen} onClose={() => setConnectOpen(false)} onStoreAdded={() => refresh()} />
      </div>
    )
  }

  return <>{children}</>
}

/* Standard page shell for every Store subpage — same hierarchy as other spaces. */
export function StorePageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner title={title} description={subtitle || ""} iconSrc="/images/banners/3d-store.png" tutorialVideoUrl="" />
      <StoreToolbar />
      <SuiteGate>{children}</SuiteGate>
    </div>
  )
}

export function money(v: number | null | undefined, currency = "USD"): string {
  if (v == null) return "—"
  return `${currency === "USD" ? "$" : currency + " "}${Number(v).toFixed(2)}`
}

export function fmtDate(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
