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
import { EmailAutomation } from "@/types/admin/email-automation"
import Link from "next/link"

interface CreateAutomationColumnsProps {
  onViewDetails: (automation: EmailAutomation) => void
  onEdit: (automation: EmailAutomation) => void
  onDelete: (automation: EmailAutomation) => void
  onToggleActive?: (automation: EmailAutomation) => void
  onViewStats?: (automation: EmailAutomation) => void
  onNameClick?: (automation: EmailAutomation) => void
}

export function createAutomationColumns({
  onViewDetails,
  onEdit,
  onDelete,
  onToggleActive,
  onViewStats,
  onNameClick,
}: CreateAutomationColumnsProps): ColumnDef<EmailAutomation>[] {
  return [
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const automation = row.original
        return (
          <div className="flex items-center gap-2">
            {onNameClick ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNameClick(automation)
                }}
                className="font-medium hover:underline text-left cursor-pointer"
              >
                {automation.name}
              </button>
            ) : (
              <span className="font-medium">{automation.name}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "trigger",
      id: "trigger",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Trigger" />,
      cell: ({ row }) => {
        const trigger = row.original.trigger
        const formatted = trigger.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        return (
          <Badge variant="outline" onClick={(e) => e.stopPropagation()}>
            {formatted}
          </Badge>
        )
      },
    },
    {
      accessorKey: "templateId",
      id: "template",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Template" />,
      cell: ({ row }) => (
        <Link
          href={`/admin/email-automation/templates/${row.original.templateId}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-primary hover:underline"
        >
          Template {row.original.templateId}
        </Link>
      ),
    },
    {
      accessorKey: "isActive",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const automation = row.original
        return (
          <Badge variant={automation.isActive ? "default" : "secondary"} onClick={(e) => e.stopPropagation()}>
            {automation.isActive ? "Active" : "Inactive"}
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
              {stats.openRate.toFixed(1)}% open, {stats.clickRate.toFixed(1)}% click
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "stats.lastSent",
      id: "lastSent",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Sent" />,
      cell: ({ row }) => {
        const lastSent = row.original.stats?.lastSent
        return (
          <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {lastSent
              ? lastSent.toLocaleDateString("en-US", {
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
        const automation = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(automation)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(automation)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {onViewStats && (
                  <DropdownMenuItem onClick={() => onViewStats(automation)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Stats
                  </DropdownMenuItem>
                )}
                {onToggleActive && (
                  <DropdownMenuItem onClick={() => onToggleActive(automation)}>
                    {automation.isActive ? (
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
                <DropdownMenuItem onClick={() => onDelete(automation)} className="text-destructive">
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





