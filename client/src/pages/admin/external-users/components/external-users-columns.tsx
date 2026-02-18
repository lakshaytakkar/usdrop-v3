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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Edit, Trash2, Lock, Check, ArrowUp, Clock, AlertCircle, Mail, MessageCircle, Coins } from "lucide-react"
import { ExternalUser } from "@/types/admin/users"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { cn } from "@/lib/utils"

interface CreateExternalUsersColumnsProps {
  onViewDetails: (user: ExternalUser) => void
  onEdit: (user: ExternalUser) => void
  onDelete: (user: ExternalUser) => void
  onSuspend?: (user: ExternalUser) => void
  onActivate?: (user: ExternalUser) => void
  onUpsell?: (user: ExternalUser) => void
  onSendEmail?: (user: ExternalUser) => void
  onSendWhatsApp?: (user: ExternalUser) => void
  onManageCredits?: (user: ExternalUser) => void
  onNameClick?: (user: ExternalUser) => void
  canEdit?: boolean
  canDelete?: boolean
  canSuspend?: boolean
  canActivate?: boolean
  canUpsell?: boolean
}

export function createExternalUsersColumns({
  onViewDetails,
  onEdit,
  onDelete,
  onSuspend,
  onActivate,
  onUpsell,
  onSendEmail,
  onSendWhatsApp,
  onManageCredits,
  onNameClick,
  canEdit = true,
  canDelete = true,
  canSuspend = true,
  canActivate = true,
  canUpsell = true,
}: CreateExternalUsersColumnsProps): ColumnDef<ExternalUser>[] {
  // Only Free and Pro plans
  const getPlanBadgeClassName = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
      case "free":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/30 dark:text-slate-300 dark:border-slate-700"
      default:
        return ""
    }
  }

  const getStatusBadgeClassName = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
      case "inactive":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
      case "suspended":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      default:
        return ""
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

  return [
    {
      accessorKey: "name",
      id: "name",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const user = row.original
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          onNameClick?.(user)
        }
        return (
          <div
            className="flex items-center gap-2 min-w-0 cursor-pointer hover:[&>span]:text-primary [&>div]:hover:opacity-80 transition-all"
            onClick={handleClick}
          >
            <div className="shrink-0 pointer-events-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getAvatarUrl(user.id, user.email)} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
            <span className="font-medium truncate min-w-0 pointer-events-none max-w-[150px]" title={user.name}>
              {user.name}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      id: "email",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <span className="text-sm truncate block max-w-[200px]" onClick={(e) => e.stopPropagation()} title={row.original.email}>
          {row.original.email}
        </span>
      ),
      size: 220,
    },
    {
      accessorKey: "plan",
      id: "plan",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
      cell: ({ row }) => {
        const user = row.original
        const planLabel = user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Badge variant="outline" className={cn("whitespace-nowrap border cursor-pointer", getPlanBadgeClassName(user.plan))} title={planLabel}>
              {planLabel}
            </Badge>
            {user.isTrial && user.trialEndsAt && <Clock className="h-4 w-4 text-amber-600" />}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 120,
    },
    {
      accessorKey: "trialStatus",
      id: "trialStatus",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Trial" />,
      cell: ({ row }) => {
        const user = row.original
        const trialStatus = getTrialStatus(user)

        if (!trialStatus) {
          return <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>—</span>
        }

        return (
          <div 
            className="flex items-center gap-2" 
            onClick={(e) => e.stopPropagation()}
            title={user.trialEndsAt ? `Trial ends: ${user.trialEndsAt.toLocaleDateString()}` : undefined}
          >
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
        )
      },
    },
    {
      accessorKey: "status",
      id: "status",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)
        return (
          <Badge variant="outline" onClick={(e) => e.stopPropagation()} className={cn("whitespace-nowrap cursor-pointer border", getStatusBadgeClassName(status))} title={statusLabel}>
            {statusLabel}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 110,
    },
    {
      accessorKey: "subscriptionDate",
      id: "subscriptionDate",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sub. Date" />,
      cell: ({ row }) => {
        const date = row.original.subscriptionDate
        return (
          <span className="text-sm text-muted-foreground whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      accessorKey: "expiryDate",
      id: "expiryDate",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Expiry Date" />,
      cell: ({ row }) => {
        const user = row.original
        const date = user.isTrial && user.trialEndsAt ? user.trialEndsAt : user.expiryDate
        return (
          <span className="text-sm text-muted-foreground whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      accessorKey: "credits",
      id: "credits",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Credits" />,
      cell: ({ row }) => {
        const credits = row.original.credits || 0
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{credits.toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex justify-end pr-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Actions</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" side="left" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails(user)} className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {(canEdit || onSendEmail || (onSendWhatsApp && user.phoneNumber)) && <DropdownMenuSeparator />}
              {onSendEmail && (
                <DropdownMenuItem onClick={() => onSendEmail(user)} className="cursor-pointer">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </DropdownMenuItem>
              )}
              {onSendWhatsApp && user.phoneNumber && (
                <DropdownMenuItem onClick={() => onSendWhatsApp(user)} className="cursor-pointer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send WhatsApp
                </DropdownMenuItem>
              )}
              {(onSendEmail || (onSendWhatsApp && user.phoneNumber) || onManageCredits || onUpsell) && <DropdownMenuSeparator />}
              {onManageCredits && (
                <DropdownMenuItem onClick={() => onManageCredits(user)} className="cursor-pointer">
                  <Coins className="h-4 w-4 mr-2" />
                  Manage Credits
                </DropdownMenuItem>
              )}
              {canUpsell && onUpsell && (
                <DropdownMenuItem onClick={() => onUpsell(user)} className="cursor-pointer">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Upsell
                </DropdownMenuItem>
              )}
              {(onManageCredits || (canUpsell && onUpsell) || canSuspend || canActivate) && <DropdownMenuSeparator />}
              {user.status === "active" && canSuspend && onSuspend ? (
                <DropdownMenuItem onClick={() => onSuspend(user)} className="cursor-pointer">
                  <Lock className="h-4 w-4 mr-2" />
                  Suspend
                </DropdownMenuItem>
              ) : (
                canActivate && onActivate && (
                  <DropdownMenuItem onClick={() => onActivate(user)} className="cursor-pointer">
                    <Check className="h-4 w-4 mr-2" />
                    Activate
                  </DropdownMenuItem>
                )
              )}
              {canDelete && <DropdownMenuSeparator />}
              {canDelete && (
                <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive cursor-pointer">
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

