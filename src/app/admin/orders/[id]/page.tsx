"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash2,
  ArrowLeft,
  DollarSign,
  Calendar,
  CreditCard,
  User,
  MoreVertical,
  ShoppingCart,
} from "lucide-react"
import { Order, OrderStatus } from "@/types/admin/orders"
import { sampleOrders } from "../data/orders"
import { format } from "date-fns"

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [allOrders, setAllOrders] = useState<Order[]>(sampleOrders)

  useEffect(() => {
    // Find current order
    const currentOrder = allOrders.find((o) => o.id === orderId)
    setOrder(currentOrder || null)
  }, [orderId, allOrders])

  // Find previous and next orders
  const { prevOrder, nextOrder } = useMemo(() => {
    if (!order) return { prevOrder: null, nextOrder: null }
    
    const currentIndex = allOrders.findIndex((o) => o.id === order.id)
    const prev = currentIndex > 0 ? allOrders[currentIndex - 1] : null
    const next = currentIndex < allOrders.length - 1 ? allOrders[currentIndex + 1] : null
    
    return { prevOrder: prev, nextOrder: next }
  }, [order, allOrders])

  if (!order) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Order not found</div>
        </div>
      </div>
    )
  }

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

  // Handler functions (placeholder - should be connected to actual handlers)
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit order:", order.id)
  }

  const handleRefund = () => {
    // TODO: Implement refund
    console.log("Refund order:", order.id)
  }

  const handleDelete = () => {
    // TODO: Implement delete
    console.log("Delete order:", order.id)
  }

  // Get tags from metadata or generate based on order properties
  const getOrderTags = (order: Order): string[] => {
    if (order.metadata?.tags && Array.isArray(order.metadata.tags)) {
      return order.metadata.tags
    }
    const tags: string[] = []
    if (order.billing_period === "annual") tags.push("Annual")
    if (order.amount_inr > 100000) tags.push("High Value")
    if (order.status === "paid") tags.push("Paid")
    return tags
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar with Back Button, Breadcrumbs and Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex h-14 items-center gap-2 px-3">
          {/* Back Button - Small Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/orders")}
            className="h-8 w-8 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-1 min-w-0">
            <Link href="/admin/orders" className="hover:text-foreground transition-colors whitespace-nowrap cursor-pointer">
              Orders
            </Link>
            <span>/</span>
            <span className="line-clamp-1 font-mono text-xs">{order.id.substring(0, 12)}...</span>
          </nav>

          {/* Prev/Next Navigation on Right */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {prevOrder && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/orders/${prevOrder.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Prev
              </Button>
            )}
            {nextOrder && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/orders/${nextOrder.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3">

      {/* Order Header */}
      <Card className="mb-2">
        <CardHeader className="pb-2 px-4 pt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg mb-0.5 font-mono">{order.id}</CardTitle>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant={getStatusVariant(order.status)} className="text-xs">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  {getOrderTags(order).length > 0 && (
                    <>
                      {getOrderTags(order).slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Button Group with Edit and More Actions */}
            <div className="flex items-center gap-1.5">
              {order.status !== "refunded" && order.status !== "failed" && (
                <Button onClick={handleRefund} className="cursor-pointer" size="sm" variant="outline">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  Refund
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList>
          <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
          <TabsTrigger value="payment" className="cursor-pointer">Payment</TabsTrigger>
          <TabsTrigger value="timeline" className="cursor-pointer">Timeline</TabsTrigger>
          <TabsTrigger value="related" className="cursor-pointer">Related Orders</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Order ID</span>
                  <span className="text-xs font-mono font-medium">{order.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge variant={getStatusVariant(order.status)} className="text-xs">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Billing Period</span>
                  <span className="text-xs font-medium capitalize">{order.billing_period}</span>
                </div>
                {getOrderTags(order).length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {getOrderTags(order).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                {order.user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.user.avatar_url || undefined} />
                        <AvatarFallback>
                          {order.user.full_name?.charAt(0) || order.user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{order.user.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{order.user.email}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No user information available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                {order.plan ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Plan Name</span>
                      <Badge variant="outline" className="text-xs">{order.plan.name}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Plan Slug</span>
                      <span className="text-xs font-mono">{order.plan.slug}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No plan information available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Amount</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">₹{(order.amount_inr / 100).toFixed(2)}</p>
                    {order.amount_usd && (
                      <p className="text-sm text-muted-foreground">${order.amount_usd.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Razorpay Order ID</p>
                    <p className="text-sm font-medium font-mono">{order.razorpay_order_id}</p>
                  </div>
                </div>
                {order.razorpay_payment_id && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Razorpay Payment ID</p>
                      <p className="text-sm font-medium font-mono">{order.razorpay_payment_id}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Amount (INR)</p>
                    <p className="text-sm font-medium">₹{(order.amount_inr / 100).toFixed(2)}</p>
                  </div>
                </div>
                {order.amount_usd && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Amount (USD)</p>
                      <p className="text-sm font-medium">${order.amount_usd.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="text-sm font-medium">
                      {format(new Date(order.created_at), "PPpp")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Updated At</p>
                    <p className="text-sm font-medium">
                      {format(new Date(order.updated_at), "PPpp")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Related Orders</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-3">
                <p className="text-sm text-muted-foreground">
                  Related orders from the same user or plan will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      </div>
    </div>
  )
}

