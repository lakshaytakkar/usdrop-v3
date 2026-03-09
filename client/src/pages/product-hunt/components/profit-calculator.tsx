import { useState, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { DollarSign, ShoppingCart, HelpCircle } from "lucide-react"

interface ProfitCalculatorProps {
  sellPrice: number
  buyPrice: number
  shippingCost?: number
  otherFees?: number
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex ml-0.5 cursor-help">
      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 text-[11px] leading-tight text-white bg-gray-900 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
        {text}
      </span>
    </span>
  )
}

function SliderInput({
  label,
  tooltip,
  value,
  onChange,
  min,
  max,
  step,
  icon,
  prefix,
  minLabel,
  maxLabel,
  testId,
}: {
  label: string
  tooltip: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  icon: typeof DollarSign
  prefix?: string
  minLabel: string
  maxLabel: string
  testId: string
}) {
  const Icon = icon
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
        {label} <InfoTooltip text={tooltip} />
      </div>
      <div className="relative">
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full h-9 pl-8 pr-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
          step={step}
          min={min}
          data-testid={testId}
        />
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-1 accent-blue-500 cursor-pointer"
        data-testid={`${testId}-slider`}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{prefix}{minLabel}</span>
        <span>{prefix}{maxLabel}</span>
      </div>
    </div>
  )
}

function OutputField({
  label,
  tooltip,
  value,
  highlight,
  testId,
}: {
  label: string
  tooltip: string
  value: string
  highlight?: boolean
  testId: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
        {label} <InfoTooltip text={tooltip} />
      </div>
      <div
        className={`flex items-center justify-center h-9 px-3 text-sm font-semibold rounded-lg border ${
          highlight
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-gray-50 border-gray-200 text-gray-700"
        }`}
        data-testid={testId}
      >
        {value}
      </div>
    </div>
  )
}

function CostInput({
  label,
  tooltip,
  value,
  onChange,
  locked,
  testId,
}: {
  label: string
  tooltip: string
  value: number
  onChange?: (v: number) => void
  locked?: boolean
  testId: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
        {label} <InfoTooltip text={tooltip} />
      </div>
      <div className="relative">
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <DollarSign className="h-3.5 w-3.5" />
        </div>
        <input
          type="number"
          value={value}
          onChange={locked ? undefined : (e) => onChange?.(parseFloat(e.target.value) || 0)}
          readOnly={locked}
          className={`w-full h-9 pl-8 pr-3 text-sm border rounded-lg transition-colors focus:outline-none ${
            locked
              ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          }`}
          step={0.01}
          min={0}
          data-testid={testId}
        />
      </div>
    </div>
  )
}

