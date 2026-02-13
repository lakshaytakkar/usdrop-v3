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
import { MoreVertical, Eye, Trash2, Edit, Copy, Lock, LockOpen, Package, FolderTree, Building } from "lucide-react"
import { HandPickedProduct } from "@/types/admin/products"
import Image from "next/image"
import { format } from "date-fns"

interface CreateHandPickedColumnsProps {
  onViewDetails: (product: HandPickedProduct) => void
  onQuickView: (product: HandPickedProduct) => void
  onOpenDrawer?: (product: HandPickedProduct) => void
  onEdit?: (product: HandPickedProduct) => void
  onDelete: (product: HandPickedProduct) => void
  onCopyProductId?: (product: HandPickedProduct) => void
  onCopyTitle?: (product: HandPickedProduct) => void
  onToggleLock?: (product: HandPickedProduct) => void
  onViewCategory?: (product: HandPickedProduct) => void
  onViewSupplier?: (product: HandPickedProduct) => void
  onDuplicate?: (product: HandPickedProduct) => void
  canEdit?: boolean
  canDelete?: boolean
  canLockUnlock?: boolean
}

export function createHandPickedColumns({
  onViewDetails,
  onQuickView,
  onOpenDrawer,
  onEdit,
  onDelete,
  onCopyProductId,
  onCopyTitle,
  onToggleLock,
  onViewCategory,
  onViewSupplier,
  onDuplicate,
  canEdit = true,
  canDelete = true,
  canLockUnlock = true,
}: CreateHandPickedColumnsProps): ColumnDef<HandPickedProduct>[] {
  return [
    {
      id: "image",
      header: () => <div className="w-20">Image</div>,
      cell: ({ row }) => (
        <div className="w-20 px-2">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 mx-auto" onClick={(e) => e.stopPropagation()}>
            {row.original.image && (row.original.image.startsWith('http') || row.original.image.startsWith('/')) ? (
              <Image
                src={row.original.image}
                alt={row.original.title}
                fill
                className="object-cover"
                sizes="64px"
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
      id: "profit_margin",
      accessorKey: "profit_margin",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Profit Margin" />,
      cell: ({ row }) => {
        const product = row.original
        const isHighProfit = product.profit_margin > 40
        return (
          <div className="flex items-center gap-1 px-2" onClick={(e) => e.stopPropagation()}>
            <span className={`text-sm font-medium ${isHighProfit ? "text-emerald-600" : "text-foreground"}`}>
              {product.profit_margin}%
            </span>
            {isHighProfit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="text-xs px-1 py-0">High</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>High profit margin</p>
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
      id: "pot_revenue",
      accessorKey: "pot_revenue",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pot Revenue" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium px-2" onClick={(e) => e.stopPropagation()}>
          ${row.original.pot_revenue.toFixed(2)}
        </span>
      ),
      size: 110,
      minSize: 100,
      maxSize: 130,
    },
    {
      id: "is_locked",
      accessorKey: "is_locked",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center gap-1.5 px-2" onClick={(e) => e.stopPropagation()}>
            <Badge variant={product.is_locked ? "destructive" : "default"} className="whitespace-nowrap text-xs">
              {product.is_locked ? (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </>
              ) : (
                "Unlocked"
              )}
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isLocked = value.includes("locked")
        const isUnlocked = value.includes("unlocked")
        if (isLocked && !row.original.is_locked) return false
        if (isUnlocked && row.original.is_locked) return false
        return true
      },
      size: 100,
      minSize: 90,
      maxSize: 110,
    },
    {
      id: "found_date",
      accessorKey: "found_date",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Found Date" />,
      cell: ({ row }) => (
        <div className="text-xs whitespace-nowrap px-2" onClick={(e) => e.stopPropagation()}>
          {format(new Date(row.original.found_date), "MMM dd, yyyy")}
        </div>
      ),
      size: 110,
      minSize: 100,
      maxSize: 130,
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
                {(onCopyProductId || onCopyTitle || onToggleLock || onViewCategory || onViewSupplier) && <DropdownMenuSeparator />}
                {onToggleLock && canLockUnlock && (
                  <DropdownMenuItem onClick={() => onToggleLock(product)} className="cursor-pointer">
                    {product.is_locked ? (
                      <>
                        <LockOpen className="h-4 w-4 mr-2" />
                        Unlock
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Lock
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {onViewCategory && (
                  <DropdownMenuItem onClick={() => onViewCategory(product)} className="cursor-pointer">
                    <FolderTree className="h-4 w-4 mr-2" />
                    View Category
                  </DropdownMenuItem>
                )}
                {onViewSupplier && product.supplier_info && (
                  <DropdownMenuItem onClick={() => onViewSupplier(product)} className="cursor-pointer">
                    <Building className="h-4 w-4 mr-2" />
                    View Supplier
                  </DropdownMenuItem>
                )}
                {(onToggleLock || onViewCategory || onViewSupplier || onDuplicate) && <DropdownMenuSeparator />}
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

