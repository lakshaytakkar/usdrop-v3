"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Wand2, Copy, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const EMAIL_TYPES = [
  { id: "order-confirmation", label: "Order Confirmation" },
  { id: "shipping-update", label: "Shipping Update" },
  { id: "delivery-confirmation", label: "Delivery Confirmation" },
  { id: "refund-request", label: "Refund Request" },
  { id: "welcome", label: "Welcome Email" },
  { id: "abandoned-cart", label: "Abandoned Cart" },
]

export function EmailTemplates() {
  const [emailType, setEmailType] = useState("order-confirmation")
  const [customerName, setCustomerName] = useState("")
  const [orderDetails, setOrderDetails] = useState("")
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!customerName) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const templates: Record<string, string> = {
        "order-confirmation": `Hi ${customerName},\n\nThank you for your order! We're excited to confirm that we've received your order and it's being processed.\n\n${orderDetails || "Your order details will be included here."}\n\nWe'll send you another email once your order ships. If you have any questions, please don't hesitate to reach out.\n\nBest regards,\nThe Team`,
        "shipping-update": `Hi ${customerName},\n\nGreat news! Your order has shipped and is on its way to you.\n\n${orderDetails || "Tracking information will be included here."}\n\nYou can track your package using the tracking number provided above. We'll notify you once it's been delivered.\n\nThank you for your patience!\n\nBest regards,\nThe Team`,
        "delivery-confirmation": `Hi ${customerName},\n\nYour order has been delivered! We hope you love your purchase.\n\n${orderDetails || "Order details will be included here."}\n\nIf you have any questions or concerns, please don't hesitate to contact us. We'd also love to hear your feedback!\n\nThank you for choosing us!\n\nBest regards,\nThe Team`,
        "refund-request": `Hi ${customerName},\n\nWe've received your refund request and it's being processed.\n\n${orderDetails || "Refund details will be included here."}\n\nYou should see the refund in your account within 5-7 business days. If you have any questions, please contact our support team.\n\nWe apologize for any inconvenience.\n\nBest regards,\nThe Team`,
        "welcome": `Hi ${customerName},\n\nWelcome to our store! We're thrilled to have you join our community.\n\nAs a new customer, you'll receive exclusive offers and updates. ${orderDetails || "Special welcome offer details will be included here."}\n\nIf you have any questions, we're here to help!\n\nWelcome aboard!\n\nBest regards,\nThe Team`,
        "abandoned-cart": `Hi ${customerName},\n\nWe noticed you left some items in your cart. Don't miss out!\n\n${orderDetails || "Cart items will be listed here."}\n\nComplete your purchase now and take advantage of our special offers. We're here if you need any assistance!\n\nHappy shopping!\n\nBest regards,\nThe Team`,
      }
      setGeneratedEmail(templates[emailType] || templates["order-confirmation"])
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(generatedEmail)
    }
  }

  const handleDownload = () => {
    if (generatedEmail) {
      const blob = new Blob([generatedEmail], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `email-template-${emailType}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Email Templates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Email Type</Label>
                <Select value={emailType} onValueChange={setEmailType}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customerName" className="text-sm font-medium text-foreground mb-2 block">
                  Customer Name
                </Label>
                <input
                  id="customerName"
                  type="text"
                  placeholder="e.g., John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <Label htmlFor="orderDetails" className="text-sm font-medium text-foreground mb-2 block">
                  Additional Details (Optional)
                </Label>
                <Textarea
                  id="orderDetails"
                  placeholder="Order number, tracking info, special notes..."
                  value={orderDetails}
                  onChange={(e) => setOrderDetails(e.target.value)}
                  className="bg-background border-border text-foreground min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!customerName || isGenerating}
                className={cn(
                  "w-full",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Email"}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold text-foreground">Generated Email</Label>
                {generatedEmail && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="h-8"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div className={cn(
                "p-4 rounded-lg border min-h-[300px]",
                generatedEmail
                  ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                  : "bg-muted/50 border-border"
              )}>
                {generatedEmail ? (
                  <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                    {generatedEmail}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Generated email template will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

