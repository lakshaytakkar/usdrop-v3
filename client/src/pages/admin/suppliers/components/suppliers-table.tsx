

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Trash2, CheckCircle2 } from "lucide-react"
import { Supplier } from "@/pages/suppliers/data/suppliers"

interface SuppliersTableProps {
  suppliers: Supplier[]
  selectedSuppliers: Supplier[]
  onSelectSupplier: (supplier: Supplier, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

export function SuppliersTable({
  suppliers,
  selectedSuppliers,
  onSelectSupplier,
  onSelectAll,
  onViewDetails,
  onDelete,
}: SuppliersTableProps) {
  const allSelected = suppliers.length > 0 && selectedSuppliers.length === suppliers.length

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
          <TableHead>Logo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No suppliers found
            </TableCell>
          </TableRow>
        ) : (
          suppliers.map((supplier) => {
            const isSelected = selectedSuppliers.some((s) => s.id === supplier.id)
            return (
              <TableRow key={supplier.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectSupplier(supplier, checked as boolean)}
                    aria-label={`Select supplier ${supplier.id}`}
                  />
                </TableCell>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {supplier.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{supplier.name}</span>
                    {supplier.verified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{supplier.country}</TableCell>
                <TableCell>
                  <Badge variant="outline">{supplier.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{supplier.rating}</span>
                    <span className="text-xs text-muted-foreground">({supplier.reviews})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={supplier.verified ? "default" : "outline"}>
                    {supplier.verified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

























