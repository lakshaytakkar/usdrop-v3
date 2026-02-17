"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Receipt, Wand2, Download, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InvoiceItem {
  id: string
  description: string
  quantity: string
  price: string
}

export function InvoiceGenerator() {
  const [businessName, setBusinessName] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: "1", price: "0.00" }
  ])
  const [taxRate, setTaxRate] = useState("0")
  const [generatedInvoice, setGeneratedInvoice] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", quantity: "1", price: "0.00" }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0
      const price = parseFloat(item.price) || 0
      return sum + (qty * price)
    }, 0)
    const tax = subtotal * (parseFloat(taxRate) || 0) / 100
    return { subtotal, tax, total: subtotal + tax }
  }

  const handleGenerate = async () => {
    if (!businessName || !customerName || !invoiceNumber) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const { subtotal, tax, total } = calculateTotal()
      const invoice = `INVOICE

Invoice #: ${invoiceNumber}
Date: ${new Date(invoiceDate).toLocaleDateString()}

FROM:
${businessName}
${businessAddress}

TO:
${customerName}
${customerAddress}

ITEMS:
${items.map((item, index) => {
  const qty = parseFloat(item.quantity) || 0
  const price = parseFloat(item.price) || 0
  const lineTotal = qty * price
  return `${index + 1}. ${item.description || "Item"}
   Quantity: ${qty} x $${price.toFixed(2)} = $${lineTotal.toFixed(2)}`
}).join('\n\n')}

SUBTOTAL: $${subtotal.toFixed(2)}
TAX (${taxRate}%): $${tax.toFixed(2)}
TOTAL: $${total.toFixed(2)}

Thank you for your business!`
      setGeneratedInvoice(invoice)
      setIsGenerating(false)
    }, 1500)
  }

  const handleDownload = () => {
    if (generatedInvoice) {
      const blob = new Blob([generatedInvoice], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoiceNumber}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const { subtotal, tax, total } = calculateTotal()

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Invoice Generator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber" className="text-sm font-medium text-foreground mb-2 block">
                    Invoice #
                  </Label>
                  <Input
                    id="invoiceNumber"
                    type="text"
                    placeholder="INV-001"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceDate" className="text-sm font-medium text-foreground mb-2 block">
                    Date
                  </Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Business Information</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                  <Input
                    placeholder="Business Address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Customer Information</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                  <Input
                    placeholder="Customer Address"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Items</Label>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="flex-1 bg-background border-border text-foreground"
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="w-20 bg-background border-border text-foreground"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                        className="w-24 bg-background border-border text-foreground"
                      />
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-10 w-10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="taxRate" className="text-sm font-medium text-foreground mb-2 block">
                  Tax Rate (%)
                </Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!businessName || !customerName || !invoiceNumber || isGenerating}
                className={cn(
                  "w-full",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Invoice"}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold text-foreground">Generated Invoice</Label>
                {generatedInvoice && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                )}
              </div>

              <div className={cn(
                "p-4 rounded-lg border min-h-[400px] max-h-[600px] overflow-y-auto",
                generatedInvoice
                  ? "bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900"
                  : "bg-muted/50 border-border"
              )}>
                {generatedInvoice ? (
                  <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono">
                    {generatedInvoice}
                  </pre>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Generated invoice will appear here...
                    </p>
                    <div className="pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2">Preview Totals:</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground">Subtotal:</span>
                          <span className="text-foreground">${subtotal.toFixed(2)}</span>
                        </div>
                        {parseFloat(taxRate) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-foreground">Tax:</span>
                            <span className="text-foreground">${tax.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-border font-semibold">
                          <span className="text-foreground">Total:</span>
                          <span className="text-foreground">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





