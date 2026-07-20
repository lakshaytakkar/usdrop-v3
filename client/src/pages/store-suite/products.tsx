import { Link } from "wouter"
import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/admin-shared/data-table"
import { StoreSuiteProvider, useStoreSuite } from "./context"
import { useStoreProducts, SuiteProduct } from "./use-store-data"
import { StorePageShell, money } from "./shared"

const statusVariant = (s: string | null): "default" | "secondary" | "outline" => {
  if (s === "active") return "default"
  if (s === "draft") return "outline"
  return "secondary"
}

function ProductsBody() {
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
    { key: "product_type", header: "Type", render: (p) => <span className="text-[13px] text-slate-500">{p.product_type || "—"}</span> },
    { key: "inventory_quantity", header: "Inventory", sortable: true, render: (p) => <span className={(p.inventory_quantity ?? 0) < 5 ? "text-amber-600 font-medium" : "text-slate-700"}>{p.inventory_quantity ?? 0}</span> },
    { key: "price", header: "Price", sortable: true, render: (p) => <span className="text-[13px] font-medium text-slate-900">{money(p.price)}</span> },
    { key: "status", header: "Status", render: (p) => <Badge variant={statusVariant(p.status)} className="capitalize">{p.status || "active"}</Badge> },
  ]

  return (
    <DataTable
      data={products}
      columns={columns}
      searchKey="title"
      searchPlaceholder="Search products…"
      isLoading={isLoading}
      pageSize={12}
      emptyTitle="No products synced"
      emptyDescription="Sync your store, or add products from your USDrop catalog."
      headerActions={<Link href="/framework/my-products"><Button size="sm">Add from catalog</Button></Link>}
    />
  )
}

export default function StoreProducts() {
  return (
    <StoreSuiteProvider>
      <StorePageShell title="Products" subtitle="Everything listed in your connected store"><ProductsBody /></StorePageShell>
    </StoreSuiteProvider>
  )
}
