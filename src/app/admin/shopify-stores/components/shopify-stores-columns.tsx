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
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { ShopifyStore } from "@/app/shopify-stores/data/stores"

interface CreateShopifyStoresColumnsProps {
  onViewDetails: (store: ShopifyStore) => void
  onDelete: (store: ShopifyStore) => void
}

export function createShopifyStoresColumns({
  onViewDetails,
  onDelete,
}: CreateShopifyStoresColumnsProps): ColumnDef<ShopifyStore>[] {
  const formatRelativeTime = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
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
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Store Name" />,
      cell: ({ row }) => (
        <span className="font-medium" onClick={(e) => e.stopPropagation()}>{row.original.name}</span>
      ),
    },
    {
      accessorKey: "url",
      id: "url",
      header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          {row.original.url}
        </span>
      ),
    },
    {
      accessorKey: "status",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={status === "connected" ? "default" : "secondary"}
            className="gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "connected" ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "connectedAt",
      id: "connectedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Connected At" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          {formatRelativeTime(row.original.connectedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const store = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(store)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(store)} className="text-destructive">
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

