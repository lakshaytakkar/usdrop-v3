

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
import { MoreVertical, Eye, Trash2, Edit, Copy, Package, FolderTree, Building, TrendingUp } from "lucide-react"
import { ProductPick } from "@/types/admin/products"

import { Star } from "lucide-react"

interface CreateProductPicksColumnsProps {
  onViewDetails: (product: ProductPick) => void
  onQuickView: (product: ProductPick) => void
  onOpenDrawer?: (product: ProductPick) => void
  onEdit?: (product: ProductPick) => void
  onDelete: (product: ProductPick) => void
  onCopyProductId?: (product: ProductPick) => void
  onCopyTitle?: (product: ProductPick) => void
  onViewCategory?: (product: ProductPick) => void
  onViewSupplier?: (product: ProductPick) => void
  onViewTrendData?: (product: ProductPick) => void
  onDuplicate?: (product: ProductPick) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function createProductPicksColumns({
  onViewDetails,
  onQuickView,
  onOpenDrawer,
  onEdit,
  onDelete,
  onCopyProductId,
  onCopyTitle,
  onViewCategory,
  onViewSupplier,
  onViewTrendData,
  onDuplicate,
  canEdit = true,
  canDelete = true,
}: CreateProductPicksColumnsProps): ColumnDef<ProductPick>[] {
  return [
    {
      id: "image",
      header: () => <div className="w-20">Image</div>,
      cell: ({ row }) => (
        <div className="w-20 px-2">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 mx-auto" onClick={(e) => e.stopPropagation()}>
            {row.original.image && (row.original.image.startsWith('http') || row.original.image.startsWith('/')) ? (
              <img
                src={row.original.image}
                alt={row.original.title}
               
                className="object-cover"
               
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      ),
      size: 100,
      minSize: 100,
      maxSize: 100,
      enableResizing: false,
    },
    {
      id: "title",
      accessorKey: "title",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        const product = row.original
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          onQuickView(product)
        }
        return (
          <div className="px-4 min-w-0 max-w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-0 text-left justify-start font-medium hover:underline cursor-pointer w-full"
                  onClick={handleClick}
                >
                  <span className="block truncate max-w-full">{product.title}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs break-words">{product.title}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
      size: 800,
      minSize: 700,
      maxSize: 1000,
    },
    {
      id: "buy_price",
      accessorKey: "buy_price",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Buy Price" />,
      cell: ({ row }) => (
        <span className="text-sm px-2" onClick={(e) => e.stopPropagation()}>${row.original.buy_price.toFixed(2)}</span>
      ),
      size: 100,
      minSize: 90,
      maxSize: 120,
    },
    {
      id: "sell_price",
      accessorKey: "sell_price",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sell Price" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium px-2" onClick={(e) => e.stopPropagation()}>
          ${row.original.sell_price.toFixed(2)}
        </span>
      ),
      size: 100,
      minSize: 90,
      maxSize: 120,
    },
    {
      id: "profit_per_order",
      accessorKey: "profit_per_order",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Profit" />,
      cell: ({ row }) => {
        const product = row.original
        const isHighProfit = product.profit_per_order > 50
        return (
          <div className="flex items-center gap-1 px-2" onClick={(e) => e.stopPropagation()}>
            <span className={`text-sm font-medium ${isHighProfit ? "text-emerald-600" : "text-foreground"}`}>
              ${product.profit_per_order.toFixed(2)}
            </span>
            {isHighProfit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="text-xs px-1 py-0">High</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>High profit per order</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )
      },
      size: 110,
      minSize: 100,
      maxSize: 130,
    },
    {
      id: "category",
      accessorKey: "category",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <div className="px-2 min-w-0">
          <Badge variant="outline" onClick={(e) => e.stopPropagation()} className="whitespace-nowrap text-xs">
            {row.original.category.replace(/-/g, " ")}
          </Badge>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
    {
      id: "rating",
      accessorKey: "rating",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
      cell: ({ row }) => {
        const product = row.original
        if (!product.rating) {
          return <span className="text-muted-foreground text-xs px-2" onClick={(e) => e.stopPropagation()}>—</span>
        }
        const isHighRated = product.rating > 4.0
        return (
          <div className="flex items-center gap-1 px-2" onClick={(e) => e.stopPropagation()}>
            <Star className={`h-3 w-3 ${isHighRated ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            <span className={`text-xs font-medium ${isHighRated ? "text-foreground" : "text-muted-foreground"}`}>
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
          </div>
        )
      },
      size: 110,
      minSize: 100,
      maxSize: 130,
    },
    {
      id: "supplier",
      accessorFn: (row) => row.supplier?.name || "",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
      cell: ({ row }) => {
        const product = row.original
        if (!product.supplier) {
          return <span className="text-muted-foreground text-xs px-2" onClick={(e) => e.stopPropagation()}>—</span>
        }
        return (
          <span className="text-xs truncate max-w-[100px] px-2" title={product.supplier.name} onClick={(e) => e.stopPropagation()}>
            {product.supplier.name}
          </span>
        )
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original
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
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onOpenDrawer) {
                      onOpenDrawer(product)
                    } else {
                      onViewDetails(product)
                    }
                  }} 
                  className="cursor-pointer"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickView(product)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </DropdownMenuItem>
                {canEdit && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {(canEdit || onCopyProductId || onCopyTitle) && <DropdownMenuSeparator />}
                {onCopyProductId && (
                  <DropdownMenuItem onClick={() => onCopyProductId(product)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Product ID
                  </DropdownMenuItem>
                )}
                {onCopyTitle && (
                  <DropdownMenuItem onClick={() => onCopyTitle(product)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Title
                  </DropdownMenuItem>
                )}
                {(onCopyProductId || onCopyTitle || onViewCategory || onViewSupplier || onViewTrendData) && <DropdownMenuSeparator />}
                {onViewCategory && (
                  <DropdownMenuItem onClick={() => onViewCategory(product)} className="cursor-pointer">
                    <FolderTree className="h-4 w-4 mr-2" />
                    View Category
                  </DropdownMenuItem>
                )}
                {onViewSupplier && product.supplier && (
                  <DropdownMenuItem onClick={() => onViewSupplier(product)} className="cursor-pointer">
                    <Building className="h-4 w-4 mr-2" />
                    View Supplier
                  </DropdownMenuItem>
                )}
                {onViewTrendData && product.trend_data && (
                  <DropdownMenuItem onClick={() => onViewTrendData(product)} className="cursor-pointer">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Trend Data
                  </DropdownMenuItem>
                )}
                {(onViewCategory || onViewSupplier || onViewTrendData || onDuplicate) && <DropdownMenuSeparator />}
                {onDuplicate && canEdit && (
                  <DropdownMenuItem onClick={() => onDuplicate(product)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Product
                  </DropdownMenuItem>
                )}
                {canDelete && <DropdownMenuSeparator />}
                {canDelete && (
                  <DropdownMenuItem onClick={() => onDelete(product)} className="text-destructive cursor-pointer">
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

