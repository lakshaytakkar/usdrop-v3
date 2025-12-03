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
import { MoreVertical, Eye, Trash2, RefreshCw, ExternalLink } from "lucide-react"
import { StoreResearchEntry } from "../data/store-research"

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

interface CreateStoreResearchColumnsProps {
  onViewDetails: (entry: StoreResearchEntry) => void
  onRefresh: (entry: StoreResearchEntry) => void
  onDelete: (entry: StoreResearchEntry) => void
}

export function createStoreResearchColumns({
  onViewDetails,
  onRefresh,
  onDelete,
}: CreateStoreResearchColumnsProps): ColumnDef<StoreResearchEntry>[] {
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
      accessorKey: "store_url",
      id: "store_url",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Store URL" />,
      cell: ({ row }) => {
        const entry = row.original
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="font-medium">{entry.store_name || entry.store_url}</span>
            <a
              href={`https://${entry.store_url}`}
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
      accessorFn: (row) => row.data.category,
      id: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline" onClick={(e) => e.stopPropagation()}>
          {row.original.data.category}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.original.data.category)
      },
    },
    {
      accessorFn: (row) => row.data.popularityRank,
      id: "popularityRank",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Popularity Rank" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          #{row.original.data.popularityRank?.toLocaleString() ?? 'N/A'}
        </span>
      ),
    },
    {
      accessorFn: (row) => row.data.growth,
      id: "growth",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Growth" />,
      cell: ({ row }) => (
        <span className="text-emerald-600 font-medium" onClick={(e) => e.stopPropagation()}>
          +{row.original.data.growth?.toFixed(1) ?? '0.0'}%
        </span>
      ),
    },
    {
      accessorFn: (row) => row.data.monthlyTraffic,
      id: "monthlyTraffic",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Monthly Traffic" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          {row.original.data.monthlyTraffic ? numberFormatter.format(row.original.data.monthlyTraffic) : 'N/A'}
        </span>
      ),
    },
    {
      accessorFn: (row) => row.data.monthlyRevenue,
      id: "monthlyRevenue",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Monthly Revenue" />,
      cell: ({ row }) => (
        <span className="font-medium" onClick={(e) => e.stopPropagation()}>
          {row.original.data.monthlyRevenue ? currencyFormatter.format(row.original.data.monthlyRevenue) : 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: "last_updated",
      id: "last_updated",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
      cell: ({ row }) => {
        const date = new Date(row.original.last_updated)
        return (
          <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const entry = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(entry)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRefresh(entry)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(entry)} className="text-destructive">
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

