import { Link } from "wouter"
import { Package, ShoppingCart, DollarSign, Boxes, ArrowRight, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StoreSuiteProvider, useStoreSuite } from "./context"
import { useStoreProducts, useStoreOrders } from "./use-store-data"
import { StorePageShell, money, fmtDate } from "./shared"

function KPI({ icon: Icon, label, value, tone }: { icon: typeof Package; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white px-5 py-4">
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
      <div className="min-w-0">
        <div className="text-[20px] leading-none font-bold text-slate-900">{value}</div>
        <div className="text-[12px] text-slate-500 mt-1">{label}</div>
      </div>
    </div>
  )
}

function DashboardBody() {
  const { activeStoreId, activeStore } = useStoreSuite()
  const { products } = useStoreProducts(activeStoreId)
  const { orders } = useStoreOrders(activeStoreId)

  const revenue = orders.reduce((s, o) => s + (o.total_price ? Number(o.total_price) : 0), 0)
  const awaiting = orders.filter((o) => o.fulfillment_status !== "fulfilled").length
  const lowStock = products.filter((p) => (p.inventory_quantity ?? 0) < 5)
  const recent = orders.slice(0, 6)
  const currency = activeStore?.currency || "USD"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI icon={DollarSign} label="Revenue (synced)" value={money(revenue, currency)} tone="bg-emerald-50 text-emerald-600" />
        <KPI icon={ShoppingCart} label="Orders" value={String(orders.length)} tone="bg-blue-50 text-blue-600" />
        <KPI icon={Package} label="Products" value={String(products.length)} tone="bg-violet-50 text-violet-600" />
        <KPI icon={Truck} label="Awaiting fulfillment" value={String(awaiting)} tone="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* recent orders */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="text-[14px] font-semibold text-slate-900">Recent orders</h3>
            <Link href="/store/orders" className="text-[12.5px] font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">No orders synced yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recent.map((o) => {
                const name = o.customer ? `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim() : o.email || "—"
                return (
                  <div key={o.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-slate-900 truncate">{o.order_number || `#${o.shopify_order_id}`}</div>
                      <div className="text-[12px] text-slate-400 truncate">{name} · {fmtDate(o.shopify_created_at)}</div>
                    </div>
                    <Badge variant={o.fulfillment_status === "fulfilled" ? "default" : "outline"} className="capitalize shrink-0">{(o.fulfillment_status || "unfulfilled").replace(/_/g, " ")}</Badge>
                    <div className="text-[13.5px] font-semibold text-slate-900 shrink-0 w-20 text-right">{money(o.total_price, o.currency)}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* low stock + actions */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <Boxes className="h-4 w-4 text-amber-500" />
              <h3 className="text-[14px] font-semibold text-slate-900">Low stock</h3>
            </div>
            {lowStock.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">All products well stocked.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {lowStock.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-2.5">
                    <span className="text-[13px] text-slate-700 truncate pr-2">{p.title}</span>
                    <span className="text-[12px] font-semibold text-amber-600 shrink-0">{p.inventory_quantity ?? 0} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/fulfillment" className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 px-5 py-4 transition-colors group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white shrink-0"><Truck className="h-5 w-5" /></div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-slate-900">Fulfill with USDrop</div>
              <div className="text-[12px] text-slate-500">Ship orders from our China warehouse</div>
            </div>
            <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function StoreDashboard() {
  return (
    <StoreSuiteProvider>
      <StorePageShell title="Store" subtitle="Your connected store at a glance"><DashboardBody /></StorePageShell>
    </StoreSuiteProvider>
  )
}
