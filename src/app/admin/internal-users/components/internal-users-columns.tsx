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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Edit, Trash2, UserCog } from "lucide-react"
import { InternalUser } from "@/types/admin/users"

interface CreateInternalUsersColumnsProps {
  onViewDetails: (user: InternalUser) => void
  onEdit: (user: InternalUser) => void
  onDelete: (user: InternalUser) => void
  onManagePermissions?: (user: InternalUser) => void
}

export function createInternalUsersColumns({
  onViewDetails,
  onEdit,
  onDelete,
  onManagePermissions,
}: CreateInternalUsersColumnsProps): ColumnDef<InternalUser>[] {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "superadmin":
        return "default" as const
      case "admin":
        return "default" as const
      case "manager":
        return "secondary" as const
      case "executive":
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default" as const
      case "inactive":
        return "secondary" as const
      case "suspended":
        return "destructive" as const
      default:
        return "outline" as const
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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(user.name)}`} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      id: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <span className="text-sm" onClick={(e) => e.stopPropagation()}>{row.original.email}</span>,
    },
    {
      accessorKey: "role",
      id: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const role = row.original.role
        return (
          <Badge variant={getRoleBadgeVariant(role)} onClick={(e) => e.stopPropagation()}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "status",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={getStatusBadgeVariant(status)} onClick={(e) => e.stopPropagation()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "updatedAt",
      id: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
      cell: ({ row }) => {
        const date = row.original.updatedAt
        return (
          <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
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
          <div onClick={(e) => e.stopPropagation()}>
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
                {onManagePermissions && (
                  <DropdownMenuItem onClick={() => onManagePermissions(user)}>
                    <UserCog className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
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

