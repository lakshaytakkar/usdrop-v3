

import { Button } from "@/components/ui/button"
import { Play, Coins } from "lucide-react"
import { ProfitCalculator } from "@/components/ai-tools/profit-calculator"
export default function ProfitCalculatorPage() {
  const toolContent = (
    <>
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
        <h1 className="text-2xl font-bold">Profit Calculator</h1>
        <p className="text-sm text-blue-100 mt-1">Analyze product profitability, calculate margins, and optimize your pricing strategy.</p>
      </div>

      <ProfitCalculator />
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
