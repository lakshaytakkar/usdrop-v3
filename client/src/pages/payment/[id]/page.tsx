import { useState, useEffect } from "react"
import { useParams } from "@/hooks/use-router"
import { CreditCard, Clock, CheckCircle, XCircle, AlertTriangle, Mail } from "lucide-react"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin-shared"

interface PaymentInfo {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  status: string
  expires_at: string | null
  paid_at: string | null
  creator: { full_name: string } | null
}

const statusConfig: Record<string, { icon: typeof CheckCircle; label: string; color: string }> = {
  pending: { icon: Clock, label: "Awaiting Payment", color: "text-amber-500" },
  paid: { icon: CheckCircle, label: "Payment Received", color: "text-emerald-500" },
  expired: { icon: AlertTriangle, label: "Link Expired", color: "text-red-500" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "text-red-500" },
}

export default function PublicPaymentPage() {
  const { id } = useParams<{ id: string }>()
  const [payment, setPayment] = useState<PaymentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/payment/${id}`)
        if (!res.ok) throw new Error("Not found")
        const data = await res.json()
        setPayment(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse space-y-4 w-full max-w-md px-4">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <XCircle className="size-12 text-muted-foreground mx-auto" />
          <h1 className="text-xl font-bold" data-testid="text-payment-error">Payment link not found</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-payment-error-desc">
            This payment link may have been removed or is invalid.
          </p>
        </div>
      </div>
    )
  }

  const config = statusConfig[payment.status] || statusConfig.pending
  const StatusIcon = config.icon
  const isExpired = payment.expires_at && new Date(payment.expires_at) < new Date() && payment.status === "pending"

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              U
            </div>
          </div>
          <h1 className="text-lg font-bold font-heading" data-testid="text-brand">USDrop AI</h1>
        </div>

        <Card className="p-6 space-y-6">
          <div className="text-center space-y-3">
            <StatusIcon className={`size-10 mx-auto ${config.color}`} />
            <div>
              <h2 className="text-xl font-bold" data-testid="text-payment-title">{payment.title}</h2>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-payment-status-label">
                {isExpired ? "Link Expired" : config.label}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold tracking-tight" data-testid="text-payment-amount">
              ${Number(payment.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{payment.currency}</p>
          </div>

          {payment.description && (
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground" data-testid="text-payment-description">
                {payment.description}
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={isExpired ? "expired" : payment.status} />
            </div>

            {payment.paid_at && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Paid on</span>
                <span className="font-medium" data-testid="text-payment-paid-at">
                  {format(new Date(payment.paid_at), "MMM d, yyyy")}
                </span>
              </div>
            )}

            {payment.expires_at && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Expires</span>
                <span className="font-medium" data-testid="text-payment-expires">
                  {format(new Date(payment.expires_at), "MMM d, yyyy")}
                </span>
              </div>
            )}

            {payment.creator?.full_name && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Created by</span>
                <span className="font-medium" data-testid="text-payment-creator">
                  {payment.creator.full_name}
                </span>
              </div>
            )}
          </div>

          {payment.status === "pending" && !isExpired && (
            <div className="pt-2">
              <Button className="w-full" data-testid="button-contact-rep">
                <Mail className="size-4 mr-1.5" />
                Contact Your Representative
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Reach out to your sales representative to complete this payment.
              </p>
            </div>
          )}
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Powered by USDrop AI
        </p>
      </div>
    </div>
  )
}
