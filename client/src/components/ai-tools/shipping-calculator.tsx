import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import {
  Truck,
  Globe,
  Ruler,
  Weight,
  Battery,
  Package,
  Mail,
  Wand2,
} from "lucide-react"
import { ButtonSpinner } from "@/components/ui/blue-spinner"
import { cn } from "@/lib/utils"

export function ShippingCalculator() {
  const [fromCountry, setFromCountry] = useState("CN")
  const [toCountry, setToCountry] = useState("US")
  const [length, setLength] = useState("")
  const [breadth, setBreadth] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [batteryType, setBatteryType] = useState("non-battery")
  const [quantity, setQuantity] = useState("1")
  const [isEstimateGenerated, setIsEstimateGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const calculateVolumeWeight = () => {
    const l = parseFloat(length) || 0
    const b = parseFloat(breadth) || 0
    const h = parseFloat(height) || 0
    const volWeight = (l * b * h) / 5000
    return volWeight.toFixed(2)
  }

  const calculateShipping = () => {
    const actualWeight = parseFloat(weight) || 0
    const volWeight = parseFloat(calculateVolumeWeight())
    const chargeableWeight = Math.max(actualWeight, volWeight)
    const qty = parseFloat(quantity) || 1

    const expressBaseRate = 8.5
    const standardBaseRate = 4.2

    return {
      expressCost: (chargeableWeight * expressBaseRate * qty * (qty > 10 ? 0.9 : 1) + (batteryType === "battery" ? 2.5 : 0)).toFixed(2),
      standardCost: (chargeableWeight * standardBaseRate * qty * (qty > 10 ? 0.9 : 1) + (batteryType === "battery" ? 1.5 : 0)).toFixed(2),
      chargeableWeight: chargeableWeight.toFixed(2),
      volumeWeight: volWeight,
    }
  }

  const shipping = calculateShipping()

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Truck className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-foreground">Shipping Calculator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-country" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-foreground" />
                    From Country
                  </Label>
                  <Select value={fromCountry} onValueChange={setFromCountry}>
                    <SelectTrigger id="from-country" className="bg-background border-border text-foreground" data-testid="select-from-country">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CN">China</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="to-country" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-foreground" />
                    To Country
                  </Label>
                  <Select value={toCountry} onValueChange={setToCountry}>
                    <SelectTrigger id="to-country" className="bg-background border-border text-foreground" data-testid="select-to-country">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-foreground" />
                    Length (cm)
                  </Label>
                  <Input
                    type="number"
                    placeholder="L"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="bg-background border-border text-foreground"
                    data-testid="input-length"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-foreground" />
                    Breadth (cm)
                  </Label>
                  <Input
                    type="number"
                    placeholder="B"
                    value={breadth}
                    onChange={(e) => setBreadth(e.target.value)}
                    className="bg-background border-border text-foreground"
                    data-testid="input-breadth"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-foreground" />
                    Height (cm)
                  </Label>
                  <Input
                    type="number"
                    placeholder="H"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-background border-border text-foreground"
                    data-testid="input-height"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Weight className="h-4 w-4 text-foreground" />
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="0.00"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-background border-border text-foreground"
                    data-testid="input-weight"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-foreground" />
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-background border-border text-foreground"
                    data-testid="input-quantity"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Battery className="h-4 w-4 text-foreground" />
                  Battery Type
                </Label>
                <RadioGroup value={batteryType} onValueChange={setBatteryType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-battery" id="non-battery" className="border-blue-400 text-blue-600 data-[state=checked]:border-blue-600" data-testid="radio-non-battery" />
                    <Label htmlFor="non-battery" className="text-sm cursor-pointer text-foreground">
                      Non-Battery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="battery" id="battery" className="border-blue-400 text-blue-600 data-[state=checked]:border-blue-600" data-testid="radio-battery" />
                    <Label htmlFor="battery" className="text-sm cursor-pointer text-foreground">
                      Battery
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={async () => {
                  setIsLoading(true)
                  await new Promise(resolve => setTimeout(resolve, 1500))
                  setIsEstimateGenerated(true)
                  setIsLoading(false)
                }}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                data-testid="button-generate-estimate"
              >
                {isLoading ? (
                  <>
                    <ButtonSpinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Estimate
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-blue-600" />
                <h4 className="text-sm font-semibold text-foreground">Shipping Options</h4>
              </div>

              {!isEstimateGenerated ? (
                <div className="p-4 rounded-lg border bg-blue-50/30 border-blue-100 min-h-[200px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center">
                    Enter package details and click Generate Estimate to see shipping options
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-3"
                  style={{ animation: 'fadeInSlideUp 0.5s ease-out forwards' }}
                >
                  <div className="rounded-lg border-2 border-blue-500 bg-blue-50/50 p-4 transition-all" data-testid="card-express-shipping">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <div className="h-4 w-4 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground text-sm">USDrop Express Line</h4>
                          <span className="text-base font-bold text-blue-700">
                            ${shipping.expressCost}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-tight">
                          6-9 Business Days • Tracking Included
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4 transition-all" data-testid="card-standard-shipping">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-transparent flex items-center justify-center" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground text-sm">Standard Ocean</h4>
                          <span className="text-base font-bold text-foreground">
                            ${shipping.standardCost}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-tight mb-1">
                          12-18 Business Days
                        </p>
                        <p className="text-xs text-muted-foreground italic mb-2 leading-tight">
                          (Only for Larger Shipments)
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = "mailto:team@usdrop.com?subject=Standard Ocean Shipping Inquiry"
                          }}
                          data-testid="button-contact-team"
                        >
                          <Mail className="h-3 w-3 mr-1.5" />
                          Contact Team
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-blue-50/40 border border-blue-100">
                        <div className="text-xs text-muted-foreground mb-1">Chargeable Weight</div>
                        <div className="text-sm font-semibold text-foreground" data-testid="text-chargeable-weight">
                          {shipping.chargeableWeight} kg
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50/40 border border-blue-100">
                        <div className="text-xs text-muted-foreground mb-1">Volume Weight</div>
                        <div className="text-sm font-semibold text-foreground" data-testid="text-volume-weight">
                          {shipping.volumeWeight} kg
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
