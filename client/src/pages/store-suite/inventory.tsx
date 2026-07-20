import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable, Column } from "@/components/admin-shared/data-table"
import { StoreSuiteProvider, useStoreSuite } from "./context"
import { useStoreProducts, SuiteProduct } from "./use-store-data"
import { StorePageShell } from "./shared"

function stockState(qty: number): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (qty <= 0) return { label: "Out of stock", variant: "destructive" }
  if (qty < 5) return { label: "Low stock", variant: "outline" }
  return { label: "In stock", variant: "default" }
}

function InventoryBody() {
  const { activeStoreId } = useStoreSuite()
  const { products, isLoading } = useStoreProducts(activeStoreId)

  const columns: Column<SuiteProduct>[] = [
    {
      key: "title", header: "Product", render: (p) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
            {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-4 w-4 text-slate-300" /></div>}
          </div>
          <span className="text-[13px] font-medium text-slate-900 truncate">{p.title}</span>
        </div>
      ),
    },
    { key: "variants", header: "Variants", render: (p) => <span className="text-[13px] text-slate-500">{Array.isArray(p.variants) ? p.variants.length : 0}</span> },
    { key: "inventory_quantity", header: "On hand", sortable: true, render: (p) => <span className="text-[13px] font-semibold text-slate-900">{p.inventory_quantity ?? 0}</span> },
    {
      key: "stock", header: "Status", render: (p) => {
        const s = stockState(p.inventory_quantity ?? 0)
        return <Badge variant={s.variant}>{s.label}</Badge>
      },
    },
  ]

  return (
    <DataTable
      data={products}
      columns={columns}
      searchKey="title"
      searchPlaceholder="Search inventory…"
      isLoading={isLoading}
      pageSize={12}
      emptyTitle="No inventory yet"
      emptyDescription="Sync your store to see stock levels here."
    />
  )
}

export default function StoreInventory() {
  return (
    <StoreSuiteProvider>
      <StorePageShell title="Inventory" subtitle="Stock levels across your products"><InventoryBody /></StorePageShell>
    </StoreSuiteProvider>
  )
}
