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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Copy,
  Mail,
  User,
  CreditCard,
  Download,
  RefreshCw,
  Check,
  FileText,
} from "lucide-react"
import { Order, OrderStatus } from "@/types/admin/orders"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { format } from "date-fns"

interface CreateOrdersColumnsProps {
  onViewDetails: (order: Order) => void
  onQuickView: (order: Order) => void
  onRefund?: (order: Order) => void
  onEdit?: (order: Order) => void
  onDelete?: (order: Order) => void
  onCopyOrderId?: (order: Order) => void
  onCopyPaymentId?: (order: Order) => void
  onSendEmail?: (order: Order) => void
  onViewUser?: (order: Order) => void
  onViewPlan?: (order: Order) => void
  onDownloadReceipt?: (order: Order) => void
  onResendPaymentLink?: (order: Order) => void
  onMarkAsPaid?: (order: Order) => void
  onOrderIdClick?: (order: Order) => void
  canEdit?: boolean
  canDelete?: boolean
  canRefund?: boolean
}

export function createOrdersColumns({
  onViewDetails,
  onQuickView,
  onRefund,
  onEdit,
  onDelete,
  onCopyOrderId,
  onCopyPaymentId,
  onSendEmail,
  onViewUser,
  onViewPlan,
  onDownloadReceipt,
  onResendPaymentLink,
  onMarkAsPaid,
  onOrderIdClick,
  canEdit = true,
  canDelete = true,
  canRefund = true,
}: CreateOrdersColumnsProps): ColumnDef<Order>[] {
  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case "paid":
        return "default" as const
      case "failed":
        return "destructive" as const
      case "refunded":
        return "secondary" as const
      case "created":
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  const getInitials = (order: Order) => {
    if (order.user?.full_name) {
      return order.user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (order.user?.email) {
      return order.user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  return [
    {
      id: "id",
      accessorKey: "id",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
      cell: ({ row }) => {
        const order = row.original
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          onOrderIdClick?.(order) || onQuickView(order)
        }
        // Extract short ID (e.g., "ORD_001" from full ID)
        const shortId = order.id.length > 12 ? order.id.substring(0, 12) : order.id
        return (
          <Button
            variant="ghost"
            className="h-auto p-0 font-mono text-xs text-left justify-start hover:no-underline cursor-pointer font-semibold"
            onClick={handleClick}
            title={order.id}
          >
            {shortId.toUpperCase()}
          </Button>
        )
      },
      size: 140,
    },
    {
      id: "user",
      accessorFn: (row) => row.user?.email || "",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const order = row.original
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          onQuickView(order)
        }
        return (
          <div
            className="flex items-center gap-2 min-w-0 cursor-pointer hover:[&>div>span]:text-primary [&>div]:hover:opacity-80 transition-all"
            onClick={handleClick}
          >
            <div className="shrink-0 pointer-events-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src={order.user?.avatar_url || getAvatarUrl(order.user_id, order.user?.email)} />
                <AvatarFallback className="text-xs">{getInitials(order)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col min-w-0 pointer-events-none">
              <span className="text-sm font-medium truncate max-w-[150px]" title={order.user?.full_name || "Unknown"}>
                {order.user?.full_name || "Unknown"}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={order.user?.email}>
                {order.user?.email}
              </span>
            </div>
          </div>
        )
      },
      size: 220,
    },
    {
      id: "planId",
      accessorKey: "plan_id",
      header: () => null,
      cell: () => null,
      enableHiding: true,
      meta: {
        hidden: true,
      },
      filterFn: (row, id, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) return true
        return value.includes(row.original.plan_id)
      },
    },
    {
      id: "plan",
      accessorFn: (row) => row.plan?.name || "",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
      cell: ({ row }) => (
        <Badge variant="outline" onClick={(e) => e.stopPropagation()} className="whitespace-nowrap" title={row.original.plan?.name || "Unknown"}>
          {row.original.plan?.name || "Unknown"}
        </Badge>
      ),
      size: 140,
    },
    {
      id: "amount_inr",
      accessorKey: "amount_inr",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium">₹{(order.amount_inr / 100).toFixed(2)}</span>
            {order.amount_usd && (
              <span className="text-xs text-muted-foreground">${order.amount_usd.toFixed(2)}</span>
            )}
          </div>
        )
      },
    },
    {
      id: "status",
      accessorKey: "status",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)
        return (
          <Badge variant={getStatusVariant(status)} onClick={(e) => e.stopPropagation()} className="whitespace-nowrap" title={statusLabel}>
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
      id: "tags",
      accessorFn: (row) => {
        const tags: string[] = []
        if (row.billing_period === "annual") tags.push("Annual")
        if (row.amount_inr > 100000) tags.push("High Value")
        if (row.status === "paid") tags.push("Paid")
        return tags
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
      cell: ({ row }) => {
        const order = row.original
        const tags: string[] = []
        if (order.billing_period === "annual") tags.push("Annual")
        if (order.amount_inr > 100000) tags.push("High Value")
        if (order.status === "paid") tags.push("Paid")
        
        if (tags.length === 0) return <span className="text-muted-foreground text-xs" onClick={(e) => e.stopPropagation()}>—</span>
        return (
          <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      id: "razorpay_payment_id",
      accessorKey: "razorpay_payment_id",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment ID" />,
      cell: ({ row }) => (
        <div className="font-mono text-xs" onClick={(e) => e.stopPropagation()}>
          {row.original.razorpay_payment_id ? (
            <span title={row.original.razorpay_payment_id}>{row.original.razorpay_payment_id.substring(0, 12)}...</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => (
        <div className="text-sm whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          {format(new Date(row.original.created_at), "MMM dd, yyyy HH:mm")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original
        const isRefundable = order.status === "paid" || order.status === "created"
        const canMarkAsPaid = order.status === "created"

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
                <DropdownMenuItem onClick={() => onViewDetails(order)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickView(order)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </DropdownMenuItem>
                {canEdit && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(order)} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {(canEdit || onCopyOrderId || onCopyPaymentId) && <DropdownMenuSeparator />}
                {onCopyOrderId && (
                  <DropdownMenuItem onClick={() => onCopyOrderId(order)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Order ID
                  </DropdownMenuItem>
                )}
                {onCopyPaymentId && order.razorpay_payment_id && (
                  <DropdownMenuItem onClick={() => onCopyPaymentId(order)} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Payment ID
                  </DropdownMenuItem>
                )}
                {(onCopyOrderId || onCopyPaymentId || onSendEmail || onViewUser || onViewPlan) && <DropdownMenuSeparator />}
                {onSendEmail && (
                  <DropdownMenuItem onClick={() => onSendEmail(order)} className="cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                )}
                {onViewUser && (
                  <DropdownMenuItem onClick={() => onViewUser(order)} className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    View User
                  </DropdownMenuItem>
                )}
                {onViewPlan && (
                  <DropdownMenuItem onClick={() => onViewPlan(order)} className="cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Plan
                  </DropdownMenuItem>
                )}
                {(onSendEmail || onViewUser || onViewPlan || onDownloadReceipt || onResendPaymentLink || onMarkAsPaid) && <DropdownMenuSeparator />}
                {onDownloadReceipt && order.status === "paid" && (
                  <DropdownMenuItem onClick={() => onDownloadReceipt(order)} className="cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </DropdownMenuItem>
                )}
                {onResendPaymentLink && order.status === "created" && (
                  <DropdownMenuItem onClick={() => onResendPaymentLink(order)} className="cursor-pointer">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Payment Link
                  </DropdownMenuItem>
                )}
                {onMarkAsPaid && canMarkAsPaid && (
                  <DropdownMenuItem onClick={() => onMarkAsPaid(order)} className="cursor-pointer">
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </DropdownMenuItem>
                )}
                {(onDownloadReceipt || onResendPaymentLink || onMarkAsPaid || canRefund || canDelete) && <DropdownMenuSeparator />}
                {canRefund && isRefundable && onRefund && (
                  <DropdownMenuItem onClick={() => onRefund(order)} className="text-destructive cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Refund
                  </DropdownMenuItem>
                )}
                {canDelete && onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(order)} className="text-destructive cursor-pointer">
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

