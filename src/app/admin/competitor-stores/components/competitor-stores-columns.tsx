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
import { MoreVertical, Eye, Trash2, ExternalLink } from "lucide-react"
import { CompetitorStore } from "../data/stores"

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
  onDelete: (store: CompetitorStore) => void
}

export function createCompetitorStoresColumns({
  onViewDetails,
  onDelete,
}: CreateCompetitorStoresColumnsProps): ColumnDef<CompetitorStore>[] {
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <span className="font-medium" onClick={(e) => e.stopPropagation()}>{row.original.name}</span>
      ),
    },
    {
      accessorKey: "url",
      id: "url",
      header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
      cell: ({ row }) => {
        const store = row.original
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm text-muted-foreground">{store.url}</span>
            <a
              href={`https://${store.url}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
        )
      },
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
      accessorKey: "monthly_traffic",
      id: "monthly_traffic",
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Growth" />,
      cell: ({ row }) => (
        <span className="text-emerald-600 font-medium" onClick={(e) => e.stopPropagation()}>
          +{row.original.growth.toFixed(1)}%
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

