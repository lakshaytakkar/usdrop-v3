/* Phase A — guided LLC. Status pipeline mirrors the admin/desk pipeline.
   On-brand accent for LLC = green/emerald (scoped Tailwind, per design map). */

export interface LLCApplication {
  id: string
  user_id: string
  llc_name: string | null
  state: string | null
  package_type: string | null
  amount_paid: number | null
  status: LLCStatus
  admin_notes: string | null
  filed_at: string | null
  ein_at: string | null
  boi_at: string | null
  bank_at: string | null
  stripe_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type LLCStatus =
  | "pending" | "filed" | "ein_received" | "boi_filed"
  | "bank_opened" | "stripe_connected" | "complete"

export const LLC_PIPELINE: LLCStatus[] = [
  "pending", "filed", "ein_received", "boi_filed", "bank_opened", "stripe_connected", "complete",
]

export const LLC_STAGE_META: Record<LLCStatus, { label: string; blurb: string; dateField: keyof LLCApplication | null }> = {
  pending: { label: "Application", blurb: "We've got your details and are preparing your filing.", dateField: null },
  filed: { label: "State Filing", blurb: "Your LLC is filed with the state.", dateField: "filed_at" },
  ein_received: { label: "EIN", blurb: "Your federal EIN is issued by the IRS.", dateField: "ein_at" },
  boi_filed: { label: "BOI Report", blurb: "Beneficial-ownership report filed with FinCEN.", dateField: "boi_at" },
  bank_opened: { label: "Bank Account", blurb: "Your US business bank account is open.", dateField: "bank_at" },
  stripe_connected: { label: "Payments", blurb: "Stripe / payments connected and ready.", dateField: "stripe_at" },
  complete: { label: "Ready to Operate", blurb: "Your US business is fully set up.", dateField: "completed_at" },
}

export function llcStatusIndex(s: LLCStatus): number {
  return LLC_PIPELINE.indexOf(s)
}

export const LLC_INCLUDES = [
  "US LLC formation (state filing)",
  "Registered agent for 1 year",
  "Federal EIN (tax ID)",
  "BOI / FinCEN compliance filing",
  "US business bank account setup",
  "Stripe & PayPal ready",
  "Operating agreement + documents",
]

export const FORMATION_STATES = ["Wyoming", "Delaware", "New Mexico", "Florida"]

export function fmtDate(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
