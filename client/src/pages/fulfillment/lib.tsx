/* Phase H — Fulfillment Suite shared types + status metadata.
   Positioning: USDrop fulfills from its OWN China warehouse on a branded fast
   line — honest about China origin, premium vs the merchant DIY-ing AliExpress. */

export interface FulfillmentRequest {
  id: string
  user_id: string
  store_id: string | null
  shopify_order_id: string | null
  order_number: string | null
  items: any[]
  quantity: number
  destination_country: string
  status: FulfillmentStatus
  quote_amount: number | null
  currency: string
  carrier: string | null
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type FulfillmentStatus =
  | "requested"
  | "quoted"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

/* The happy-path pipeline rendered as a timeline / stepper. `cancelled` is a
   terminal off-path state handled separately. */
export const PIPELINE: FulfillmentStatus[] = [
  "requested",
  "quoted",
  "processing",
  "shipped",
  "delivered",
]

export const STATUS_META: Record<FulfillmentStatus, { label: string; blurb: string }> = {
  requested: { label: "Requested", blurb: "Our team has your request and is reviewing the order." },
  quoted: { label: "Quoted", blurb: "Fulfillment cost confirmed and ready to proceed." },
  processing: { label: "Processing", blurb: "Sourced, quality-checked and packed at our China warehouse." },
  shipped: { label: "Shipped", blurb: "On the way on our fast line with live tracking." },
  delivered: { label: "Delivered", blurb: "Delivered to your customer." },
  cancelled: { label: "Cancelled", blurb: "This request was cancelled." },
}

export function statusIndex(status: FulfillmentStatus): number {
  return PIPELINE.indexOf(status)
}

/* Tailwind classes for the status badge (kept off inline styles per design canon). */
export function statusBadgeClass(status: FulfillmentStatus): string {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "processing":
      return "bg-indigo-50 text-indigo-700 border-indigo-200"
    case "quoted":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200"
    default:
      return "bg-slate-100 text-slate-600 border-slate-200"
  }
}

/* Representational warehouse identity (real vendor wiring deferred). */
export const WAREHOUSE = {
  name: "USDrop Shenzhen Fulfillment Center",
  location: "Shenzhen, Guangdong · China",
  line: "USDrop Express Line",
}

export function fmtDate(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function orderItemsSummary(items: any[]): string {
  if (!Array.isArray(items) || items.length === 0) return "—"
  const first = items[0]
  const name = first?.title || first?.name || "Item"
  return items.length > 1 ? `${name} +${items.length - 1} more` : name
}
