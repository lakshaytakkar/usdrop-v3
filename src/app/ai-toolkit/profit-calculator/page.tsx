"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProBadge } from "@/components/ui/pro-badge"
import { Calculator } from "lucide-react"
import Link from "next/link"

export default function ProfitCalculatorPage() {
  const [cost, setCost] = useState("")
  const [price, setPrice] = useState("")
  const [shipping, setShipping] = useState("")
  const [fee, setFee] = useState("")

  const calculateProfit = () => {
    const costNum = parseFloat(cost) || 0
    const priceNum = parseFloat(price) || 0
    const shippingNum = parseFloat(shipping) || 0
    const feePercent = parseFloat(fee) || 0

    const grossProfit = priceNum - costNum - shippingNum
    const platformFee = (priceNum * feePercent) / 100
    const netProfit = grossProfit - platformFee
    const margin = priceNum > 0 ? ((netProfit / priceNum) * 100) : 0

    return {
      grossProfit: grossProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      margin: margin.toFixed(1)
    }
  }

  const profit = calculateProfit()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Profit Calculator</h1>
              <ProBadge />
            </div>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/ai-toolkit" className="hover:text-primary transition-colors">
                AI Toolkit
              </Link>
              <span>/</span>
              <span>Profit Calculator</span>
            </nav>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-3">Calculate Your Dropshipping Profits</h2>
                <p className="text-muted-foreground">
                  Analyze product profitability, calculate margins, estimate ROI, and optimize your 
                  pricing strategy with our comprehensive profit calculator.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profit Calculator</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product Cost ($)</label>
                    <Input type="number" placeholder="0.00" value={cost} onChange={(e) => setCost(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Selling Price ($)</label>
                    <Input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Shipping Cost ($)</label>
                    <Input type="number" placeholder="0.00" value={shipping} onChange={(e) => setShipping(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform Fee (%)</label>
                    <Input type="number" placeholder="0" value={fee} onChange={(e) => setFee(e.target.value)} />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Gross Profit:</span>
                      <span className="font-semibold">${profit.grossProfit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Net Profit:</span>
                      <span className="font-semibold text-primary">${profit.netProfit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Profit Margin:</span>
                      <span className="font-semibold">{profit.margin}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
