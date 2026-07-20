import { useState, useEffect, useCallback, Suspense } from "react"
import { apiFetch } from "@/lib/supabase"
import { Link } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import { useUserPlan } from "@/hooks/use-user-plan"
import { cn } from "@/lib/utils"
import { Boxes, ClipboardList, Lock } from "lucide-react"
import { RequestFulfillmentDialog } from "./components/request-fulfillment-dialog"
import { RequestDetailSheet } from "./components/request-detail-sheet"
import {
  FulfillmentRequest, STATUS_META, statusBadgeClass, fmtDate, orderItemsSummary,
} from "./lib"

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner
        title="My Requests"
        description="Track the orders our China-warehouse team is fulfilling for you"
        iconSrc="/3d-ecom-icons-blue/Delivery_Truck.png"
        tutorialVideoUrl=""
      />
      {children}
    </div>
  )
}

function RequestsContent() {
  const { isPro, isLoading: planLoading } = useUserPlan()
  const [requests, setRequests] = useState<FulfillmentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FulfillmentRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/fulfillment/requests")
      setRequests(res.ok ? ((await res.json()).requests || []) : [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (isPro && !planLoading) load() }, [isPro, planLoading, load])

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
              Upgrade to request fulfillment and track every order our team ships for you.
            </p>
            <Link href="/llc"><Button>See plans</Button></Link>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{requests.length} requests</span>
        <Button size="sm" className="ml-auto" onClick={() => setDialogOpen(true)} data-testid="button-new-request">
          <Boxes className="h-4 w-4 mr-2" /> Request fulfillment
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><BlueSpinner size="lg" label="Loading requests…" /></div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No requests yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Send an order to our China-warehouse team from <Link href="/fulfillment/orders" className="text-blue-600 underline">My Orders</Link>, or start one here.
            </p>
            <Button onClick={() => setDialogOpen(true)}><Boxes className="h-4 w-4 mr-2" />Request fulfillment</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Quote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(r)}
                    data-testid={`row-request-${r.id}`}
                  >
                    <TableCell className="font-medium">{r.order_number || `Request ${r.id.slice(0, 8)}`}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{orderItemsSummary(r.items)}</TableCell>
                    <TableCell className="text-sm">{r.destination_country}</TableCell>
                    <TableCell>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize", statusBadgeClass(r.status))}>
                        {STATUS_META[r.status]?.label || r.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {r.quote_amount != null ? `${r.currency === "USD" ? "$" : r.currency + " "}${Number(r.quote_amount).toFixed(2)}` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <RequestFulfillmentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreated={load} />
      <RequestDetailSheet request={selected} onClose={() => setSelected(null)} />
    </Shell>
  )
}

export default function FulfillmentRequestsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-8">
        <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 300px)" }}>
          <BlueSpinner size="lg" label="Loading requests…" />
        </div>
      </div>
    }>
      <RequestsContent />
    </Suspense>
  )
}
