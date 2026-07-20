import { useMemo } from "react"
import { DataTable, Column } from "@/components/admin-shared/data-table"
import { StoreSuiteProvider, useStoreSuite } from "./context"
import { useStoreOrders } from "./use-store-data"
import { StorePageShell, money } from "./shared"

interface SuiteCustomer {
  id: string
  name: string
  email: string
  orders: number
  spent: number
  currency: string
}

function CustomersBody() {
  const { activeStoreId } = useStoreSuite()
  const { orders, isLoading } = useStoreOrders(activeStoreId)

  const customers = useMemo<SuiteCustomer[]>(() => {
    const map = new Map<string, SuiteCustomer>()
    for (const o of orders) {
      const email = (o.customer?.email || o.email || "").toLowerCase()
      const key = email || (o.customer?.id ? String(o.customer.id) : null)
      if (!key) continue
      const name = o.customer ? `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim() : ""
      const existing = map.get(key)
      if (existing) {
        existing.orders += 1
        existing.spent += o.total_price ? Number(o.total_price) : 0
        if (!existing.name && name) existing.name = name
      } else {
        map.set(key, { id: key, name: name || email || "Customer", email: email || "—", orders: 1, spent: o.total_price ? Number(o.total_price) : 0, currency: o.currency || "USD" })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent)
  }, [orders])

  const columns: Column<SuiteCustomer>[] = [
    {
      key: "name", header: "Customer", render: (c) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-[12px] font-semibold shrink-0">{c.name.charAt(0).toUpperCase()}</div>
          <span className="text-[13px] font-medium text-slate-900 truncate">{c.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (c) => <span className="text-[13px] text-slate-500">{c.email}</span> },
    { key: "orders", header: "Orders", sortable: true, render: (c) => <span className="text-[13px] text-slate-700">{c.orders}</span> },
    { key: "spent", header: "Total spent", sortable: true, render: (c) => <span className="text-[13px] font-semibold text-slate-900">{money(c.spent, c.currency)}</span> },
  ]

  return (
    <DataTable
      data={customers}
      columns={columns}
      searchKey="name"
      searchPlaceholder="Search customers…"
      isLoading={isLoading}
      pageSize={12}
      emptyTitle="No customers yet"
      emptyDescription="Customers are derived from your synced orders."
    />
  )
}

export default function StoreCustomers() {
  return (
    <StoreSuiteProvider>
      <StorePageShell title="Customers" subtitle="People who've ordered from your store"><CustomersBody /></StorePageShell>
    </StoreSuiteProvider>
  )
}
