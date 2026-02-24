

import { Button } from "@/components/ui/button"
import { Play, Coins } from "lucide-react"
import { ProfitCalculator } from "@/components/ai-tools/profit-calculator"
export default function ProfitCalculatorPage() {
  const toolContent = (
    <>

      <ProfitCalculator />
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
