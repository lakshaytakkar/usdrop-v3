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
import { MoreVertical, Eye, Edit, Trash2, Check, EyeOff, Copy } from "lucide-react"
import { EmailTemplate } from "@/types/admin/email-automation"

interface CreateTemplateColumnsProps {
  onViewDetails: (template: EmailTemplate) => void
  onEdit: (template: EmailTemplate) => void
  onDelete: (template: EmailTemplate) => void
  onToggleActive?: (template: EmailTemplate) => void
  onDuplicate?: (template: EmailTemplate) => void
  onNameClick?: (template: EmailTemplate) => void
}

export function createTemplateColumns({
  onViewDetails,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
  onNameClick,
}: CreateTemplateColumnsProps): ColumnDef<EmailTemplate>[] {
  return [
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const template = row.original
        return (
          <div className="flex items-center gap-2">
            {onNameClick ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNameClick(template)
                }}
                className="font-medium hover:underline text-left cursor-pointer"
              >
                {template.name}
              </button>
            ) : (
              <span className="font-medium">{template.name}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "subject",
      id: "subject",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          {row.original.subject}
        </span>
      ),
    },
    {
      accessorKey: "type",
      id: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.original.type
        const variant = type === 'utility' ? 'default' : type === 'marketing' ? 'secondary' : 'outline'
        return (
          <Badge variant={variant} onClick={(e) => e.stopPropagation()}>
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "category",
      id: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline" onClick={(e) => e.stopPropagation()}>
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const template = row.original
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Badge variant={template.isActive ? "default" : "secondary"}>
              {template.isActive ? "Active" : "Inactive"}
            </Badge>
            {template.level && (
              <Badge variant="outline" className="text-xs">
                {template.level}
              </Badge>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isActive = value.includes("active")
        const isInactive = value.includes("inactive")
        if (isActive && !row.original.isActive) return false
        if (isInactive && row.original.isActive) return false
        return true
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
        const template = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(template)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(template)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {onToggleActive && (
                  <DropdownMenuItem onClick={() => onToggleActive(template)}>
                    {template.isActive ? (
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
                {onDuplicate && (
                  <DropdownMenuItem onClick={() => onDuplicate(template)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(template)} className="text-destructive">
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





