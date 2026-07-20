import { useLocation } from "wouter"
import { Badge } from "@/components/ui/badge"
import { DataTable, Column, RowAction } from "@/components/admin-shared/data-table"
import { StoreSuiteProvider, useStoreSuite } from "./context"
import { useStoreOrders, SuiteOrder } from "./use-store-data"
import { StorePageShell, money, fmtDate } from "./shared"

const finVariant = (s: string | null): "default" | "secondary" | "destructive" | "outline" => {
  if (s === "paid") return "default"
  if (s === "refunded" || s === "voided") return "destructive"
  if (s === "pending" || s === "authorized") return "outline"
  return "secondary"
}

function OrdersBody() {
  const { activeStoreId } = useStoreSuite()
  const { orders, isLoading } = useStoreOrders(activeStoreId)
  const [, setLocation] = useLocation()

  const columns: Column<SuiteOrder>[] = [
    { key: "order_number", header: "Order", render: (o) => <span className="text-[13px] font-medium text-slate-900">{o.order_number || `#${o.shopify_order_id}`}</span> },
    { key: "shopify_created_at", header: "Date", sortable: true, render: (o) => <span className="text-[13px] text-slate-500">{fmtDate(o.shopify_created_at)}</span> },
    {
      key: "customer", header: "Customer", render: (o) => {
        const name = o.customer ? `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim() : o.email || "—"
        return <span className="text-[13px] text-slate-700">{name || "—"}</span>
      },
    },
    { key: "financial_status", header: "Payment", render: (o) => <Badge variant={finVariant(o.financial_status)} className="capitalize">{(o.financial_status || "unknown").replace(/_/g, " ")}</Badge> },
    { key: "fulfillment_status", header: "Fulfillment", render: (o) => <Badge variant={o.fulfillment_status === "fulfilled" ? "default" : "outline"} className="capitalize">{(o.fulfillment_status || "unfulfilled").replace(/_/g, " ")}</Badge> },
    { key: "total_price", header: "Total", sortable: true, render: (o) => <span className="text-[13px] font-semibold text-slate-900">{money(o.total_price, o.currency)}</span> },
  ]

  const rowActions: RowAction<SuiteOrder>[] = [
    { label: "Fulfill with USDrop", onClick: () => setLocation("/fulfillment") },
  ]

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchKey="order_number"
      searchPlaceholder="Search orders…"
      rowActions={rowActions}
      isLoading={isLoading}
      pageSize={12}
      emptyTitle="No orders synced"
      emptyDescription="Orders from your store will appear here after a sync."
    />
  )
}

export default function StoreOrders() {
  return (
    <StoreSuiteProvider>
      <StorePageShell title="Orders" subtitle="Orders synced from your connected store"><OrdersBody /></StorePageShell>
    </StoreSuiteProvider>
  )
}
