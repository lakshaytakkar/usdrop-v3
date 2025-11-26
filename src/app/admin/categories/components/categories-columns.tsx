"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TrendingUp, MoreVertical, Eye, Trash2 } from "lucide-react"
import { ProductCategory } from "@/types/admin/categories"
import Image from "next/image"

interface CreateCategoriesColumnsProps {
  onViewDetails: (category: ProductCategory) => void
  onQuickView: (category: ProductCategory) => void
  onLargeModal: (category: ProductCategory) => void
  onDelete: (category: ProductCategory) => void
}

export function createCategoriesColumns({
  onViewDetails,
  onQuickView,
  onLargeModal,
  onDelete,
}: CreateCategoriesColumnsProps): ColumnDef<ProductCategory>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {row.original.image && (
            <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
              <Image
                src={row.original.image}
                alt={row.original.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          )}
          <div>
            <span className="font-medium">{row.original.name}</span>
            <div className="text-xs text-muted-foreground">{row.original.slug}</div>
          </div>
        </div>
      ),
    },
    {
      id: "parent_category",
      accessorFn: (row) => row.parent_category?.name || "None",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Parent" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          {row.original.parent_category?.name || "—"}
        </span>
      ),
    },
    {
      id: "product_count",
      accessorKey: "product_count",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Products" />,
      cell: ({ row }) => (
        <span className="font-medium" onClick={(e) => e.stopPropagation()}>{row.original.product_count}</span>
      ),
    },
    {
      id: "avg_profit_margin",
      accessorKey: "avg_profit_margin",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Avg Profit" />,
      cell: ({ row }) => (
        <span className="text-emerald-600 font-medium" onClick={(e) => e.stopPropagation()}>
          {row.original.avg_profit_margin ? `${row.original.avg_profit_margin.toFixed(1)}%` : "—"}
        </span>
      ),
    },
    {
      id: "trending",
      accessorKey: "trending",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.trending ? "default" : "outline"} onClick={(e) => e.stopPropagation()}>
          {row.original.trending ? (
            <>
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </>
          ) : (
            "Not Trending"
          )}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isTrending = value.includes("trending")
        const isNotTrending = value.includes("not-trending")
        if (isTrending && !row.original.trending) return false
        if (isNotTrending && row.original.trending) return false
        return true
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onQuickView(category)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLargeModal(category)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails(category)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View in Drawer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}