export function ProfitCalculator({
  sellPrice: defaultSellPrice,
  buyPrice,
  shippingCost: defaultShipping = 0,
  otherFees: defaultOtherFees = 0,
}: ProfitCalculatorProps) {
  const [sellingPrice, setSellingPrice] = useState(defaultSellPrice)
  const [numberOfSales, setNumberOfSales] = useState(25000)
  const [productCost, setProductCost] = useState(buyPrice)
  const [shippingCost, setShippingCost] = useState(defaultShipping)
  const [otherFees, setOtherFees] = useState(defaultOtherFees)
  const [adSpend, setAdSpend] = useState(0)

  const calculations = useMemo(() => {
    const totalCost = productCost + shippingCost + otherFees
    const adCostPerSale = numberOfSales > 0 ? adSpend / numberOfSales : 0
    const netProfitPerSale = sellingPrice - totalCost - adCostPerSale
    const potentialProfit = netProfitPerSale * numberOfSales
    const profitMargin = sellingPrice > 0 ? (netProfitPerSale / sellingPrice) * 100 : 0
    const pcRatio = productCost > 0 ? sellingPrice / productCost : 0
    const contributionMargin = sellingPrice - totalCost
    const breakEvenRoas = contributionMargin > 0 ? sellingPrice / contributionMargin : 0
    const targetRoas = adSpend > 0 ? (sellingPrice * numberOfSales) / adSpend : null

    return {
      netProfitPerSale,
      potentialProfit,
      profitMargin,
      pcRatio,
      breakEvenRoas,
      targetRoas,
    }
  }, [sellingPrice, numberOfSales, productCost, shippingCost, otherFees, adSpend])

  const handleReset = useCallback(() => {
    setSellingPrice(defaultSellPrice)
    setNumberOfSales(25000)
    setProductCost(buyPrice)
    setShippingCost(defaultShipping)
    setOtherFees(defaultOtherFees)
    setAdSpend(0)
  }, [defaultSellPrice, buyPrice, defaultShipping, defaultOtherFees])

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}K` === "$0K" ? `$${val.toFixed(0)}` : `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    return `$${val.toFixed(2)}`
  }

  return (
    <Card className="p-5 md:p-6" data-testid="section-profit-calculator">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold tracking-tight">Estimated Profit Calculator</h3>
        <button
          onClick={handleReset}
          className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          data-testid="button-reset-calculator"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5">
        <SliderInput
          label="Selling Price"
          tooltip="The retail price you charge customers"
          value={sellingPrice}
          onChange={setSellingPrice}
          min={0}
          max={500}
          step={0.01}
          icon={DollarSign}
          prefix="$"
          minLabel="0"
          maxLabel="500"
          testId="input-selling-price"
        />

        <SliderInput
          label="Number of Sales"
          tooltip="Estimated total units sold"
          value={numberOfSales}
          onChange={setNumberOfSales}
          min={0}
          max={100000}
          step={100}
          icon={ShoppingCart}
          prefix=""
          minLabel="0"
          maxLabel="100,000+"
          testId="input-number-of-sales"
        />

        <OutputField
          label="Net Profit per Sale"
          tooltip="Revenue minus all costs per unit"
          value={`≈ ${formatCurrency(calculations.netProfitPerSale)}`}
          highlight
          testId="output-net-profit-per-sale"
        />

        <OutputField
          label="Potential Profit"
          tooltip="Total estimated profit based on sales volume"
          value={`≈ ${formatCurrency(calculations.potentialProfit)}`}
          highlight
          testId="output-potential-profit"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 mt-5">
        <CostInput
          label="Product Cost"
          tooltip="Your cost to purchase or manufacture"
          value={productCost}
          onChange={setProductCost}
          testId="input-product-cost"
        />

        <CostInput
          label="Shipping Cost"
          tooltip="Cost to ship to the customer"
          value={shippingCost}
          onChange={setShippingCost}
          testId="input-shipping-cost"
        />

        <CostInput
          label="Est. Other Fees"
          tooltip="Transaction fees, platform fees, etc."
          value={otherFees}
          onChange={setOtherFees}
          testId="input-other-fees"
        />

        <CostInput
          label="Ad Spend (AS)"
          tooltip="Total advertising budget"
          value={adSpend}
          onChange={setAdSpend}
          testId="input-ad-spend"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 mt-5">
        <OutputField
          label="Profit Margin"
          tooltip="Percentage of selling price that is profit"
          value={`${calculations.profitMargin.toFixed(0)}%`}
          testId="output-profit-margin"
        />

        <OutputField
          label="P/C Ratio"
          tooltip="Price-to-cost ratio (selling price ÷ product cost)"
          value={`${calculations.pcRatio.toFixed(2)}X`}
          testId="output-pc-ratio"
        />

        <OutputField
          label="Break-Even ROAS"
          tooltip="Minimum return on ad spend to break even"
          value={calculations.breakEvenRoas.toFixed(2)}
          testId="output-break-even-roas"
        />

        <OutputField
          label="Target ROAS"
          tooltip="Required ROAS based on your ad spend"
          value={calculations.targetRoas !== null ? calculations.targetRoas.toFixed(2) : "-"}
          testId="output-target-roas"
        />
      </div>
    </Card>
  )
}
