import { useState, useEffect, useCallback, Suspense } from "react"
import { apiFetch } from "@/lib/supabase"
import { Link } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import { useUserPlan } from "@/hooks/use-user-plan"
import { Boxes, ShoppingCart, Lock, Store } from "lucide-react"
import { RequestFulfillmentDialog, RequestPrefill } from "./components/request-fulfillment-dialog"
import { fmtDate } from "./lib"

interface StoreLite { id: string; name?: string; store_name?: string }
interface Order {
  id: string
  shopify_order_id: string
  order_number: string
  email: string | null
  financial_status: string | null
  fulfillment_status: string | null
  total_price: number | null
  currency: string
  line_items: any[]
  customer: any | null
  shopify_created_at: string | null
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner
        title="My Orders"
        description="Send orders from your connected store to our China-warehouse team"
        iconSrc="/3d-ecom-icons-blue/Delivery_Truck.png"
        tutorialVideoUrl=""
      />
      {children}
    </div>
  )
}

function OrdersContent() {
  const { isPro, isLoading: planLoading } = useUserPlan()
  const [stores, setStores] = useState<StoreLite[]>([])
  const [activeStore, setActiveStore] = useState<string>("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [prefill, setPrefill] = useState<RequestPrefill | null>(null)

  const loadStores = useCallback(async () => {
    try {
      const res = await apiFetch("/api/shopify-stores")
      const list = res.ok ? ((await res.json()).stores || []) : []
      setStores(list)
      if (list.length > 0) setActiveStore(list[0].id)
      else setLoading(false)
    } catch {
      setStores([]); setLoading(false)
    }
  }, [])

  const loadOrders = useCallback(async (storeId: string) => {
    try {
      setLoading(true)
      const res = await apiFetch(`/api/shopify-stores/${storeId}/orders`)
      setOrders(res.ok ? ((await res.json()).orders || []) : [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (isPro && !planLoading) loadStores() }, [isPro, planLoading, loadStores])
  useEffect(() => { if (activeStore) loadOrders(activeStore) }, [activeStore, loadOrders])

  if (planLoading) {
    return <Shell><div className="flex justify-center py-20"><BlueSpinner size="lg" label="Loading…" /></div></Shell>
  }

  if (!isPro) {
    return (
      <Shell>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-4"><Lock className="h-6 w-6" /></div>
            <h3 className="text-lg font-semibold mb-1">Fulfillment is a Pro feature</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Upgrade to send your Shopify orders to our China-warehouse team for sourcing, packing and fast shipping.
            </p>
            <Link href="/llc"><Button>See plans</Button></Link>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  if (!loading && stores.length === 0) {
    return (
      <Shell>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mb-4"><Store className="h-6 w-6" /></div>
            <h3 className="text-lg font-semibold mb-1">Connect a store first</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Link your Shopify store to pull in orders, then send them to USDrop fulfillment in one click.
            </p>
            <Link href="/framework/my-store"><Button><Store className="h-4 w-4 mr-2" />Connect store</Button></Link>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="flex items-center gap-3 flex-wrap">
        {stores.length > 1 && (
          <Select value={activeStore} onValueChange={setActiveStore}>
            <SelectTrigger className="w-[220px]" data-testid="select-fulfillment-store">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.store_name || s.name || "Store"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <span className="text-sm text-muted-foreground ml-auto">{orders.length} orders</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><BlueSpinner size="lg" label="Loading orders…" /></div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No orders synced yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Sync your store from <Link href="/framework/my-store" className="text-blue-600 underline">My Store</Link> to see orders here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => {
                  const customerName = o.customer
                    ? `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim()
                    : o.email || "—"
                  const fulfilled = o.fulfillment_status === "fulfilled"
                  return (
                    <TableRow key={o.id} data-testid={`row-ff-order-${o.id}`}>
                      <TableCell className="font-medium">{o.order_number || `#${o.shopify_order_id}`}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmtDate(o.shopify_created_at)}</TableCell>
                      <TableCell className="text-sm">{customerName}</TableCell>
                      <TableCell>
                        <Badge variant={fulfilled ? "default" : "outline"} className="capitalize">
                          {(o.fulfillment_status || "unfulfilled").replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{o.line_items?.length || 0}</TableCell>
                      <TableCell className="text-right font-medium">
                        {o.total_price != null ? `${o.currency === "USD" ? "$" : o.currency + " "}${Number(o.total_price).toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={fulfilled ? "outline" : "default"}
                          disabled={fulfilled}
                          onClick={() => setPrefill({
                            store_id: activeStore,
                            shopify_order_id: o.shopify_order_id,
                            order_number: o.order_number,
                            items: o.line_items || [],
                          })}
                          data-testid={`button-fulfill-${o.id}`}
                        >
                          <Boxes className="h-3.5 w-3.5 mr-1.5" />
                          {fulfilled ? "Fulfilled" : "Fulfill with USDrop"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <RequestFulfillmentDialog
        open={!!prefill}
        onClose={() => setPrefill(null)}
        prefill={prefill || undefined}
        onCreated={() => activeStore && loadOrders(activeStore)}
      />
    </Shell>
  )
}

export default function FulfillmentOrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-8">
        <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 300px)" }}>
          <BlueSpinner size="lg" label="Loading orders…" />
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  )
}
