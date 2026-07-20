import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Boxes } from "lucide-react"
import { orderItemsSummary } from "../lib"

export interface RequestPrefill {
  store_id?: string | null
  shopify_order_id?: string | null
  order_number?: string | null
  items?: any[]
}

interface RequestFulfillmentDialogProps {
  open: boolean
  onClose: () => void
  prefill?: RequestPrefill
  onCreated?: () => void
}

export function RequestFulfillmentDialog({ open, onClose, prefill, onCreated }: RequestFulfillmentDialogProps) {
  const { showSuccess, showError } = useToast()
  const [orderNumber, setOrderNumber] = useState("")
  const [destination, setDestination] = useState("US")
  const [notes, setNotes] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setOrderNumber(prefill?.order_number || "")
      setDestination("US")
      setNotes("")
    }
  }, [open, prefill])

  const items = prefill?.items || []
  const linkedToOrder = !!prefill?.shopify_order_id

  async function submit() {
    setBusy(true)
    try {
      const res = await apiFetch("/api/fulfillment/requests", {
        method: "POST",
        body: JSON.stringify({
          store_id: prefill?.store_id ?? null,
          shopify_order_id: prefill?.shopify_order_id ?? null,
          order_number: orderNumber.trim() || null,
          items,
          destination_country: destination.trim() || "US",
          notes: notes.trim() || null,
        }),
      })
      if (res.status === 403) {
        showError("Fulfillment is a Pro feature. Upgrade to request fulfillment.")
        return
      }
      if (!res.ok) throw new Error("Failed")
      showSuccess("Fulfillment requested — our team will review it shortly.")
      onCreated?.()
      onClose()
    } catch {
      showError("Couldn't submit your request. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-blue-600" />
            Request USDrop fulfillment
          </DialogTitle>
          <DialogDescription>
            Our China-warehouse team will source, quality-check, pack and ship this for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {linkedToOrder && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Linked order</div>
              <div className="text-sm font-medium text-slate-900 mt-0.5">
                {prefill?.order_number || `#${prefill?.shopify_order_id}`}
              </div>
              <div className="text-[12.5px] text-slate-500">{orderItemsSummary(items)}</div>
            </div>
          )}

          {!linkedToOrder && (
            <div className="space-y-1.5">
              <Label htmlFor="ff-order">Order reference</Label>
              <Input
                id="ff-order"
                placeholder="e.g. #1042 or a short description"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                data-testid="input-fulfillment-order"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ff-dest">Destination country</Label>
            <Input
              id="ff-dest"
              placeholder="US"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              data-testid="input-fulfillment-destination"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ff-notes">Notes for our team (optional)</Label>
            <Textarea
              id="ff-notes"
              rows={3}
              placeholder="Anything we should know — variants, packaging, deadlines…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="input-fulfillment-notes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy} data-testid="button-submit-fulfillment">
            {busy ? "Submitting…" : "Request fulfillment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
