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
import { 
  MoreVertical, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Plus, 
  Package, 
  Link2, 
  Copy, 
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react"
import { ShopifyStore } from "@/app/shopify-stores/data/stores"
import Image from "next/image"
import Link from "next/link"

interface CreateShopifyStoresColumnsProps {
  onViewDetails: (store: ShopifyStore) => void
  onEdit: (store: ShopifyStore) => void
  onSync: (store: ShopifyStore) => void
  onAddProducts: (store: ShopifyStore) => void
  onViewProducts: (store: ShopifyStore) => void
  onDisconnect: (store: ShopifyStore) => void
  onDelete: (store: ShopifyStore) => void
  onCopyStoreId: (store: ShopifyStore) => void
  onCopyUrl: (store: ShopifyStore) => void
  onVisitStore: (store: ShopifyStore) => void
}

export function createShopifyStoresColumns({
  onViewDetails,
  onEdit,
  onSync,
  onAddProducts,
  onViewProducts,
  onDisconnect,
  onDelete,
  onCopyStoreId,
  onCopyUrl,
  onVisitStore,
}: CreateShopifyStoresColumnsProps): ColumnDef<ShopifyStore>[] {
  const formatRelativeTime = (date: string | null) => {
    if (!date) return "Never"
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null) return "—"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number | null) => {
    if (num === null) return "—"
    return new Intl.NumberFormat("en-US").format(num)
  }

  return [
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
      cell: ({ row }) => {
        const store = row.original
        return (
          <div className="flex items-center gap-2 min-w-0" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src="/shopify_glyph.svg"
                alt="Shopify"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium truncate text-sm">{store.name}</span>
              {store.user && (
                <Link
                  href={`/admin/external-users?userId=${store.user.id}`}
                  className="text-xs text-muted-foreground hover:text-primary truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {store.user.full_name || store.user.email}
                </Link>
              )}
            </div>
          </div>
        )
      },
      size: 180,
    },
    {
      accessorKey: "url",
      id: "url",
      header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
      cell: ({ row }) => {
        const url = row.original.url
        const fullUrl = url.startsWith("http") ? url : `https://${url}`
        return (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 truncate max-w-[150px]"
            onClick={(e) => e.stopPropagation()}
            title={url}
          >
            <span className="truncate">{url}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        )
      },
      size: 170,
    },
    {
      accessorKey: "status",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          connected: "default",
          disconnected: "secondary",
          syncing: "outline",
          error: "destructive",
        }
        const icons = {
          connected: CheckCircle2,
          disconnected: XCircle,
          syncing: Loader2,
          error: AlertCircle,
        }
        const labels = {
          connected: "Connected",
          disconnected: "Disconnected",
          syncing: "Syncing",
          error: "Error",
        }
        const Icon = icons[status]
        return (
          <Badge
            variant={variants[status]}
            className="gap-1 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon className={`h-3 w-3 ${status === "syncing" ? "animate-spin" : ""}`} />
            {labels[status]}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 120,
    },
    {
      accessorKey: "sync_status",
      id: "sync_status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sync Status" />,
      cell: ({ row }) => {
        const syncStatus = row.original.sync_status
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          success: "default",
          failed: "destructive",
          pending: "outline",
          never: "secondary",
        }
        const icons = {
          success: CheckCircle2,
          failed: XCircle,
          pending: Loader2,
          never: XCircle,
        }
        const labels = {
          success: "Success",
          failed: "Failed",
          pending: "Pending",
          never: "Never",
        }
        const Icon = icons[syncStatus]
        return (
          <Badge
            variant={variants[syncStatus]}
            className="gap-1 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon className={`h-3 w-3 ${syncStatus === "pending" ? "animate-spin" : ""}`} />
            {labels[syncStatus]}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 110,
    },
    {
      accessorKey: "products_count",
      id: "products_count",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Products" />,
      cell: ({ row }) => (
        <span className="text-xs font-medium" onClick={(e) => e.stopPropagation()}>
          {formatNumber(row.original.products_count)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "monthly_revenue",
      id: "monthly_revenue",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Revenue" />,
      cell: ({ row }) => (
        <span className="text-xs font-medium" onClick={(e) => e.stopPropagation()}>
          {formatCurrency(row.original.monthly_revenue, row.original.currency)}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: "monthly_traffic",
      id: "monthly_traffic",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Traffic" />,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          {formatNumber(row.original.monthly_traffic)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "last_synced_at",
      id: "last_synced_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Synced" />,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          {formatRelativeTime(row.original.last_synced_at)}
        </span>
      ),
      size: 100,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const store = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onViewDetails(store)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(store)}>
                  <Package className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSync(store)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddProducts(store)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewProducts(store)}>
                  <Package className="h-4 w-4 mr-2" />
                  View Products
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDisconnect(store)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(store)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCopyStoreId(store)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Store ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopyUrl(store)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onVisitStore(store)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Store
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
