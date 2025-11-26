"use client"

import { useState } from "react"
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
import { MoreVertical, Eye, Edit, Trash2, Lock, Check, EyeOff, Star } from "lucide-react"
import { SubscriptionPlan } from "@/types/admin/plans"

interface PlansTableProps {
  plans: SubscriptionPlan[]
  selectedPlans: SubscriptionPlan[]
  onSelectPlan: (plan: SubscriptionPlan, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (plan: SubscriptionPlan) => void
  onEdit: (plan: SubscriptionPlan) => void
  onDelete: (plan: SubscriptionPlan) => void
  onToggleActive?: (plan: SubscriptionPlan) => void
  onTogglePublic?: (plan: SubscriptionPlan) => void
}

export function PlansTable({
  plans,
  selectedPlans,
  onSelectPlan,
  onSelectAll,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleActive,
  onTogglePublic,
}: PlansTableProps) {
  const allSelected = plans.length > 0 && selectedPlans.length === plans.length

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
          <TableHead>Slug</TableHead>
          <TableHead>Pricing</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No plans found
            </TableCell>
          </TableRow>
        ) : (
          plans.map((plan) => {
            const isSelected = selectedPlans.some((p) => p.id === plan.id)

            return (
              <TableRow key={plan.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectPlan(plan, checked as boolean)}
                    aria-label={`Select plan ${plan.id}`}
                  />
                </TableCell>
                <TableCell onClick={() => onViewDetails(plan)}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{plan.name}</span>
                    {plan.popular && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={() => onViewDetails(plan)}>
                  <span className="text-sm text-muted-foreground">{plan.slug}</span>
                </TableCell>
                <TableCell onClick={() => onViewDetails(plan)}>
                  <div className="text-sm">
                    <div className="font-medium">${plan.priceMonthly.toFixed(2)}/mo</div>
                    {plan.priceAnnual && (
                      <div className="text-xs text-muted-foreground">
                        ${plan.priceAnnual.toFixed(2)}/yr
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={() => onViewDetails(plan)}>
                  <div className="flex flex-col gap-1">
                    <Badge variant={plan.active ? "default" : "secondary"}>
                      {plan.active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={plan.isPublic ? "outline" : "secondary"}>
                      {plan.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell onClick={() => onViewDetails(plan)}>
                  <span className="text-sm">{plan.displayOrder}</span>
                </TableCell>
                <TableCell onClick={() => onViewDetails(plan)}>
                  <span className="text-sm text-muted-foreground">
                    {plan.updatedAt
                      ? plan.updatedAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
                      <DropdownMenuItem
                        onClick={() => onDelete(plan)}
                        className="text-destructive"
                      >
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

