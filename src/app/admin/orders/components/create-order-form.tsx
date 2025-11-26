"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Order, OrderStatus } from "@/types/admin/orders"

interface CreateOrderFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (orderData: {
    user_id: string
    plan_id: string
    billing_period: "monthly" | "annual"
    amount_inr: number
    amount_usd: number | null
    status: OrderStatus
    metadata?: Record<string, any>
  }) => Promise<void>
  users: Array<{ id: string; email: string; full_name: string | null }>
  plans: Array<{ id: string; name: string }>
}

export function CreateOrderForm({
  open,
  onClose,
  onSubmit,
  users,
  plans,
}: CreateOrderFormProps) {
  const [formData, setFormData] = useState({
    user_id: "",
    plan_id: "",
    billing_period: "monthly" as "monthly" | "annual",
    amount_inr: "",
    amount_usd: "",
    status: "created" as OrderStatus,
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setFormData({
        user_id: "",
        plan_id: "",
        billing_period: "monthly",
        amount_inr: "",
        amount_usd: "",
        status: "created",
        notes: "",
      })
      setErrors({})
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.user_id) newErrors.user_id = "User is required"
    if (!formData.plan_id) newErrors.plan_id = "Plan is required"
    if (!formData.amount_inr) {
      newErrors.amount_inr = "Amount (INR) is required"
    } else {
      const amount = parseFloat(formData.amount_inr)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount_inr = "Amount must be a positive number"
      }
    }
    if (formData.amount_usd) {
      const usdAmount = parseFloat(formData.amount_usd)
      if (isNaN(usdAmount) || usdAmount <= 0) {
        newErrors.amount_usd = "Amount must be a positive number"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        user_id: formData.user_id,
        plan_id: formData.plan_id,
        billing_period: formData.billing_period,
        amount_inr: Math.round(parseFloat(formData.amount_inr) * 100), // Convert to paise
        amount_usd: formData.amount_usd ? parseFloat(formData.amount_usd) : null,
        status: formData.status,
        metadata: formData.notes ? { notes: formData.notes } : undefined,
      })
      onClose()
    } catch (error) {
      console.error("Error creating order:", error)
      setErrors({ submit: "Failed to create order. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Create a new payment order for a user and plan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">User *</Label>
              <Select
                value={formData.user_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, user_id: value })
                  setErrors({ ...errors, user_id: "" })
                }}
              >
                <SelectTrigger id="user_id" className={errors.user_id ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user_id && (
                <p className="text-sm text-destructive">{errors.user_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan_id">Plan *</Label>
              <Select
                value={formData.plan_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, plan_id: value })
                  setErrors({ ...errors, plan_id: "" })
                }}
              >
                <SelectTrigger id="plan_id" className={errors.plan_id ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.plan_id && (
                <p className="text-sm text-destructive">{errors.plan_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_period">Billing Period *</Label>
              <Select
                value={formData.billing_period}
                onValueChange={(value) =>
                  setFormData({ ...formData, billing_period: value as "monthly" | "annual" })
                }
              >
                <SelectTrigger id="billing_period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_inr">Amount (INR) *</Label>
                <Input
                  id="amount_inr"
                  type="number"
                  step="0.01"
                  placeholder="999.00"
                  value={formData.amount_inr}
                  onChange={(e) => {
                    setFormData({ ...formData, amount_inr: e.target.value })
                    setErrors({ ...errors, amount_inr: "" })
                  }}
                  className={errors.amount_inr ? "border-destructive" : ""}
                />
                {errors.amount_inr && (
                  <p className="text-sm text-destructive">{errors.amount_inr}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount_usd">Amount (USD)</Label>
                <Input
                  id="amount_usd"
                  type="number"
                  step="0.01"
                  placeholder="12.00"
                  value={formData.amount_usd}
                  onChange={(e) => {
                    setFormData({ ...formData, amount_usd: e.target.value })
                    setErrors({ ...errors, amount_usd: "" })
                  }}
                  className={errors.amount_usd ? "border-destructive" : ""}
                />
                {errors.amount_usd && (
                  <p className="text-sm text-destructive">{errors.amount_usd}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as OrderStatus })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {errors.submit && (
              <p className="text-sm text-destructive">{errors.submit}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

