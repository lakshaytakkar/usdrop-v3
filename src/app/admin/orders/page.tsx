"use client"

import { useState, useMemo } from "react"
import { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ShoppingCart, MoreVertical, Eye, ArrowLeft, DollarSign, AlertCircle, TrendingUp, Plus } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { LargeModal } from "@/components/ui/large-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { CreateOrderForm } from "./components/create-order-form"
import { Order, OrderStatus, OrderFilters } from "@/types/admin/orders"
import { sampleOrders } from "./data/orders"
import { format } from "date-fns"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusTab, setStatusTab] = useState<"all" | OrderStatus>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [largeModalOpen, setLargeModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [createOrderOpen, setCreateOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [refundConfirmOpen, setRefundConfirmOpen] = useState(false)
  const [orderToRefund, setOrderToRefund] = useState<Order | null>(null)

  const plans = useMemo(() => {
    const planSet = new Set(orders.map((o) => o.plan?.name).filter(Boolean))
    return Array.from(planSet).map((name) => ({
      id: orders.find((o) => o.plan?.name === name)?.plan_id || "",
      name: name || "",
    }))
  }, [orders])

  const users = useMemo(() => {
    const userMap = new Map<string, { id: string; email: string; full_name: string | null }>()
    orders.forEach((order) => {
      if (order.user && !userMap.has(order.user.id)) {
        userMap.set(order.user.id, {
          id: order.user.id,
          email: order.user.email,
          full_name: order.user.full_name,
        })
      }
    })
    return Array.from(userMap.values())
  }, [orders])

  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      // Status tab filter
      if (statusTab !== "all" && order.status !== statusTab) return false

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          order.id.toLowerCase().includes(searchLower) ||
          order.user?.email?.toLowerCase().includes(searchLower) ||
          order.user?.full_name?.toLowerCase().includes(searchLower) ||
          order.plan?.name?.toLowerCase().includes(searchLower) ||
          order.razorpay_order_id.toLowerCase().includes(searchLower) ||
          order.razorpay_payment_id?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter from column filters
      const statusFilter = columnFilters.find((f) => f.id === "status")
      if (statusFilter && statusFilter.value && Array.isArray(statusFilter.value) && statusFilter.value.length > 0) {
        if (!statusFilter.value.includes(order.status)) return false
      }

      // Plan filter from column filters
      const planFilter = columnFilters.find((f) => f.id === "planId")
      if (planFilter && planFilter.value && Array.isArray(planFilter.value) && planFilter.value.length > 0) {
        if (!planFilter.value.includes(order.plan_id)) return false
      }

      return true
    })

    // Apply sorting
    if (sorting.length > 0) {
      const sort = sorting[0]
      filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (sort.id) {
          case "created_at":
            aValue = new Date(a.created_at).getTime()
            bValue = new Date(b.created_at).getTime()
            break
          case "amount_inr":
            aValue = a.amount_inr
            bValue = b.amount_inr
            break
          case "status":
            aValue = a.status
            bValue = b.status
            break
          case "user":
            aValue = a.user?.email || ""
            bValue = b.user?.email || ""
            break
          default:
            return 0
        }

        if (aValue < bValue) return sort.desc ? 1 : -1
        if (aValue > bValue) return sort.desc ? -1 : 1
        return 0
      })
    } else {
      // Default sort by created_at descending
      filtered.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    }

    return filtered
  }, [orders, searchQuery, columnFilters, sorting, statusTab])

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredOrders.slice(start, end)
  }, [filteredOrders, page, pageSize])

  const pageCount = Math.ceil(filteredOrders.length / pageSize)

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders
      .filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + o.amount_inr, 0)
    const pendingCount = filteredOrders.filter((o) => o.status === "created").length
    const failedCount = filteredOrders.filter((o) => o.status === "failed").length
    return { totalRevenue, pendingCount, failedCount }
  }, [filteredOrders])

  const getStatusCount = (status: "all" | OrderStatus) => {
    if (status === "all") return orders.length
    return orders.filter((o) => o.status === status).length
  }

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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailDrawerOpen(true)
  }

  const handleQuickView = (order: Order) => {
    setSelectedOrder(order)
    setQuickViewOpen(true)
  }

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order)
    setQuickViewOpen(true)
  }

  const handleLargeModal = (order: Order) => {
    setSelectedOrder(order)
    setLargeModalOpen(true)
  }

  const handleRefund = async (order: Order) => {
    setOrderToRefund(order)
    setRefundConfirmOpen(true)
  }

  const confirmRefund = async () => {
    if (!orderToRefund) return
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Update order status
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderToRefund.id ? { ...o, status: "refunded" as OrderStatus } : o
        )
      )
      setRefundConfirmOpen(false)
      setOrderToRefund(null)
    } catch (error) {
      console.error("Error refunding order:", error)
    }
  }

  const handleBulkRefund = async () => {
    if (selectedOrders.length === 0) return
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.some((so) => so.id === o.id)
            ? { ...o, status: "refunded" as OrderStatus }
            : o
        )
      )
      setSelectedOrders([])
    } catch (error) {
      console.error("Error refunding orders:", error)
    }
  }

  const handleExport = () => {
    const csv = [
      ["Order ID", "User", "Plan", "Amount (INR)", "Status", "Payment ID", "Created At"],
      ...filteredOrders.map((order) => [
        order.id,
        order.user?.email || "",
        order.plan?.name || "",
        (order.amount_inr / 100).toFixed(2),
        order.status,
        order.razorpay_payment_id || "",
        new Date(order.created_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCreateOrder = async (orderData: {
    user_id: string
    plan_id: string
    billing_period: "monthly" | "annual"
    amount_inr: number
    amount_usd: number | null
    status: OrderStatus
    metadata?: Record<string, any>
  }) => {
    // Generate new order ID
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      user_id: orderData.user_id,
      plan_id: orderData.plan_id,
      billing_period: orderData.billing_period,
      razorpay_order_id: `order_rzp_${Date.now()}`,
      razorpay_payment_id: orderData.status === "paid" ? `pay_rzp_${Date.now()}` : null,
      amount_inr: orderData.amount_inr,
      amount_usd: orderData.amount_usd,
      status: orderData.status,
      metadata: orderData.metadata || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: users.find((u) => u.id === orderData.user_id),
      plan: plans.find((p) => p.id === orderData.plan_id),
    }
    setOrders((prev) => [newOrder, ...prev])
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

  const columns: ColumnDef<Order>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
      cell: ({ row }) => (
        <Button
          variant="link"
          className="h-auto p-0 font-mono text-xs text-left justify-start hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            handleQuickView(row.original)
          }}
        >
          {row.original.id.substring(0, 8)}...
        </Button>
      ),
    },
    {
      id: "user",
      accessorFn: (row) => row.user?.email || "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={order.user?.avatar_url || undefined} />
              <AvatarFallback>
                {order.user?.full_name?.charAt(0) || order.user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{order.user?.full_name || "Unknown"}</span>
              <span className="text-xs text-muted-foreground">{order.user?.email}</span>
            </div>
          </div>
        )
      },
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.plan?.name || "Unknown"}</Badge>
      ),
    },
    {
      id: "amount_inr",
      accessorKey: "amount_inr",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex flex-col">
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status) as any}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "tags",
      accessorFn: (row) => getOrderTags(row),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
      cell: ({ row }) => {
        const tags = getOrderTags(row.original)
        if (tags.length === 0) return <span className="text-muted-foreground text-xs">—</span>
        return (
          <div className="flex flex-wrap gap-1">
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment ID" />,
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.original.razorpay_payment_id ? (
            <span>{row.original.razorpay_payment_id.substring(0, 12)}...</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.original.created_at), "MMM dd, yyyy HH:mm")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleQuickView(order)}>
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLargeModal(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View in Drawer
              </DropdownMenuItem>
              {order.status !== "refunded" && order.status !== "failed" && (
                <DropdownMenuItem onClick={() => handleRefund(order)} className="text-destructive">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Refund
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const statusOptions = [
    { label: "Created", value: "created" },
    { label: "Paid", value: "paid" },
    { label: "Failed", value: "failed" },
    { label: "Refunded", value: "refunded" },
  ]

  const planOptions = plans.map((plan) => ({
    label: plan.name,
    value: plan.id,
  }))

  return (
    <>
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Orders</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage payment orders and transactions</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-xl font-bold">₹{(stats.totalRevenue / 100).toFixed(2)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pending Orders</p>
                  <p className="text-xl font-bold text-amber-600">{stats.pendingCount}</p>
                </div>
                <AlertCircle className="h-6 w-6 text-amber-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Failed Orders</p>
                  <p className="text-xl font-bold text-destructive">{stats.failedCount}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-destructive/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)} className="w-full mb-4 flex-shrink-0">
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              All
              <Badge
                variant="secondary"
                className="h-5 min-w-5 rounded-full px-1.5 flex items-center justify-center text-[10px] font-medium leading-none"
              >
                {getStatusCount("all")}
              </Badge>
            </TabsTrigger>
            {statusOptions.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="gap-1.5">
                {option.label}
                <Badge
                  variant="secondary"
                  className="h-5 min-w-5 rounded-full px-1.5 flex items-center justify-center text-[10px] font-medium leading-none"
                >
                  {getStatusCount(option.value as OrderStatus)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* DataTable - No Card wrapper */}
        <div className="flex-1 overflow-hidden min-h-0">
          <DataTable
            columns={columns}
            data={paginatedOrders}
            pageCount={pageCount}
            onPaginationChange={(newPage, newPageSize) => {
              setPage(newPage)
              setPageSize(newPageSize)
            }}
            onSortingChange={setSorting}
            onFilterChange={setColumnFilters}
            onSearchChange={setSearchQuery}
            loading={false}
            initialLoading={false}
            searchPlaceholder="Search orders..."
            page={page}
            pageSize={pageSize}
            enableRowSelection={true}
            onRowSelectionChange={setSelectedOrders}
            onRowClick={handleRowClick}
            onAdd={() => setCreateOrderOpen(true)}
            addButtonText="Create Order"
            addButtonIcon={<Plus className="mr-2 h-4 w-4" />}
            filterConfig={[
              {
                columnId: "status",
                title: "Status",
                options: statusOptions,
              },
              {
                columnId: "planId",
                title: "Plan",
                options: planOptions,
              },
            ]}
            secondaryButtons={[
              ...(selectedOrders.length > 0
                ? [
                    {
                      label: "Refund Selected",
                      icon: <ArrowLeft className="h-4 w-4" />,
                      onClick: handleBulkRefund,
                      variant: "destructive" as const,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>

      {/* Create Order Form */}
      <CreateOrderForm
        open={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onSubmit={handleCreateOrder}
        users={users}
        plans={plans}
      />

      {/* Quick View Modal */}
      {selectedOrder && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={`Order ${selectedOrder.id.substring(0, 8)}`}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge variant={getStatusVariant(selectedOrder.status) as any}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">User</p>
              <p className="text-sm font-medium">{selectedOrder.user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Plan</p>
              <p className="text-sm">{selectedOrder.plan?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="text-sm font-medium">₹{(selectedOrder.amount_inr / 100).toFixed(2)}</p>
            </div>
            {getOrderTags(selectedOrder).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {getOrderTags(selectedOrder).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedOrder)
                }}
              >
                View Full
              </Button>
            </div>
          </div>
        </QuickViewModal>
      )}

      {/* Large Modal */}
      {selectedOrder && (
        <LargeModal
          open={largeModalOpen}
          onOpenChange={setLargeModalOpen}
          title={`Order Details - ${selectedOrder.id}`}
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setLargeModalOpen(false)}>
                Close
              </Button>
              {selectedOrder.status !== "refunded" && selectedOrder.status !== "failed" && (
                <Button variant="destructive" onClick={() => handleRefund(selectedOrder)}>
                  Refund Order
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono text-sm">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={getStatusVariant(selectedOrder.status) as any}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">User</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedOrder.user?.avatar_url || undefined} />
                  <AvatarFallback>
                    {selectedOrder.user?.full_name?.charAt(0) || selectedOrder.user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedOrder.user?.full_name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Plan</p>
              <Badge variant="outline">{selectedOrder.plan?.name || "Unknown"}</Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Billing: {selectedOrder.billing_period.charAt(0).toUpperCase() + selectedOrder.billing_period.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p className="text-2xl font-bold">₹{(selectedOrder.amount_inr / 100).toFixed(2)}</p>
              {selectedOrder.amount_usd && (
                <p className="text-sm text-muted-foreground">${selectedOrder.amount_usd.toFixed(2)}</p>
              )}
            </div>
            {getOrderTags(selectedOrder).length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {getOrderTags(selectedOrder).map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Razorpay Order ID</p>
                <p className="font-mono text-xs">{selectedOrder.razorpay_order_id}</p>
              </div>
              {selectedOrder.razorpay_payment_id && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Razorpay Payment ID</p>
                  <p className="font-mono text-xs">{selectedOrder.razorpay_payment_id}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created At</p>
                <p className="text-sm">
                  {format(new Date(selectedOrder.created_at), "PPpp")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Updated At</p>
                <p className="text-sm">
                  {format(new Date(selectedOrder.updated_at), "PPpp")}
                </p>
              </div>
            </div>
            {selectedOrder.metadata && Object.keys(selectedOrder.metadata).length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">
                  {JSON.stringify(selectedOrder.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </LargeModal>
      )}

      {/* Detail Drawer */}
      {selectedOrder && (
        <DetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          title={`Order ${selectedOrder.id}`}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                      <p className="font-mono text-sm">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={getStatusVariant(selectedOrder.status) as any}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">User</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedOrder.user?.avatar_url || undefined} />
                        <AvatarFallback>
                          {selectedOrder.user?.full_name?.charAt(0) || selectedOrder.user?.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedOrder.user?.full_name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Plan</p>
                    <Badge variant="outline">{selectedOrder.plan?.name || "Unknown"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p className="text-2xl font-bold">₹{(selectedOrder.amount_inr / 100).toFixed(2)}</p>
                  </div>
                  {getOrderTags(selectedOrder).length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {getOrderTags(selectedOrder).map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "payment",
              label: "Payment",
              content: (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Razorpay Order ID</p>
                    <p className="font-mono text-xs">{selectedOrder.razorpay_order_id}</p>
                  </div>
                  {selectedOrder.razorpay_payment_id && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Razorpay Payment ID</p>
                      <p className="font-mono text-xs">{selectedOrder.razorpay_payment_id}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount (INR)</p>
                    <p className="text-lg font-semibold">₹{(selectedOrder.amount_inr / 100).toFixed(2)}</p>
                  </div>
                  {selectedOrder.amount_usd && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount (USD)</p>
                      <p className="text-lg font-semibold">${selectedOrder.amount_usd.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "timeline",
              label: "Timeline",
              content: (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created At</p>
                    <p className="text-sm">{format(new Date(selectedOrder.created_at), "PPpp")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Updated At</p>
                    <p className="text-sm">{format(new Date(selectedOrder.updated_at), "PPpp")}</p>
                  </div>
                </div>
              ),
            },
          ]}
          headerActions={
            selectedOrder.status !== "refunded" && selectedOrder.status !== "failed" ? (
              <Button variant="destructive" size="sm" onClick={() => handleRefund(selectedOrder)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Refund
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Refund Confirmation Dialog */}
      <Dialog open={refundConfirmOpen} onOpenChange={setRefundConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to refund this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {orderToRefund && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Order ID:</span> {orderToRefund.id}
              </p>
              <p className="text-sm">
                <span className="font-medium">Amount:</span> ₹{(orderToRefund.amount_inr / 100).toFixed(2)}
              </p>
              <p className="text-sm">
                <span className="font-medium">User:</span> {orderToRefund.user?.email}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRefund}>
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
