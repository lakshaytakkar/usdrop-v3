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
import { MoreVertical, Eye, Edit, Trash2, Lock, Check, EyeOff, Star } from "lucide-react"
import { SubscriptionPlan } from "@/types/admin/plans"

interface CreatePlansColumnsProps {
  onViewDetails: (plan: SubscriptionPlan) => void
  onEdit: (plan: SubscriptionPlan) => void
  onDelete: (plan: SubscriptionPlan) => void
  onToggleActive?: (plan: SubscriptionPlan) => void
  onTogglePublic?: (plan: SubscriptionPlan) => void
  onNameClick?: (plan: SubscriptionPlan) => void
}

export function createPlansColumns({
  onViewDetails,
  onEdit,
  onDelete,
  onToggleActive,
  onTogglePublic,
  onNameClick,
}: CreatePlansColumnsProps): ColumnDef<SubscriptionPlan>[] {
  return [
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const plan = row.original
        return (
          <div className="flex items-center gap-2">
            {onNameClick ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNameClick(plan)
                }}
                className="font-medium hover:underline text-left cursor-pointer"
              >
                {plan.name}
              </button>
            ) : (
              <span className="font-medium">{plan.name}</span>
            )}
            {plan.popular && (
              <Badge variant="default" className="gap-1">
                <Star className="h-3 w-3" />
                Popular
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "slug",
      id: "slug",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
      cell: ({ row }) => (
        <span className="text-sm font-mono text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          {row.original.slug}
        </span>
      ),
    },
    {
      accessorKey: "priceMonthly",
      id: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pricing" />,
      cell: ({ row }) => {
        const plan = row.original
        return (
          <div className="text-sm" onClick={(e) => e.stopPropagation()}>
            {plan.priceMonthly === 0 ? (
              <span className="font-medium">Free</span>
            ) : (
              <div>
                <div className="font-medium">${plan.priceMonthly.toFixed(2)}/mo</div>
                {plan.priceAnnual && (
                  <div className="text-xs text-muted-foreground">
                    ${plan.priceAnnual.toFixed(2)}/yr
                  </div>
                )}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "active",
      id: "active",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const plan = row.original
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Badge variant={plan.active ? "default" : "secondary"}>
              {plan.active ? "Active" : "Inactive"}
            </Badge>
            {plan.isPublic ? (
              <Badge variant="outline">
                Public
              </Badge>
            ) : (
              <Badge variant="secondary">
                Private
              </Badge>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isActive = value.includes("active")
        const isInactive = value.includes("inactive")
        if (isActive && !row.original.active) return false
        if (isInactive && row.original.active) return false
        return true
      },
    },
    {
      accessorKey: "displayOrder",
      id: "displayOrder",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          {row.original.displayOrder}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      id: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
      cell: ({ row }) => {
        const date = row.original.updatedAt
        return (
          <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {date
              ? date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const plan = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(plan)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(plan)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {onToggleActive && (
                  <DropdownMenuItem onClick={() => onToggleActive(plan)}>
                    {plan.active ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {onTogglePublic && (
                  <DropdownMenuItem onClick={() => onTogglePublic(plan)}>
                    {plan.isPublic ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Make Private
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Make Public
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(plan)} className="text-destructive">
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

