import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShoppingCart, Search } from "lucide-react"
import { BlueSpinner } from "@/components/ui/blue-spinner"

interface StoreOrder {
  id: string
  store_id: string
  shopify_order_id: string
  order_number: string
  email: string | null
  financial_status: string | null
  fulfillment_status: string | null
  total_price: number | null
  subtotal_price: number | null
  total_tax: number | null
  currency: string
  line_items: any[]
  customer: any | null
  shipping_address: any | null
  shopify_created_at: string | null
  created_at: string
  updated_at: string
}

interface StoreOrdersProps {
  storeId: string
}

const financialStatusColor = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'paid': return 'default'
    case 'partially_paid': return 'secondary'
    case 'refunded':
    case 'voided': return 'destructive'
    case 'pending':
    case 'authorized': return 'outline'
    default: return 'secondary'
  }
}

const fulfillmentStatusColor = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'fulfilled': return 'default'
    case 'partial': return 'secondary'
    case 'unfulfilled':
    case null: return 'outline'
    default: return 'secondary'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function StoreOrders({ storeId }: StoreOrdersProps) {
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [financialFilter, setFinancialFilter] = useState("all")

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/shopify-stores/${storeId}/orders`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [storeId])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = orders.filter(o => {
    const matchesSearch = !search ||
      (o.order_number && o.order_number.toLowerCase().includes(search.toLowerCase())) ||
      (o.email && o.email.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer?.first_name && o.customer.first_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer?.last_name && o.customer.last_name.toLowerCase().includes(search.toLowerCase()))
    const matchesFinancial = financialFilter === "all" || o.financial_status === financialFilter
    return matchesSearch && matchesFinancial
  })

  const totalRevenue = filtered.reduce((sum, o) => sum + (o.total_price ? Number(o.total_price) : 0), 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <BlueSpinner size="lg" label="Loading orders..." />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No Orders Synced</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Click "Sync Now" to pull your Shopify orders into USDrop.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-orders"
          />
        </div>
        <Select value={financialFilter} onValueChange={setFinancialFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-financial-filter">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="partially_paid">Partially Paid</SelectItem>
            <SelectItem value="authorized">Authorized</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4 ml-auto text-sm">
          <span className="text-muted-foreground" data-testid="text-orders-showing">
            {filtered.length} of {orders.length} orders
          </span>
          <span className="font-semibold" data-testid="text-orders-revenue">
            Total: ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const customerName = order.customer
                  ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
                  : order.email || '—'

                return (
                  <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                    <TableCell>
                      <span className="font-medium" data-testid={`text-order-number-${order.id}`}>
                        {order.order_number || `#${order.shopify_order_id}`}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.shopify_created_at ? formatDate(order.shopify_created_at) : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="text-sm font-medium truncate">{customerName}</p>
                        {order.email && customerName !== order.email && (
                          <p className="text-xs text-muted-foreground truncate">{order.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={financialStatusColor(order.financial_status)}
                        className="capitalize"
                        data-testid={`badge-order-payment-${order.id}`}
                      >
                        {(order.financial_status || 'unknown').replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={fulfillmentStatusColor(order.fulfillment_status)}
                        className="capitalize"
                        data-testid={`badge-order-fulfillment-${order.id}`}
                      >
                        {(order.fulfillment_status || 'unfulfilled').replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.line_items?.length || 0} items
                    </TableCell>
                    <TableCell className="text-right font-medium" data-testid={`text-order-total-${order.id}`}>
                      {order.total_price != null
                        ? `${order.currency === 'USD' ? '$' : order.currency + ' '}${Number(order.total_price).toFixed(2)}`
                        : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
