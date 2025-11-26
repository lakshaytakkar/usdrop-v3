"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Trash2, CheckCircle2, Star } from "lucide-react"
import { Supplier } from "@/app/suppliers/data/suppliers"

interface CreateSuppliersColumnsProps {
  onViewDetails: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

export function createSuppliersColumns({
  onViewDetails,
  onDelete,
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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
                <DropdownMenuItem onClick={() => onViewDetails(supplier)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(supplier)} className="text-destructive">
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

