

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Trash2, CheckCircle2, Star, Copy, Edit, Package, X } from "lucide-react"
import { Supplier } from "@/pages/suppliers/data/suppliers"

interface CreateSuppliersColumnsProps {
  onViewDetails: (supplier: Supplier) => void
  onQuickView?: (supplier: Supplier) => void
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
  onCopySupplierId: (supplier: Supplier) => void
  onCopyEmail: (supplier: Supplier) => void
  onToggleVerify: (supplier: Supplier) => void
  onViewProducts: (supplier: Supplier) => void
  canEdit?: boolean
  canDelete?: boolean
  canVerify?: boolean
}

export function createSuppliersColumns({
  onViewDetails,
  onQuickView,
  onEdit,
  onDelete,
  onCopySupplierId,
  onCopyEmail,
  onToggleVerify,
  onViewProducts,
  canEdit = true,
  canDelete = true,
  canVerify = true,
}: CreateSuppliersColumnsProps): ColumnDef<Supplier>[] {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return [
    {
      id: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <Avatar className="h-10 w-10" onClick={(e) => e.stopPropagation()}>
            <AvatarImage src={supplier.logo} />
            <AvatarFallback>{getInitials(supplier.name)}</AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <span className="font-medium" onClick={(e) => e.stopPropagation()}>{row.original.name}</span>
      ),
    },
    {
      accessorKey: "country",
      id: "country",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>{row.original.country}</span>
      ),
    },
    {
      accessorKey: "category",
      id: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline" onClick={(e) => e.stopPropagation()}>
          {row.original.category}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "rating",
      id: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{supplier.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({supplier.reviews})</span>
          </div>
        )
      },
    },
    {
      accessorKey: "verified",
      id: "verified",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <Badge
            variant={supplier.verified ? "default" : "secondary"}
            className="gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {supplier.verified && <CheckCircle2 className="h-3 w-3" />}
            {supplier.verified ? "Verified" : "Unverified"}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isVerified = value.includes("verified")
        const isUnverified = value.includes("unverified")
        if (isVerified && !row.original.verified) return false
        if (isUnverified && row.original.verified) return false
        return true
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onQuickView && (
                  <DropdownMenuItem onClick={() => onQuickView(supplier)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Quick View
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onViewDetails(supplier)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewProducts(supplier)}>
                  <Package className="h-4 w-4 mr-2" />
                  View Products
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(supplier)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canVerify && (
                  <DropdownMenuItem onClick={() => onToggleVerify(supplier)}>
                    {supplier.verified ? (
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
                <DropdownMenuItem onClick={() => onCopySupplierId(supplier)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Supplier ID
                </DropdownMenuItem>
                {supplier.contactEmail && (
                  <DropdownMenuItem onClick={() => onCopyEmail(supplier)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Email
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {canDelete && (
                  <DropdownMenuItem onClick={() => onDelete(supplier)} className="text-destructive">
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
