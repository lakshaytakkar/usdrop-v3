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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MoreVertical, Eye, Edit, Trash2, Lock, Check, ArrowUp, Clock, AlertCircle } from "lucide-react"
import { ExternalUser } from "@/types/admin/users"

interface ExternalUsersTableProps {
  users: ExternalUser[]
  selectedUsers: ExternalUser[]
  onSelectUser: (user: ExternalUser, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (user: ExternalUser) => void
  onEdit: (user: ExternalUser) => void
  onDelete: (user: ExternalUser) => void
  onSuspend?: (user: ExternalUser) => void
  onActivate?: (user: ExternalUser) => void
  onUpsell?: (user: ExternalUser) => void
}

export function ExternalUsersTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onViewDetails,
  onEdit,
  onDelete,
  onSuspend,
  onActivate,
  onUpsell,
}: ExternalUsersTableProps) {
  const allSelected = users.length > 0 && selectedUsers.length === users.length

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "premium":
        return "default"
      case "enterprise":
        return "default"
      case "pro":
        return "secondary"
      case "trial":
        return "outline"
      case "free":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTrialStatus = (user: ExternalUser) => {
    if (!user.isTrial || !user.trialEndsAt) return null

    const now = new Date()
    const daysRemaining = Math.ceil((user.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const isExpired = now > user.trialEndsAt

    return {
      daysRemaining: isExpired ? 0 : daysRemaining,
      isExpired,
      isEndingSoon: daysRemaining > 0 && daysRemaining <= 3,
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Trial Status</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Subscription Date</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => {
            const isSelected = selectedUsers.some((u) => u.id === user.id)
            const trialStatus = getTrialStatus(user)

            return (
              <TableRow
                key={user.id}
                className={`cursor-pointer hover:bg-muted/50 ${
                  trialStatus?.isEndingSoon ? "bg-amber-50 dark:bg-amber-950/20" : ""
                }`}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectUser(user, checked as boolean)}
                    aria-label={`Select user ${user.id}`}
                  />
                </TableCell>
                <TableCell onClick={() => onViewDetails(user)}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarUrl(user.id, user.email)} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell onClick={() => onViewDetails(user)}>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell onClick={() => onViewDetails(user)}>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPlanBadgeVariant(user.plan)}>
                      {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                    </Badge>
                    {user.isTrial && user.trialEndsAt && (
                      <Clock className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={() => onViewDetails(user)}>
                  {trialStatus ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            {trialStatus.isExpired ? (
                              <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Expired
                              </Badge>
                            ) : trialStatus.isEndingSoon ? (
                              <Badge variant="outline" className="gap-1 border-amber-500 text-amber-700">
                                <Clock className="h-3 w-3" />
                                {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? "s" : ""}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Trial ends: {user.trialEndsAt?.toLocaleDateString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell onClick={() => onViewDetails(user)}>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell onClick={() => onViewDetails(user)}>
                  <span className="text-sm text-muted-foreground">
                    {user.subscriptionDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell onClick={() => onViewDetails(user)}>
                  <span className="text-sm text-muted-foreground">
                    {user.isTrial && user.trialEndsAt
                      ? user.trialEndsAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : user.expiryDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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
                      <DropdownMenuItem onClick={() => onViewDetails(user)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {onUpsell && (
                        <DropdownMenuItem onClick={() => onUpsell(user)}>
                          <ArrowUp className="h-4 w-4 mr-2" />
                          Upsell
                        </DropdownMenuItem>
                      )}
                      {user.status === "active" && onSuspend ? (
                        <DropdownMenuItem onClick={() => onSuspend(user)}>
                          <Lock className="h-4 w-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      ) : (
                        onActivate && (
                          <DropdownMenuItem onClick={() => onActivate(user)}>
                            <Check className="h-4 w-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
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

