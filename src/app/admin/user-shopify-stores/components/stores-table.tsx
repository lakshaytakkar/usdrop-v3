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
import { MoreVertical, Eye, Trash2, ExternalLink } from "lucide-react"
import { CompetitorStore } from "../data/stores"

interface StoresTableProps {
  stores: CompetitorStore[]
  selectedStores: CompetitorStore[]
  onSelectStore: (store: CompetitorStore, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (store: CompetitorStore) => void
  onDelete: (store: CompetitorStore) => void
}

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

export function StoresTable({
  stores,
  selectedStores,
  onSelectStore,
  onSelectAll,
  onViewDetails,
  onDelete,
}: StoresTableProps) {
  const allSelected = stores.length > 0 && selectedStores.length === stores.length

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
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Monthly Traffic</TableHead>
          <TableHead>Monthly Revenue</TableHead>
          <TableHead>Growth</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                  <a
                    href={`https://${store.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {store.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{store.category}</Badge>
                </TableCell>
                <TableCell>{numberFormatter.format(store.monthly_traffic)}</TableCell>
                <TableCell>
                  {store.monthly_revenue ? currencyFormatter.format(store.monthly_revenue) : "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={store.growth > 0 ? "text-emerald-600" : "text-destructive"}
                  >
                    {store.growth > 0 ? "+" : ""}
                    {store.growth.toFixed(1)}%
                  </span>
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


















