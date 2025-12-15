"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Edit, Trash2, Check, EyeOff, BarChart3 } from "lucide-react"
import { EmailDrip } from "@/types/admin/email-automation"

interface CreateDripColumnsProps {
  onViewDetails: (drip: EmailDrip) => void
  onEdit: (drip: EmailDrip) => void
  onDelete: (drip: EmailDrip) => void
  onToggleActive?: (drip: EmailDrip) => void
  onNameClick?: (drip: EmailDrip) => void
}

export function createDripColumns({
  onViewDetails,
  onEdit,
  onDelete,
  onToggleActive,
  onNameClick,
}: CreateDripColumnsProps): ColumnDef<EmailDrip>[] {
  return [
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const drip = row.original
        return (
          <div className="flex items-center gap-2">
            {onNameClick ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNameClick(drip)
                }}
                className="font-medium hover:underline text-left cursor-pointer"
              >
                {drip.name}
              </button>
            ) : (
              <span className="font-medium">{drip.name}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      id: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.original.type
        const variant = type === 'utility' ? 'default' : 'secondary'
        return (
          <Badge variant={variant} onClick={(e) => e.stopPropagation()}>
            {type}
          </Badge>
        )
      },
    },
    {
      id: "emailCount",
      header: "Emails",
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          {row.original.emails.length}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const drip = row.original
        return (
          <Badge variant={drip.isActive ? "default" : "secondary"} onClick={(e) => e.stopPropagation()}>
            {drip.isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "stats",
      header: "Stats",
      cell: ({ row }) => {
        const stats = row.original.stats
        if (!stats) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <div className="text-sm" onClick={(e) => e.stopPropagation()}>
            <div className="font-medium">{stats.totalSent.toLocaleString()} sent</div>
            <div className="text-xs text-muted-foreground">
              {stats.completionRate.toFixed(1)}% completion
            </div>
          </div>
        )
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
        const drip = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(drip)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(drip)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {onToggleActive && (
                  <DropdownMenuItem onClick={() => onToggleActive(drip)}>
                    {drip.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
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
                <DropdownMenuItem onClick={() => onDelete(drip)} className="text-destructive">
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














