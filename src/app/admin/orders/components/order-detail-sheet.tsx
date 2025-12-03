"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Order } from "@/types/admin/orders"

interface OrderDetailSheetProps {
  order: Order | null
  open: boolean
  onClose: () => void
}

export function OrderDetailSheet({ order, open, onClose }: OrderDetailSheetProps) {
  if (!order) return null

  const getStatusVariant = (status: string) => {
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>Complete information about this order</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Order ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-sm font-medium">{order.id}</p>
            </div>
            <Badge variant={getStatusVariant(order.status) as any}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          {/* User Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">User</p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={order.user?.avatar_url || undefined} />
                <AvatarFallback>
                  {order.user?.full_name?.charAt(0) || order.user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.user?.full_name || "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Plan Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Plan</p>
            <Badge variant="outline">{order.plan?.name || "Unknown"}</Badge>
            <p className="text-sm text-muted-foreground mt-1">
              Billing: {order.billing_period.charAt(0).toUpperCase() + order.billing_period.slice(1)}
            </p>
          </div>

          {/* Amount */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <div className="flex flex-col">
              <p className="text-2xl font-bold">₹{(order.amount_inr / 100).toFixed(2)}</p>
              {order.amount_usd && (
                <p className="text-sm text-muted-foreground">${order.amount_usd.toFixed(2)}</p>
              )}
            </div>
          </div>

          {/* Payment IDs */}
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Razorpay Order ID</p>
              <p className="font-mono text-xs">{order.razorpay_order_id}</p>
            </div>
            {order.razorpay_payment_id && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Razorpay Payment ID</p>
                <p className="font-mono text-xs">{order.razorpay_payment_id}</p>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created At</p>
              <p className="text-sm">
                {new Date(order.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Updated At</p>
              <p className="text-sm">
                {new Date(order.updated_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Metadata */}
          {order.metadata && Object.keys(order.metadata).length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Metadata</p>
              <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">
                {JSON.stringify(order.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
















