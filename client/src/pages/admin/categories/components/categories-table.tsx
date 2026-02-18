


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
import { MoreVertical, Eye, Folder, Trash2 } from "lucide-react"
import { ProductCategory } from "@/types/admin/categories"

interface CategoriesTableProps {
  categories: ProductCategory[]
  selectedCategories: ProductCategory[]
  onSelectCategory: (category: ProductCategory, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (category: ProductCategory) => void
  onDelete: (category: ProductCategory) => void
}

export function CategoriesTable({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  onViewDetails,
  onDelete,
}: CategoriesTableProps) {
  const allSelected = categories.length > 0 && selectedCategories.length === categories.length

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
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Parent Category</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Avg Margin</TableHead>
          <TableHead>Growth</TableHead>
          <TableHead>Trending</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
              No categories found
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategories.some((c) => c.id === category.id)
            return (
              <TableRow key={category.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectCategory(category, checked as boolean)}
                    aria-label={`Select category ${category.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    {(category.thumbnail || category.image) ? (
                      <img
                        src={category.thumbnail || category.image || '/categories/other-thumbnail.png'}
                        alt={category.name}
                       
                        className="object-cover"
                       
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Folder className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.slug}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {category.parent_category ? (
                    <Badge variant="outline">{category.parent_category.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{category.product_count}</span>
                </TableCell>
                <TableCell>
                  {category.avg_profit_margin ? (
                    <span className="text-emerald-600">{category.avg_profit_margin.toFixed(1)}%</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {category.growth_percentage !== null ? (
                    <span
                      className={
                        category.growth_percentage > 0 ? "text-emerald-600" : "text-destructive"
                      }
                    >
                      {category.growth_percentage > 0 ? "+" : ""}
                      {category.growth_percentage.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={category.trending ? "default" : "outline"}>
                    {category.trending ? "Yes" : "No"}
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
                      <DropdownMenuItem onClick={() => onViewDetails(category)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive">
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

























