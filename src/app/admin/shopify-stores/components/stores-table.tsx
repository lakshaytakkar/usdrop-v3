"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { ShopifyStore } from "@/app/shopify-stores/data/stores"

interface StoresTableProps {
  stores: ShopifyStore[]
  selectedStores: ShopifyStore[]
  onSelectStore: (store: ShopifyStore, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (store: ShopifyStore) => void
  onDelete: (store: ShopifyStore) => void
}

export function StoresTable({
  stores,
  selectedStores,
  onSelectStore,
  onSelectAll,
  onViewDetails,
  onDelete,
}: StoresTableProps) {
  const allSelected = stores.length > 0 && selectedStores.length === stores.length

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Store Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Connected At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No stores found
            </TableCell>
          </TableRow>
        ) : (
          stores.map((store) => {
            const isSelected = selectedStores.some((s) => s.id === store.id)
            return (
              <TableRow key={store.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectStore(store, checked as boolean)}
                    aria-label={`Select store ${store.id}`}
                  />
                </TableCell>
                <TableCell>
                  <span className="font-medium">{store.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{store.url}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {store.status === "connected" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <Badge variant="default">Connected</Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <Badge variant="destructive">Disconnected</Badge>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {store.connectedAt ? formatRelativeTime(store.connectedAt) : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}








