"use client"

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
import { CompetitorStore } from "../data/stores"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
        const store = row.original
        return (
          <Avatar className="h-10 w-10" onClick={(e) => e.stopPropagation()}>
            {store.logo ? (
              <AvatarImage src={store.logo} alt={store.name} />
            ) : null}
            <AvatarFallback>{getInitials(store.name)}</AvatarFallback>
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
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
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
      accessorKey: "country",
      id: "country",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          {row.original.country || "—"}
        </span>
      ),
      filterFn: (row, id, value) => {
        const country = row.getValue(id) as string | undefined
        if (!country) return false
        return value.includes(country)
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
      accessorKey: "verified",
      id: "verified",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const store = row.original
        return (
          <Badge
            variant={store.verified ? "default" : "secondary"}
            className="gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {store.verified && <CheckCircle2 className="h-3 w-3" />}
            {store.verified ? "Verified" : "Unverified"}
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
                {onQuickView && (
                  <DropdownMenuItem onClick={() => onQuickView(store)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Quick View
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onViewDetails(store)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewProducts(store)}>
                  <Package className="h-4 w-4 mr-2" />
                  View Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onVisitStore(store)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Store
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(store)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canVerify && (
                  <DropdownMenuItem onClick={() => onToggleVerify(store)}>
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
                <DropdownMenuItem onClick={() => onCopyStoreId(store)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Store ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopyUrl(store)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canDelete && (
                  <DropdownMenuItem onClick={() => onDelete(store)} className="text-destructive">
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
