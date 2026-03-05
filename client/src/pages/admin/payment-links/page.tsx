import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Link as LinkIcon, DollarSign, Clock, CheckCircle, CreditCard, Copy, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  FormDialog,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

interface PaymentLink {
  id: string
  lead_user_id: string
  amount: number
  currency: string
  title: string
  description: string
  status: string
  payment_url: string
  paid_at: string | null
  expires_at: string | null
  created_by: string
  created_at: string
  updated_at: string
  prospect: { id: string; full_name: string | null; email: string; avatar_url: string | null } | null
  creator: { id: string; full_name: string | null; email: string } | null
}

interface PaymentStats {
  totalLinks: number
  pendingCount: number
  paidCount: number
  totalRevenue: number
}

interface ProspectUser {
  id: string
  full_name: string | null
  email: string
}

export default function AdminPaymentLinksPage() {
  const { showSuccess, showError } = useToast()
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [stats, setStats] = useState<PaymentStats>({ totalLinks: 0, pendingCount: 0, paidCount: 0, totalRevenue: 0 })
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [prospects, setProspects] = useState<ProspectUser[]>([])

  const [formTitle, setFormTitle] = useState("")
  const [formAmount, setFormAmount] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formProspect, setFormProspect] = useState("")
  const [formExpiry, setFormExpiry] = useState("")

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true)
      const [linksRes, statsRes] = await Promise.all([
        apiFetch("/api/admin/payment-links"),
        apiFetch("/api/admin/payment-links/stats"),
      ])
      if (linksRes.ok) {
        const data = await linksRes.json()
        setLinks(data)
      }
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (err) {
      showError("Failed to load payment links")
    } finally {
      setLoading(false)
    }
  }, [showError])

  const fetchProspects = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/external-users")
      if (res.ok) {
        const data = await res.json()
        const users = data.users || data || []
        setProspects(users.map((u: any) => ({ id: u.id, full_name: u.full_name, email: u.email })))
      }
    } catch {
    }
  }, [])

  useEffect(() => {
    fetchLinks()
    fetchProspects()
  }, [fetchLinks, fetchProspects])

  const resetForm = () => {
    setFormTitle("")
    setFormAmount("")
    setFormDescription("")
    setFormProspect("")
    setFormExpiry("")
  }

  const handleCreate = async () => {
    if (!formTitle || !formAmount || !formProspect) {
      showError("Title, amount, and prospect are required")
      return
    }
    try {
      setSubmitting(true)
      const res = await apiFetch("/api/admin/payment-links", {
        method: "POST",
        body: JSON.stringify({
          title: formTitle,
          amount: parseFloat(formAmount),
          description: formDescription,
          lead_user_id: formProspect,
          expires_at: formExpiry || null,
        }),
      })
      if (!res.ok) throw new Error("Failed to create")
      showSuccess("Payment link created")
      setDialogOpen(false)
      resetForm()
      fetchLinks()
    } catch {
      showError("Failed to create payment link")
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await apiFetch(`/api/admin/payment-links/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update")
      showSuccess(`Payment link ${status === "paid" ? "marked as paid" : status === "cancelled" ? "cancelled" : "updated"}`)
      fetchLinks()
    } catch {
      showError("Failed to update payment link")
    }
  }

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/payment/${id}`
    navigator.clipboard.writeText(url)
    showSuccess("Payment link copied to clipboard")
  }

  const columns: Column<PaymentLink>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (link) => (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" data-testid={`text-title-${link.id}`}>{link.title}</p>
          {link.description && (
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (link) => (
        <span className="text-sm font-semibold" data-testid={`text-amount-${link.id}`}>
          ${Number(link.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          <span className="text-xs text-muted-foreground ml-1">{link.currency}</span>
        </span>
      ),
    },
    {
      key: "prospect",
      header: "Prospect",
      render: (link) => (
        <div className="min-w-0">
          <p className="text-sm truncate" data-testid={`text-prospect-${link.id}`}>
            {link.prospect?.full_name || "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{link.prospect?.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (link) => <StatusBadge status={link.status} />,
    },
    {
      key: "created_at",
      header: "Created",
      sortable: true,
      render: (link) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-created-${link.id}`}>
          {format(new Date(link.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "expires_at",
      header: "Expires",
      render: (link) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-expires-${link.id}`}>
          {link.expires_at ? format(new Date(link.expires_at), "MMM d, yyyy") : "\u2014"}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<PaymentLink>[] = [
    {
      label: "Copy Link URL",
      onClick: (link) => copyLink(link.id),
    },
    {
      label: "Mark as Paid",
      onClick: (link) => handleStatusUpdate(link.id, "paid"),
    },
    {
      label: "Cancel",
      onClick: (link) => handleStatusUpdate(link.id, "cancelled"),
      variant: "destructive",
      separator: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Payment Links"
        subtitle="Create and manage payment links for prospects"
        actions={
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            data-testid="button-create-payment-link"
          >
            <Plus className="size-4 mr-1.5" />
            Create Payment Link
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Links" value={stats.totalLinks} icon={LinkIcon} />
        <StatCard
          label="Pending"
          value={stats.pendingCount}
          icon={Clock}
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
        />
        <StatCard
          label="Paid"
          value={stats.paidCount}
          icon={CheckCircle}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
      </StatGrid>

      <DataTable
        data={links}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder="Search payment links..."
        searchKey="title"
        isLoading={loading}
        filters={[
          {
            label: "Status",
            key: "status",
            options: ["pending", "paid", "expired", "cancelled"],
          },
        ]}
        emptyTitle="No payment links yet"
        emptyDescription="Create your first payment link to get started."
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}
        title="Create Payment Link"
        onSubmit={handleCreate}
        submitLabel="Create Link"
        isSubmitting={submitting}
      >
        <div className="space-y-1.5">
          <Label htmlFor="pl-title">Title</Label>
          <Input
            id="pl-title"
            placeholder="e.g. Mentorship Plan - Monthly"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            data-testid="input-pl-title"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pl-amount">Amount (USD)</Label>
          <Input
            id="pl-amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
            data-testid="input-pl-amount"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pl-description">Description</Label>
          <Textarea
            id="pl-description"
            placeholder="Payment description..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="resize-none"
            data-testid="input-pl-description"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Prospect</Label>
          <Select value={formProspect} onValueChange={setFormProspect}>
            <SelectTrigger data-testid="select-pl-prospect">
              <SelectValue placeholder="Select a prospect" />
            </SelectTrigger>
            <SelectContent>
              {prospects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.full_name || p.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pl-expiry">Expiry Date (optional)</Label>
          <Input
            id="pl-expiry"
            type="date"
            value={formExpiry}
            onChange={(e) => setFormExpiry(e.target.value)}
            data-testid="input-pl-expiry"
          />
        </div>
      </FormDialog>
    </PageShell>
  )
}
