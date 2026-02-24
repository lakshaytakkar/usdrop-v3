

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
        <div className="flex flex-1 flex-col gap-2 px-6 md:px-10 lg:px-16 py-6 md:py-8 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
