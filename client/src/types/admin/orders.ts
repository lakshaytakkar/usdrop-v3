export type OrderStatus = "created" | "paid" | "failed" | "refunded"

export interface Order {
  id: string
  user_id: string
  plan_id: string
  billing_period: "monthly" | "annual"
  razorpay_order_id: string
  razorpay_payment_id: string | null
  amount_inr: number // Amount in paise (INR * 100)
  amount_usd: number | null
  status: OrderStatus
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
  }
  plan?: {
    id: string
    name: string
    slug: string
  }
}

export interface OrderFilters {
  status?: OrderStatus | ""
  dateFrom?: string
  dateTo?: string
  planId?: string
  userId?: string
  amountMin?: number
  amountMax?: number
  search?: string
}

























