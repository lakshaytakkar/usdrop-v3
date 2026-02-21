

import { Button } from "@/components/ui/button"
import { Play, Coins } from "lucide-react"
import { ShippingCalculator } from "@/components/ai-tools/shipping-calculator"
export default function ShippingCalculatorPage() {
  const toolContent = (
    <>

      <ShippingCalculator />
    </>
  )

  return (
    <>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
