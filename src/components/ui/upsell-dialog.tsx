"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Check, Zap, Crown, Sparkles } from "lucide-react"

interface UpsellDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function UpsellDialog({ isOpen, onClose }: UpsellDialogProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog Content */}
      <div
        className={`relative w-full max-w-4xl max-h-[85vh] my-4 transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full max-h-[85vh] overflow-y-auto p-4 md:p-6 shadow-2xl border-2">
          {/* Pricing Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mb-3 pt-4 md:pt-6">
            {/* Starter Plan */}
            <Card className="p-3 md:p-4 relative hover:shadow-lg transition-all border-2 hover:border-primary/50">
              <div className="space-y-2 md:space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <h3 className="text-xl font-bold">Starter</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Perfect for beginners</p>
                </div>

                <div className="py-4 border-y">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">50 Products per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic Analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Email Support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">7-day Free Trial</span>
                  </li>
                </ul>

                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </div>
            </Card>

            {/* Pro Plan - Most Popular */}
            <Card className="p-3 md:p-4 relative hover:shadow-xl transition-all border-2 border-primary lg:scale-105">
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-xs">
                Most Popular
              </Badge>
              
              <div className="space-y-2 md:space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-xl font-bold">Pro</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">For serious sellers</p>
                </div>

                <div className="py-4 border-y">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$79</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Unlimited Products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced Analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority Support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Supplier Contacts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Profit Calculator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">14-day Free Trial</span>
                  </li>
                </ul>

                <Button className="w-full">
                  Start Free Trial
                </Button>
              </div>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-3 md:p-4 relative hover:shadow-lg transition-all border-2 hover:border-primary/50">
              <div className="space-y-2 md:space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h3 className="text-xl font-bold">Enterprise</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">For agencies & teams</p>
                </div>

                <div className="py-4 border-y">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Team Collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">API Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom Integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Dedicated Support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">30-day Free Trial</span>
                  </li>
                </ul>

                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground px-2 pt-2">
            <p>All plans include a free trial. No credit card required.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

