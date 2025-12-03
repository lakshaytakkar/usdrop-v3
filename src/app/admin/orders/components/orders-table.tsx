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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, ArrowLeft } from "lucide-react"
import { Order, OrderStatus } from "@/types/admin/orders"

interface OrdersTableProps {
  orders: Order[]
  selectedOrders: Order[]
  onSelectOrder: (order: Order, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (order: Order) => void
  onRefund: (order: Order) => void
}

export function OrdersTable({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onViewDetails,
  onRefund,
}: OrdersTableProps) {
  const allSelected = orders.length > 0 && selectedOrders.length === orders.length
  const someSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case "paid":
        return "default"
      case "failed":
        return "destructive"
      case "refunded":
        return "secondary"
      case "created":
        return "outline"
      default:
        return "outline"
    }
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
          <TableHead>Order ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => {
            const isSelected = selectedOrders.some((o) => o.id === order.id)
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectOrder(order, checked as boolean)}
                    aria-label={`Select order ${order.id}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {order.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={order.user?.avatar_url || undefined} />
                      <AvatarFallback>
                        {order.user?.full_name?.charAt(0) || order.user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {order.user?.full_name || "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{order.plan?.name || "Unknown"}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">₹{(order.amount_inr / 100).toFixed(2)}</span>
                    {order.amount_usd && (
                      <span className="text-xs text-muted-foreground">
                        ${order.amount_usd.toFixed(2)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status) as any}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {order.razorpay_payment_id ? (
                    <span>{order.razorpay_payment_id.substring(0, 12)}...</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {order.status !== "refunded" && order.status !== "failed" && (
                        <DropdownMenuItem
                          onClick={() => onRefund(order)}
                          className="text-destructive"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Refund
                        </DropdownMenuItem>
                      )}
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
















