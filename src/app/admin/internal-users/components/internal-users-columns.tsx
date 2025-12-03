"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MoreVertical, Eye, Edit, Trash2, UserCog, Mail, Lock, Check } from "lucide-react"
import { InternalUser } from "@/types/admin/users"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { cn } from "@/lib/utils"

interface CreateInternalUsersColumnsProps {
  onViewDetails: (user: InternalUser) => void
  onEdit: (user: InternalUser) => void
  onDelete: (user: InternalUser) => void
  onManagePermissions?: (user: InternalUser) => void
  onNameClick?: (user: InternalUser) => void
  onSendEmail?: (user: InternalUser) => void
  onSuspend?: (user: InternalUser) => void
  onActivate?: (user: InternalUser) => void
  canEdit?: boolean
  canDelete?: boolean
  canSuspend?: boolean
  canActivate?: boolean
}

export function createInternalUsersColumns({
  onViewDetails,
  onEdit,
  onDelete,
  onManagePermissions,
  onNameClick,
  onSendEmail,
  onSuspend,
  onActivate,
  canEdit = true,
  canDelete = true,
  canSuspend = true,
  canActivate = true,
}: CreateInternalUsersColumnsProps): ColumnDef<InternalUser>[] {
  const getRoleBadgeClassName = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
      case "manager":
        return "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
      case "executive":
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
      accessorKey: "role",
      id: "role",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const role = row.original.role
        const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)
        return (
          <Badge variant="outline" onClick={(e) => e.stopPropagation()} className={cn("whitespace-nowrap cursor-pointer border", getRoleBadgeClassName(role))} title={roleLabel}>
            {roleLabel}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 120,
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
      accessorKey: "updatedAt",
      id: "updatedAt",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
      cell: ({ row }) => {
        const date = row.original.updatedAt
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
                {(canEdit || onSendEmail || onManagePermissions) && <DropdownMenuSeparator />}
                {onSendEmail && (
                  <DropdownMenuItem onClick={() => onSendEmail(user)} className="cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                )}
                {onManagePermissions && (
                  <DropdownMenuItem onClick={() => onManagePermissions(user)} className="cursor-pointer">
                    <UserCog className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </DropdownMenuItem>
                )}
                {(onSendEmail || onManagePermissions || canSuspend || canActivate) && <DropdownMenuSeparator />}
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

