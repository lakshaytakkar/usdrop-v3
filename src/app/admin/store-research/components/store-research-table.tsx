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

interface StoreResearchTableProps {
  entries: StoreResearchEntry[]
  selectedEntries: StoreResearchEntry[]
  onSelectEntry: (entry: StoreResearchEntry, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (entry: StoreResearchEntry) => void
  onRefresh: (entry: StoreResearchEntry) => void
  onDelete: (entry: StoreResearchEntry) => void
}

export function StoreResearchTable({
  entries,
  selectedEntries,
  onSelectEntry,
  onSelectAll,
  onViewDetails,
  onRefresh,
  onDelete,
}: StoreResearchTableProps) {
  const allSelected = entries.length > 0 && selectedEntries.length === entries.length

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
          <TableHead>Store URL</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Popularity Rank</TableHead>
          <TableHead>Growth</TableHead>
          <TableHead>Monthly Traffic</TableHead>
          <TableHead>Monthly Revenue</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
              No store research entries found
            </TableCell>
          </TableRow>
        ) : (
          entries.map((entry) => {
            const isSelected = selectedEntries.some((e) => e.id === entry.id)
            return (
              <TableRow key={entry.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectEntry(entry, checked as boolean)}
                    aria-label={`Select entry ${entry.id}`}
                  />
                </TableCell>
                <TableCell>
                  <a
                    href={`https://${entry.store_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {entry.store_url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.data.category}</Badge>
                </TableCell>
                <TableCell>{numberFormatter.format(entry.data.popularityRank)}</TableCell>
                <TableCell>
                  <span
                    className={entry.data.growth > 0 ? "text-emerald-600" : "text-destructive"}
                  >
                    {entry.data.growth > 0 ? "+" : ""}
                    {entry.data.growth.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  {entry.data.monthlyTraffic
                    ? numberFormatter.format(entry.data.monthlyTraffic)
                    : "—"}
                </TableCell>
                <TableCell>
                  {entry.data.monthlyRevenue
                    ? currencyFormatter.format(entry.data.monthlyRevenue)
                    : "—"}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(entry.last_updated).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}







