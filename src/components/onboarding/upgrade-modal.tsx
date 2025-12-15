"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Sparkles } from "lucide-react"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const [contactMethod, setContactMethod] = useState<"phone" | "email" | null>(null)

  const handleContact = (method: "phone" | "email") => {
    setContactMethod(method)
    // TODO: Implement actual contact functionality
    if (method === "phone") {
      // Could open phone dialer or show phone number
      window.location.href = "tel:+1234567890"
    } else {
      // Could open email client or show email
      window.location.href = "mailto:support@usdrop.ai"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Unlock Premium Features
          </DialogTitle>
          <DialogDescription className="text-center">
            You've completed onboarding! Upgrade to access all premium features and tools.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upgrade Benefits */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Premium Features Include:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Unlimited AI tool usage</li>
              <li>Advanced analytics and insights</li>
              <li>Priority support</li>
              <li>Exclusive training materials</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium text-center">
              Contact us to upgrade your plan:
            </p>
            
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleContact("phone")}
                variant="outline"
                className="w-full justify-start"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call: +1 (234) 567-8900
              </Button>
              
              <Button
                onClick={() => handleContact("email")}
                variant="outline"
                className="w-full justify-start"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email: support@usdrop.ai
              </Button>
            </div>
          </div>

          {/* Upgrade Now Button */}
          <Button
            onClick={() => {
              // TODO: Navigate to pricing/upgrade page
              window.location.href = "/pricing"
            }}
            className="w-full"
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            View Pricing Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

