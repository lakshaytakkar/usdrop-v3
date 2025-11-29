"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShoppingCart, MoreVertical, Eye, ArrowLeft, DollarSign, AlertCircle, TrendingUp, Plus, UserPlus, Check, X, Search, Lock, Copy, Mail, User, CreditCard, Download, RefreshCw, FileText, Calendar } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { LargeModal } from "@/components/ui/large-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { CreateOrderForm } from "./components/create-order-form"
import { createOrdersColumns } from "./components/orders-columns"
import { Order, OrderStatus, OrderFilters } from "@/types/admin/orders"
import { sampleOrders } from "./data/orders"
import { format } from "date-fns"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"

export default function AdminOrdersPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("orders.view")
  const { hasPermission: canEdit } = useHasPermission("orders.edit")
  const { hasPermission: canDelete } = useHasPermission("orders.delete")
  const { hasPermission: canRefund } = useHasPermission("orders.refund")
  
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusTab, setStatusTab] = useState<"all" | OrderStatus>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [largeModalOpen, setLargeModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [createOrderOpen, setCreateOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [refundConfirmOpen, setRefundConfirmOpen] = useState(false)
  const [orderToRefund, setOrderToRefund] = useState<Order | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])

  const internalUsers = sampleInternalUsers

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return internalUsers
    const searchLower = memberSearch.toLowerCase()
    return internalUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    )
  }, [memberSearch, internalUsers])

  // Available members (excluding owner and already selected members)
  const availableMembers = useMemo(() => {
    return filteredMembers.filter(
      (user) => user.id !== tempOwner && !tempMembers.includes(user.id)
    )
  }, [filteredMembers, tempOwner, tempMembers])

  const handleOpenAssigneeModal = () => {
    setTempOwner(assignedOwner)
    setTempMembers([...assignedMembers])
    setMemberSearch("")
    setAssigneeModalOpen(true)
  }

  const handleSaveAssignees = () => {
    setAssignedOwner(tempOwner)
    setAssignedMembers(tempMembers)
    setAssigneeModalOpen(false)
  }

  const handleAddMember = (memberId: string) => {
    if (!tempMembers.includes(memberId)) {
      setTempMembers([...tempMembers, memberId])
    }
    setMemberSearch("")
  }

  const handleRemoveMember = (memberId: string) => {
    setTempMembers(tempMembers.filter(id => id !== memberId))
  }

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

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const orderDate = new Date(order.created_at)
        if (dateRange.from && orderDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (orderDate > toDate) return false
        }
      }

      // Quick filter - support overlapping filters
      if (quickFilter) {
        const now = new Date()
        const orderDate = new Date(order.created_at)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        switch (quickFilter) {
          case "paid":
            if (order.status !== "paid") return false
            break
          case "created":
            if (order.status !== "created") return false
            break
          case "failed":
            if (order.status !== "failed") return false
            break
          case "refunded":
            if (order.status !== "refunded") return false
            break
          case "high_value":
            if (order.amount_inr < 1000000) return false // ₹10,000
            break
          case "recent":
            if (orderDate < weekAgo) return false
            break
          case "needs_attention":
            // Pending orders >24 hours OR failed orders
            if (order.status === "created" && orderDate > dayAgo) return false
            if (order.status === "failed") return true
            if (order.status === "created" && orderDate <= dayAgo) return true
            return false
          case "refundable":
            // Paid orders that can be refunded
            if (order.status !== "paid") return false
            break
          case "annual":
            if (order.billing_period !== "annual") return false
            break
          case "large_orders":
            // Top 10% by amount
            const amounts = orders.map(o => o.amount_inr).sort((a, b) => b - a)
            const top10PercentThreshold = amounts[Math.floor(amounts.length * 0.1)] || 0
            if (order.amount_inr < top10PercentThreshold) return false
            break
          case "today":
            if (orderDate < today) return false
            break
          case "this_week":
            if (orderDate < weekStart) return false
            break
          case "this_month":
            if (orderDate < monthStart) return false
            break
        }
      }

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
  }, [orders, searchQuery, columnFilters, sorting, statusTab, quickFilter, dateRange])

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
    const pendingRevenue = filteredOrders
      .filter((o) => o.status === "created")
      .reduce((sum, o) => sum + o.amount_inr, 0)
    const failedRevenue = filteredOrders
      .filter((o) => o.status === "failed")
      .reduce((sum, o) => sum + o.amount_inr, 0)
    const refundedRevenue = filteredOrders
      .filter((o) => o.status === "refunded")
      .reduce((sum, o) => sum + o.amount_inr, 0)
    const averageOrderValue = filteredOrders.length > 0 
      ? filteredOrders.reduce((sum, o) => sum + o.amount_inr, 0) / filteredOrders.length 
      : 0
    return { totalRevenue, pendingRevenue, failedRevenue, refundedRevenue, averageOrderValue }
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

  const handleViewDetails = useCallback((order: Order) => {
    router.push(`/admin/orders/${order.id}`)
  }, [router])

  const handleQuickView = useCallback((order: Order) => {
    setSelectedOrder(order)
    setQuickViewOpen(true)
  }, [])

  const handleCopyOrderId = useCallback(async (order: Order) => {
    try {
      await navigator.clipboard.writeText(order.id)
      showSuccess("Order ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Order ID")
    }
  }, [showSuccess, showError])

  const handleCopyPaymentId = useCallback(async (order: Order) => {
    if (!order.razorpay_payment_id) {
      showError("No payment ID available")
      return
    }
    try {
      await navigator.clipboard.writeText(order.razorpay_payment_id)
      showSuccess("Payment ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Payment ID")
    }
  }, [showSuccess, showError])

  const handleSendEmail = useCallback((order: Order) => {
    if (!order.user?.email) {
      showError("User email not available")
      return
    }
    // TODO: Implement send email
    showInfo(`Email functionality will be implemented. User: ${order.user.email}`)
  }, [showInfo, showError])

  const handleViewUser = useCallback((order: Order) => {
    if (order.user_id) {
      router.push(`/admin/external-users/${order.user_id}`)
    }
  }, [router])

  const handleViewPlan = useCallback((order: Order) => {
    if (order.plan_id) {
      router.push(`/admin/plans`)
      // TODO: Navigate to specific plan if plan detail page exists
      showInfo(`Plan details functionality will be implemented. Plan: ${order.plan?.name}`)
    }
  }, [router, showInfo])

  const handleDownloadReceipt = useCallback((order: Order) => {
    // TODO: Implement download receipt
    showInfo(`Receipt download functionality will be implemented. Order: ${order.id}`)
  }, [showInfo])

  const handleResendPaymentLink = useCallback(async (order: Order) => {
    if (order.status !== "created") {
      showError("Can only resend payment link for pending orders")
      return
    }
    setActionLoading(`resend-${order.id}`)
    try {
      // TODO: Implement resend payment link
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess(`Payment link resent to ${order.user?.email || "user"}`)
    } catch (err) {
      showError("Failed to resend payment link")
    } finally {
      setActionLoading(null)
    }
  }, [showSuccess, showError])

  const handleMarkAsPaid = useCallback(async (order: Order) => {
    if (order.status !== "created") {
      showError("Can only mark pending orders as paid")
      return
    }
    if (!canEdit) {
      showError("You don't have permission to edit orders")
      return
    }
    setActionLoading(`mark-paid-${order.id}`)
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, status: "paid" as OrderStatus, razorpay_payment_id: `pay_rzp_${Date.now()}`, updated_at: new Date().toISOString() }
            : o
        )
      )
      showSuccess(`Order "${order.id.substring(0, 8)}" marked as paid`)
    } catch (err) {
      showError("Failed to mark order as paid")
    } finally {
      setActionLoading(null)
    }
  }, [canEdit, showSuccess, showError])

  const handleDelete = useCallback((order: Order) => {
    if (!canDelete) {
      showError("You don't have permission to delete orders")
      return
    }
    // TODO: Implement delete confirmation
    showInfo(`Delete functionality will be implemented. Order: ${order.id}`)
  }, [canDelete, showError, showInfo])

  const handleRowClick = useCallback((order: Order) => {
    router.push(`/admin/orders/${order.id}`)
  }, [router])

  const handleLargeModal = (order: Order) => {
    setSelectedOrder(order)
    setLargeModalOpen(true)
  }

  const handleRefund = useCallback(async (order: Order) => {
    if (!canRefund) {
      showError("You don't have permission to refund orders")
      return
    }
    setOrderToRefund(order)
    setRefundConfirmOpen(true)
  }, [canRefund, showError])

  const confirmRefund = async () => {
    if (!orderToRefund) return
    setActionLoading("refund")
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
      const refundedOrderId = orderToRefund.id
      setOrderToRefund(null)
      showSuccess(`Order "${refundedOrderId.substring(0, 8)}" has been refunded successfully`)
    } catch (error) {
      console.error("Error refunding order:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to refund order. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setOrders(sampleOrders)
    } catch (err) {
      console.error("Error fetching orders:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load orders. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleBulkRefund = async () => {
    if (selectedOrders.length === 0) return
    if (!canRefund) {
      showError("You don't have permission to refund orders")
      return
    }
    setBulkActionLoading("bulk-refund")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const refundedCount = selectedOrders.length
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.some((so) => so.id === o.id)
            ? { ...o, status: "refunded" as OrderStatus, updated_at: new Date().toISOString() }
            : o
        )
      )
      setSelectedOrders([])
      showSuccess(`${refundedCount} order(s) refunded successfully`)
      await fetchOrders()
    } catch (error) {
      console.error("Error refunding orders:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to refund orders. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkMarkAsPaid = async () => {
    if (selectedOrders.length === 0) return
    if (!canEdit) {
      showError("You don't have permission to edit orders")
      return
    }
    setBulkActionLoading("bulk-mark-paid")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const markedCount = selectedOrders.length
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.some((so) => so.id === o.id && o.status === "created")
            ? { ...o, status: "paid" as OrderStatus, razorpay_payment_id: `pay_rzp_${Date.now()}`, updated_at: new Date().toISOString() }
            : o
        )
      )
      setSelectedOrders([])
      showSuccess(`${markedCount} order(s) marked as paid successfully`)
      await fetchOrders()
    } catch (error) {
      console.error("Error marking orders as paid:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to mark orders as paid. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkExport = useCallback(() => {
    if (selectedOrders.length === 0) {
      showError("No orders selected for export")
      return
    }
    try {
      const csv = [
        ["Order ID", "User", "Plan", "Amount (INR)", "Status", "Payment ID", "Created At"],
        ...selectedOrders.map((order) => [
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
      a.download = `selected-orders-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${selectedOrders.length} order(s) to CSV`)
    } catch (err) {
      showError("Failed to export orders")
    }
  }, [selectedOrders, showSuccess, showError])

  const handleBulkSendEmail = useCallback(async () => {
    if (selectedOrders.length === 0) {
      showError("No orders selected")
      return
    }
    const emails = selectedOrders.map(o => o.user?.email).filter(Boolean)
    if (emails.length === 0) {
      showError("No valid email addresses found")
      return
    }
    // TODO: Implement bulk send email
    showInfo(`Bulk email functionality will be implemented. ${emails.length} user(s) selected.`)
  }, [selectedOrders, showError, showInfo])

  // Only 3-5 most important quick filters
  const quickFilters = [
    { id: "paid", label: "Paid", icon: Check },
    { id: "created", label: "Pending", icon: AlertCircle, isWarning: true },
    { id: "failed", label: "Failed", icon: X },
    { id: "needs_attention", label: "Needs Attention", icon: AlertCircle, isWarning: true },
    { id: "high_value", label: "High Value", icon: DollarSign },
  ]

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) {
      setPageSize(s)
      setPage(1)
    }
  }, [page, pageSize])

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

  const columns = useMemo(
    () =>
      createOrdersColumns({
        onViewDetails: handleViewDetails,
        onQuickView: handleQuickView,
        onRefund: handleRefund,
        onEdit: canEdit ? handleViewDetails : undefined, // TODO: Implement edit
        onDelete: handleDelete,
        onCopyOrderId: handleCopyOrderId,
        onCopyPaymentId: handleCopyPaymentId,
        onSendEmail: handleSendEmail,
        onViewUser: handleViewUser,
        onViewPlan: handleViewPlan,
        onDownloadReceipt: handleDownloadReceipt,
        onResendPaymentLink: handleResendPaymentLink,
        onMarkAsPaid: handleMarkAsPaid,
        onOrderIdClick: handleQuickView,
        canEdit,
        canDelete,
        canRefund,
      }),
    [
      handleViewDetails,
      handleQuickView,
      handleRefund,
      handleDelete,
      handleCopyOrderId,
      handleCopyPaymentId,
      handleSendEmail,
      handleViewUser,
      handleViewPlan,
      handleDownloadReceipt,
      handleResendPaymentLink,
      handleMarkAsPaid,
      canEdit,
      canDelete,
      canRefund,
    ]
  )

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
          <div className="flex items-center gap-2 flex-wrap">
            {assignedOwner || assignedMembers.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-2">
                  {assignedOwner && (() => {
                    const owner = internalUsers.find(u => u.id === assignedOwner)
                    return (
                      <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={getAvatarUrl(assignedOwner, owner?.email)} />
                        <AvatarFallback className="text-xs">
                          {owner?.name.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>
                    )
                  })()}
                  {assignedMembers.slice(0, 3).map((memberId) => {
                    const member = internalUsers.find(u => u.id === memberId)
                    return (
                      <Avatar key={memberId} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={getAvatarUrl(memberId, member?.email)} />
                        <AvatarFallback className="text-xs">
                          {member?.name.charAt(0) || "M"}
                        </AvatarFallback>
                      </Avatar>
                    )
                  })}
                  {assignedMembers.length > 3 && (
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">+{assignedMembers.length - 3}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenAssigneeModal}
                  className="whitespace-nowrap cursor-pointer"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Assignee
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenAssigneeModal}
                className="whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Assignee
              </Button>
            )}
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <div className="mb-2">
            <span className="text-sm font-medium">
              {selectedOrders.length} order{selectedOrders.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        )}

        {/* Metrics Cards - Clickable to apply quick filters */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setQuickFilter(quickFilter === "paid" ? null : "paid")}
          >
            <CardContent className="p-2.5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-base font-semibold">₹{(stats.totalRevenue / 100).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setQuickFilter(quickFilter === "created" ? null : "created")}
          >
            <CardContent className="p-2.5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pending Amount</p>
                <p className="text-base font-semibold">₹{(stats.pendingRevenue / 100).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setQuickFilter(quickFilter === "failed" ? null : "failed")}
          >
            <CardContent className="p-2.5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Failed Amount</p>
                <p className="text-base font-semibold">₹{(stats.failedRevenue / 100).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setQuickFilter(quickFilter === "high_value" ? null : "high_value")}
          >
            <CardContent className="p-2.5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
                <p className="text-base font-semibold">₹{(stats.averageOrderValue / 100).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-3">
          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="cursor-pointer">
                All
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                  {getStatusCount("all")}
                </Badge>
              </TabsTrigger>
              {statusOptions.map((option) => (
                <TabsTrigger key={option.value} value={option.value} className="cursor-pointer">
                  {option.label}
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount(option.value as OrderStatus)}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* DataTable */}
        <div className="flex-1 overflow-hidden min-h-0">
          <DataTable
            columns={columns}
            data={paginatedOrders}
            pageCount={pageCount}
            onPaginationChange={handlePaginationChange}
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
            quickFilters={quickFilters}
            onQuickFilterChange={(filterId) => setQuickFilter(quickFilter === filterId ? null : filterId)}
            selectedQuickFilter={quickFilter}
            secondaryButtons={useMemo(() => {
              if (selectedOrders.length > 0) {
                return [
                  {
                    label: bulkActionLoading === "bulk-refund" ? "Refunding..." : "Refund Selected",
                    icon: bulkActionLoading === "bulk-refund" ? <Loader size="sm" className="mr-2" /> : <ArrowLeft className="h-4 w-4" />,
                    onClick: handleBulkRefund,
                    variant: "destructive" as const,
                    disabled: !canRefund || bulkActionLoading !== null,
                    tooltip: !canRefund ? "You don't have permission to refund orders" : undefined,
                  },
                  {
                    label: bulkActionLoading === "bulk-mark-paid" ? "Marking..." : "Mark as Paid",
                    icon: bulkActionLoading === "bulk-mark-paid" ? <Loader size="sm" className="mr-2" /> : <Check className="h-4 w-4" />,
                    onClick: handleBulkMarkAsPaid,
                    variant: "outline" as const,
                    disabled: !canEdit || bulkActionLoading !== null,
                    tooltip: !canEdit ? "You don't have permission to edit orders" : undefined,
                  },
                  {
                    label: "Export Selected",
                    icon: <Download className="h-4 w-4" />,
                    onClick: handleBulkExport,
                    variant: "outline" as const,
                  },
                  {
                    label: "Send Email",
                    icon: <Mail className="h-4 w-4" />,
                    onClick: handleBulkSendEmail,
                    variant: "outline" as const,
                  },
                  {
                    label: "Clear Selection",
                    onClick: () => setSelectedOrders([]),
                    variant: "ghost" as const,
                  },
                ]
              } else {
                return [
                  {
                    label: "Create Order",
                    icon: <Plus className="h-4 w-4" />,
                    onClick: () => {
                      if (!canEdit) {
                        showError("You don't have permission to create orders")
                        return
                      }
                      setCreateOrderOpen(true)
                    },
                    variant: "default" as const,
                    disabled: !canEdit,
                    tooltip: !canEdit ? "You don't have permission to create orders" : undefined,
                  },
                ]
              }
            }, [selectedOrders, bulkActionLoading, canRefund, canEdit, handleBulkRefund, handleBulkMarkAsPaid, handleBulkExport, handleBulkSendEmail, showError])}
            onDateRangeChange={setDateRange}
            quickFilters={quickFilters}
            selectedQuickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
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

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="mt-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Quick View Modal */}
      <Dialog 
        open={quickViewOpen} 
        onOpenChange={(open) => {
          setQuickViewOpen(open)
          if (!open) {
            setSelectedOrder(null)
          }
        }}
      >
        <DialogContent className="max-w-xs p-4">
          {selectedOrder && (
            <>
              <DialogHeader className="pb-3 space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={selectedOrder.user?.avatar_url || getAvatarUrl(selectedOrder.user_id, selectedOrder.user?.email)}
                    />
                    <AvatarFallback className="text-sm">
                      {selectedOrder.user?.full_name?.charAt(0) || selectedOrder.user?.email?.charAt(0) || "O"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base truncate">Order {selectedOrder.id.substring(0, 8)}</DialogTitle>
                    <DialogDescription className="text-xs truncate">{selectedOrder.user?.email}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge variant={getStatusVariant(selectedOrder.status) as any} className="text-xs px-2 py-0.5">
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Plan</span>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {selectedOrder.plan?.name || "Unknown"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <span className="text-xs font-medium">₹{(selectedOrder.amount_inr / 100).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(selectedOrder.created_at), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
              <DialogFooter className="pt-3 border-t mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuickViewOpen(false)
                    if (selectedOrder) {
                      router.push(`/admin/orders/${selectedOrder.id}`)
                    }
                  }}
                  className="w-full text-sm h-8 cursor-pointer"
                >
                  View More Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

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
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
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
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setRefundConfirmOpen(false)} disabled={actionLoading === "refund"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRefund} disabled={actionLoading === "refund"} className="cursor-pointer">
              {actionLoading === "refund" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Refunding...
                </>
              ) : (
                "Confirm Refund"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Assignee Modal */}
      <Dialog open={assigneeModalOpen} onOpenChange={setAssigneeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Page Access Control</DialogTitle>
            <DialogDescription>
              Manage ownership and access for this page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Owner Section */}
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select value={tempOwner || ""} onValueChange={setTempOwner}>
                <SelectTrigger id="owner" className="w-full">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {internalUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The owner is responsible for maintaining this page
              </p>
            </div>

            {/* Members Section */}
            <div className="space-y-2">
              <Label htmlFor="members">Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {memberSearch || "Search users to add..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search users..." 
                      value={memberSearch}
                      onValueChange={setMemberSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {availableMembers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => handleAddMember(user.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={getAvatarUrl(user.id, user.email)} />
                                <AvatarFallback className="text-xs">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Selected Members */}
              {tempMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tempMembers.map((memberId) => {
                    const member = internalUsers.find(u => u.id === memberId)
                    if (!member) return null
                    return (
                      <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={getAvatarUrl(memberId, member.email)} />
                          <AvatarFallback className="text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigneeModalOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleSaveAssignees} className="cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

