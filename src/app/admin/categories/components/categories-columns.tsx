"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, MoreVertical, Eye, Trash2, Edit, Copy, ArrowUpRight, ArrowDownRight, FolderTree, Package, Layers } from "lucide-react"
import { ProductCategory } from "@/types/admin/categories"
import Image from "next/image"

interface CreateCategoriesColumnsProps {
  onViewDetails: (category: ProductCategory) => void
  onQuickView: (category: ProductCategory) => void
  onEdit?: (category: ProductCategory) => void
  onDelete: (category: ProductCategory) => void
  onCopyCategoryId?: (category: ProductCategory) => void
  onCopySlug?: (category: ProductCategory) => void
  onToggleTrending?: (category: ProductCategory) => void
  onViewProducts?: (category: ProductCategory) => void
  onViewSubcategories?: (category: ProductCategory) => void
  onDuplicate?: (category: ProductCategory) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function createCategoriesColumns({
  onViewDetails,
  onQuickView,
  onEdit,
  onDelete,
  onCopyCategoryId,
  onCopySlug,
  onToggleTrending,
  onViewProducts,
  onViewSubcategories,
  onDuplicate,
  canEdit = true,
  canDelete = true,
}: CreateCategoriesColumnsProps): ColumnDef<ProductCategory>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const category = row.original
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          onQuickView(category)
        }
        const hasSubcategories = category.parent_category_id === null // Simplified check
        return (
          <div className="flex items-center gap-2 min-w-0 cursor-pointer hover:[&>div>span]:text-primary transition-colors" onClick={handleClick}>
            <div className="relative w-10 h-10 rounded overflow-hidden bg-muted shrink-0">
              {(category.thumbnail || category.image) ? (
                <Image
                  src={category.thumbnail || category.image || '/placeholder-category.png'}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium truncate" title={category.name}>{category.name}</span>
                {hasSubcategories && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FolderTree className="h-3 w-3 text-muted-foreground shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Has subcategories</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate" title={category.slug}>{category.slug}</div>
            </div>
          </div>
        )
      },
      size: 220,
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
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        // Filter values are category IDs, check against parent_category_id
        const parentId = row.original.parent_category_id || null
        // Handle "None" case - empty string means no parent
        const filterValues = value.map((v: string) => v === "" ? null : v)
        return filterValues.includes(parentId)
      },
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
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Avg Profit" />,
      cell: ({ row }) => {
        const category = row.original
        const isHighProfit = category.avg_profit_margin !== null && category.avg_profit_margin > 40
        return (
          <span className={`font-medium ${isHighProfit ? "text-emerald-600" : "text-foreground"}`} onClick={(e) => e.stopPropagation()}>
            {category.avg_profit_margin ? `${category.avg_profit_margin.toFixed(1)}%` : "—"}
          </span>
        )
      },
    },
    {
      id: "growth_percentage",
      accessorKey: "growth_percentage",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Growth" />,
      cell: ({ row }) => {
        const category = row.original
        if (category.growth_percentage === null) {
          return <span className="text-muted-foreground text-sm" onClick={(e) => e.stopPropagation()}>—</span>
        }
        const isPositive = category.growth_percentage > 0
        const isHighGrowth = category.growth_percentage > 15
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {isPositive ? (
              <ArrowUpRight className={`h-3 w-3 ${isHighGrowth ? "text-emerald-600" : "text-muted-foreground"}`} />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-destructive" />
            )}
            <span className={`text-sm font-medium ${isHighGrowth ? "text-emerald-600" : "text-foreground"}`}>
              {category.growth_percentage.toFixed(1)}%
            </span>
          </div>
        )
      },
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
        const hasSubcategories = category.parent_category_id === null // Simplified check
        return (
          <div className="flex justify-end pr-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actions</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" side="left" className="w-48">
                <DropdownMenuItem onClick={() => onViewDetails(category)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickView(category)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </DropdownMenuItem>
                {canEdit && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(category)} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {(canEdit || onCopyCategoryId || onCopySlug) && <DropdownMenuSeparator />}
                {onCopyCategoryId && (
                  <DropdownMenuItem onClick={() => onCopyCategoryId(category)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Category ID
                  </DropdownMenuItem>
                )}
                {onCopySlug && (
                  <DropdownMenuItem onClick={() => onCopySlug(category)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Slug
                  </DropdownMenuItem>
                )}
                {(onCopyCategoryId || onCopySlug || onToggleTrending || onViewProducts || onViewSubcategories) && <DropdownMenuSeparator />}
                {onToggleTrending && canEdit && (
                  <DropdownMenuItem onClick={() => onToggleTrending(category)} className="cursor-pointer">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {category.trending ? "Remove from Trending" : "Mark as Trending"}
                  </DropdownMenuItem>
                )}
                {onViewProducts && (
                  <DropdownMenuItem onClick={() => onViewProducts(category)} className="cursor-pointer">
                    <Package className="h-4 w-4 mr-2" />
                    View Products
                  </DropdownMenuItem>
                )}
                {onViewSubcategories && hasSubcategories && (
                  <DropdownMenuItem onClick={() => onViewSubcategories(category)} className="cursor-pointer">
                    <Layers className="h-4 w-4 mr-2" />
                    View Subcategories
                  </DropdownMenuItem>
                )}
                {(onToggleTrending || onViewProducts || onViewSubcategories || onDuplicate) && <DropdownMenuSeparator />}
                {onDuplicate && canEdit && (
                  <DropdownMenuItem onClick={() => onDuplicate(category)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Category
                  </DropdownMenuItem>
                )}
                {canDelete && <DropdownMenuSeparator />}
                {canDelete && (
                  <DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive cursor-pointer">
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

