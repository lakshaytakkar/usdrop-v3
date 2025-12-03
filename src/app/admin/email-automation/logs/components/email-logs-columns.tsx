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
import { MoreVertical, Eye } from "lucide-react"
import { EmailLog } from "@/types/admin/email-automation"

interface CreateEmailLogsColumnsProps {
  onViewDetails: (log: EmailLog) => void
  onNameClick?: (log: EmailLog) => void
}

const getStatusBadgeVariant = (status: EmailLog['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'sent':
      return 'default'
    case 'delivered':
      return 'default'
    case 'opened':
      return 'outline'
    case 'clicked':
      return 'outline'
    case 'bounced':
    case 'failed':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getStatusColor = (status: EmailLog['status']) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-500/90 text-white border-green-600'
    case 'opened':
      return 'bg-purple-500/90 text-white border-purple-600'
    case 'clicked':
      return 'bg-orange-500/90 text-white border-orange-600'
    default:
      return ''
  }
}

export function createEmailLogsColumns({
  onViewDetails,
  onNameClick,
}: CreateEmailLogsColumnsProps): ColumnDef<EmailLog>[] {
  return [
    {
      accessorKey: "recipientEmail",
      id: "recipient",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Recipient" />,
      cell: ({ row }) => {
        const log = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{log.recipientEmail}</span>
            <span className="text-xs text-muted-foreground">{log.recipientType.replace(/_/g, ' ')}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "templateId",
      id: "template",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Template" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>
          Template {row.original.templateId}
        </span>
      ),
    },
    {
      accessorKey: "status",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status
        const variant = getStatusBadgeVariant(status)
        const colorClass = getStatusColor(status)
        
        return (
          <Badge 
            variant={variant} 
            onClick={(e) => e.stopPropagation()}
            className={colorClass ? colorClass : ''}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "sentAt",
      id: "sentAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sent At" />,
      cell: ({ row }) => {
        const sentAt = row.original.sentAt
        return (
          <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {sentAt
              ? sentAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
        )
      },
    },
    {
      accessorKey: "openedAt",
      id: "openedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Opened At" />,
      cell: ({ row }) => {
        const openedAt = row.original.openedAt
        return (
          <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {openedAt
              ? openedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
        )
      },
    },
    {
      accessorKey: "clickedAt",
      id: "clickedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Clicked At" />,
      cell: ({ row }) => {
        const clickedAt = row.original.clickedAt
        return (
          <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {clickedAt
              ? clickedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const log = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(log)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}

