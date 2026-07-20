import { useState, useEffect, useCallback, Suspense } from "react"
import { apiFetch } from "@/lib/supabase"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import { TeaserButtonLock } from "@/components/ui/teaser-button-lock"
import { useUserPlan } from "@/hooks/use-user-plan"
import { Boxes, PackageCheck, ClipboardList, Store, ArrowRight } from "lucide-react"
import { FulfillmentValueSections } from "./components/value-sections"
import { RequestFulfillmentDialog } from "./components/request-fulfillment-dialog"
import { FulfillmentRequest } from "./lib"

interface KPIs {
  hasStore: boolean
  awaiting: number
  activeRequests: number
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Boxes; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white px-5 py-4" data-testid={`fulfillment-kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[22px] leading-none font-bold text-slate-900">{value}</div>
        <div className="text-[12.5px] text-slate-500 mt-1">{label}</div>
      </div>
    </div>
  )
}

function FulfillmentOverviewContent() {
  const { isPro, isLoading: planLoading } = useUserPlan()
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadKpis = useCallback(async () => {
    if (!isPro) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [storesRes, reqRes] = await Promise.all([
        apiFetch("/api/shopify-stores"),
        apiFetch("/api/fulfillment/requests"),
      ])
      const stores = storesRes.ok ? ((await storesRes.json()).stores || []) : []
      const requests: FulfillmentRequest[] = reqRes.ok ? ((await reqRes.json()).requests || []) : []

      let awaiting = 0
      if (stores.length > 0) {
        const ordersRes = await apiFetch(`/api/shopify-stores/${stores[0].id}/orders`)
        if (ordersRes.ok) {
          const orders = (await ordersRes.json()).orders || []
          awaiting = orders.filter((o: any) => o.fulfillment_status !== "fulfilled").length
        }
      }
      const activeRequests = requests.filter((r) => r.status !== "delivered" && r.status !== "cancelled").length
      setKpis({ hasStore: stores.length > 0, awaiting, activeRequests })
    } catch {
      setKpis({ hasStore: false, awaiting: 0, activeRequests: 0 })
    } finally {
      setLoading(false)
    }
  }, [isPro])

  useEffect(() => {
    if (!planLoading) loadKpis()
  }, [planLoading, loadKpis])

  return (
    <div className="flex flex-1 flex-col gap-5 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner
        title="Fulfillment"
        description="Let our China-warehouse team source, pack and ship your Shopify orders"
        iconSrc="/3d-ecom-icons-blue/Delivery_Truck.png"
        tutorialVideoUrl=""
      />

      {/* Pro action band */}
      {isPro ? (
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/40 px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-slate-900">Hand your orders to USDrop</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Pick an order from your connected store, or request fulfillment directly. We take it from there.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/fulfillment/orders">
                <Button variant="outline" data-testid="button-go-orders">
                  <Store className="h-4 w-4 mr-2" /> View my orders
                </Button>
              </Link>
              <Button onClick={() => setDialogOpen(true)} data-testid="button-request-fulfillment">
                <Boxes className="h-4 w-4 mr-2" /> Request fulfillment
              </Button>
            </div>
          </div>

          {/* KPIs */}
          {loading ? (
            <div className="flex justify-center py-8"><BlueSpinner size="md" label="Loading…" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <StatCard
                icon={Store}
                label="Connected store"
                value={kpis?.hasStore ? "Connected" : "None yet"}
                tone="bg-emerald-50 text-emerald-600"
              />
              <StatCard
                icon={PackageCheck}
                label="Orders awaiting fulfillment"
                value={String(kpis?.awaiting ?? 0)}
                tone="bg-amber-50 text-amber-600"
              />
              <StatCard
                icon={ClipboardList}
                label="Active requests"
                value={String(kpis?.activeRequests ?? 0)}
                tone="bg-blue-50 text-blue-600"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-slate-900">Fulfillment, done for you</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Available on Pro. Unlock to send your Shopify orders to our China-warehouse team.
              </p>
            </div>
            <TeaserButtonLock message="Available on Pro — complete Free Learning to unlock">
              <Button data-testid="button-request-fulfillment-locked">
                <Boxes className="h-4 w-4 mr-2" /> Request fulfillment
              </Button>
            </TeaserButtonLock>
          </div>
        </div>
      )}

      {/* Value content — shown to everyone */}
      <FulfillmentValueSections />

      <RequestFulfillmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={loadKpis}
      />
    </div>
  )
}

export default function FulfillmentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-8">
        <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 300px)" }}>
          <BlueSpinner size="lg" label="Loading fulfillment…" />
        </div>
      </div>
    }>
      <FulfillmentOverviewContent />
    </Suspense>
  )
}
