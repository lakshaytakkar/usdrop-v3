

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Trash2, CheckCircle2, Copy, Edit, ExternalLink, Package, X } from "lucide-react"
// Using local interface matching the UI format
interface CompetitorStore {
  id: string
  name: string
  url: string
  logo?: string
  category: string
  country?: string
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  products_count?: number
  rating?: number
  verified: boolean
  created_at: string
  updated_at: string
}


const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

interface CreateCompetitorStoresColumnsProps {
  onViewDetails: (store: CompetitorStore) => void
  onQuickView?: (store: CompetitorStore) => void
  onEdit: (store: CompetitorStore) => void
  onDelete: (store: CompetitorStore) => void
  onCopyStoreId: (store: CompetitorStore) => void
  onCopyUrl: (store: CompetitorStore) => void
  onToggleVerify: (store: CompetitorStore) => void
  onVisitStore: (store: CompetitorStore) => void
  onViewProducts: (store: CompetitorStore) => void
  canEdit?: boolean
  canDelete?: boolean
  canVerify?: boolean
}

export function createCompetitorStoresColumns({
  onViewDetails,
  onQuickView,
  onEdit,
  onDelete,
  onCopyStoreId,
  onCopyUrl,
  onToggleVerify,
  onVisitStore,
  onViewProducts,
  canEdit = true,
  canDelete = true,
  canVerify = true,
}: CreateCompetitorStoresColumnsProps): ColumnDef<CompetitorStore>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const store = row.original
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (onQuickView) {
            onQuickView(store)
          }
        }
        return (
          <div className="flex items-center gap-2 min-w-0 cursor-pointer hover:[&>div>span]:text-primary transition-colors" onClick={handleClick}>
            <div className="relative h-10 w-10 shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src="/images/logos/shopify.svg"
                alt="Shopify"
                width={40}
                height={40}
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium truncate" title={store.name}>{store.name}</span>
              <div className="text-xs text-muted-foreground truncate" title={store.url}>{store.url}</div>
            </div>
          </div>
        )
      },
      size: 320,
    },
    {
      accessorKey: "category",
      id: "category",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline" onClick={(e) => e.stopPropagation()}>
          {row.original.category}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "country",
      id: "country",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          {row.original.country || "—"}
        </span>
      ),
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const country = row.getValue(id) as string | undefined
        if (!country) return false
        return value.includes(country)
      },
    },
    {
      accessorKey: "monthly_traffic",
      id: "monthly_traffic",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Monthly Traffic" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          {numberFormatter.format(row.original.monthly_traffic)}
        </span>
      ),
    },
    {
      accessorKey: "monthly_revenue",
      id: "monthly_revenue",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Monthly Revenue" />,
      cell: ({ row }) => {
        const revenue = row.original.monthly_revenue
        return (
          <span className="font-medium" onClick={(e) => e.stopPropagation()}>
            {revenue ? currencyFormatter.format(revenue) : "—"}
          </span>
        )
      },
    },
    {
      accessorKey: "growth",
      id: "growth",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Growth" />,
      cell: ({ row }) => {
        const growth = row.original.growth
        return (
          <span
            className={`font-medium ${growth >= 0 ? "text-emerald-600" : "text-destructive"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
          </span>
        )
      },
    },
    {
      id: "actions",
      meta: {
        sticky: true,
      },
      header: () => <div className="text-right pr-2">Actions</div>,
      cell: ({ row }) => {
        const store = row.original

        return (
          <div className="flex justify-end pr-2 min-w-[60px]" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onQuickView && (
                  <DropdownMenuItem onClick={() => onQuickView(store)} className="cursor-pointer">
                    <Eye className="h-4 w-4 mr-2" />
                    Quick View
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onViewDetails(store)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewProducts(store)} className="cursor-pointer">
                  <Package className="h-4 w-4 mr-2" />
                  View Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onVisitStore(store)} className="cursor-pointer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Store
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(store)} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canVerify && (
                  <DropdownMenuItem onClick={() => onToggleVerify(store)} className="cursor-pointer">
                    {store.verified ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Unverify
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCopyStoreId(store)} className="cursor-pointer">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Store ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopyUrl(store)} className="cursor-pointer">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canDelete && (
                  <DropdownMenuItem onClick={() => onDelete(store)} className="text-destructive cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
