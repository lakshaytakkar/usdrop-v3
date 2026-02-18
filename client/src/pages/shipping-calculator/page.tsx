

import { Button } from "@/components/ui/button"
import { Play, Coins } from "lucide-react"
import { ShippingCalculator } from "@/components/ai-tools/shipping-calculator"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
export default function ShippingCalculatorPage() {
  const toolContent = (
    <>
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
        <h1 className="text-2xl font-bold">Shipping Calculator</h1>
        <p className="text-sm text-blue-100 mt-1">Calculate shipping costs, delivery times, and optimize your fulfillment strategy.</p>
      </div>

      <ShippingCalculator />
    </>
  )

  return (
    <>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {toolContent}

          <OnboardingProgressOverlay pageName="Shipping Calculator" />
        </div>
    </>
  )
}
