"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Check, Zap, Crown, Sparkles } from "lucide-react"

interface UpsellDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function UpsellDialog({ isOpen, onClose }: UpsellDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6 md:p-8 w-[calc(100%-2rem)] sm:w-full">

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4">
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
        <div className="text-center text-sm text-muted-foreground pt-4 mt-4 border-t border-border">
          <p>All plans include a free trial. No credit card required.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

