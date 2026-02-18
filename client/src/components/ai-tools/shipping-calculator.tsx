

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
  Calculator,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

type ShippingOption = "express" | "standard"

export function ShippingCalculator() {
  const [fromCountry, setFromCountry] = useState("CN")
  const [toCountry, setToCountry] = useState("US")
  const [length, setLength] = useState("")
  const [breadth, setBreadth] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [batteryType, setBatteryType] = useState("non-battery")
  const [quantity, setQuantity] = useState("1")
  const [selectedOption] = useState<ShippingOption>("express")
  const [isEstimateGenerated, setIsEstimateGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate volume weight: (L × B × H) / 5000 (standard for most carriers)
  const calculateVolumeWeight = () => {
    const l = parseFloat(length) || 0
    const b = parseFloat(breadth) || 0
    const h = parseFloat(height) || 0
    const volWeight = (l * b * h) / 5000
    return volWeight.toFixed(2)
  }

  // Calculate shipping costs (simplified estimation)
  const calculateShipping = () => {
    const actualWeight = parseFloat(weight) || 0
    const volWeight = parseFloat(calculateVolumeWeight())
    const chargeableWeight = Math.max(actualWeight, volWeight)
    const qty = parseFloat(quantity) || 1

    // Base rates (per kg)
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
      {/* Input Form Card - Light Theme with Fixed Height */}
      <Card className="bg-white border-border h-[calc(100vh-200px)] flex flex-col">
        <CardContent className="p-6 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <Truck className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Shipping Calculator</h3>
          </div>

          {/* 2:1 Grid Layout */}
          <div className="flex-1 grid grid-cols-[2fr_1fr] gap-4 overflow-hidden min-h-0">
            {/* Left Section (2 parts): Input Fields */}
            <div className="flex flex-col overflow-hidden min-h-0">
              <div className="flex-1 min-h-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
              <div>
                <Label htmlFor="from-country" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-foreground" />
                  From Country
                </Label>
                <Select value={fromCountry} onValueChange={setFromCountry}>
                  <SelectTrigger id="from-country" className="w-full bg-background border-border text-foreground">
                    <SelectValue placeholder="Select origin country" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="CN" className="text-foreground focus:bg-muted">
                      China
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="to-country" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-foreground" />
                  To Country
                </Label>
                <Select value={toCountry} onValueChange={setToCountry}>
                  <SelectTrigger id="to-country" className="w-full bg-background border-border text-foreground">
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="US" className="text-foreground focus:bg-muted">
                      United States
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  className="w-full bg-background border-border text-foreground"
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
                  className="w-full bg-background border-border text-foreground"
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
                  className="w-full bg-background border-border text-foreground"
                />
              </div>

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
                  className="w-full bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Battery className="h-4 w-4 text-foreground" />
                  Battery Type
                </Label>
                <RadioGroup value={batteryType} onValueChange={setBatteryType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-battery" id="non-battery" className="border-foreground text-foreground data-[state=checked]:border-black" />
                    <Label htmlFor="non-battery" className="text-sm cursor-pointer text-foreground">
                      Non-Battery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="battery" id="battery" className="border-foreground text-foreground data-[state=checked]:border-black" />
                    <Label htmlFor="battery" className="text-sm cursor-pointer text-foreground">
                      Battery
                    </Label>
                  </div>
                </RadioGroup>
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
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
                </div>
              </div>
            </div>

            {/* Right Section (1 part): Generate Button + Shipping Options */}
            <div className="flex flex-col border-l border-border pl-4 overflow-hidden">
              {/* Generate Estimate Button */}
              <div className="shrink-0 mb-4">
                <Button
                  onClick={async () => {
                    setIsLoading(true)
                    // Simulate API call delay
                    await new Promise(resolve => setTimeout(resolve, 1500))
                    setIsEstimateGenerated(true)
                    setIsLoading(false)
                  }}
                  disabled={isLoading}
                  className="w-full bg-black text-white hover:bg-black/90 h-10 text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Generate Estimate
                    </>
                  )}
                </Button>
              </div>

              {/* Shipping Options - Hidden until generated, appears with animation */}
              {isEstimateGenerated && (
                <div 
                  className="flex-1 flex flex-col min-h-0"
                  style={{
                    animation: 'fadeInSlideUp 0.5s ease-out forwards'
                  }}
                >
                  <Label className="text-sm font-semibold text-foreground mb-3 block shrink-0">Shipping Options</Label>
                  <div className="flex flex-col gap-3 flex-1 min-h-0">
                    {/* USDrop Express Line */}
                    <div
                      className={cn(
                        "relative rounded-lg border-2 p-3 transition-all duration-200",
                        selectedOption === "express"
                          ? "border-black bg-black/10"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          <div className={cn(
                            "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                            selectedOption === "express"
                              ? "border-black bg-black"
                              : "border-border bg-transparent"
                          )}>
                            {selectedOption === "express" && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-foreground text-sm">USDrop Express Line</h4>
                            <span className={cn(
                              "text-base font-bold",
                              selectedOption === "express" ? "text-black" : "text-foreground"
                            )}>
                              ${shipping.expressCost}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-tight">
                            6-9 Business Days • Tracking Included
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Standard Ocean */}
                    <div
                      className={cn(
                        "relative rounded-lg border-2 p-3 transition-all duration-200",
                        selectedOption === "standard"
                          ? "border-black bg-black/10"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          <div className={cn(
                            "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                            selectedOption === "standard"
                              ? "border-black bg-black"
                              : "border-border bg-transparent"
                          )}>
                            {selectedOption === "standard" && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-foreground text-sm">Standard Ocean</h4>
                            <span className={cn(
                              "text-base font-bold",
                              selectedOption === "standard" ? "text-black" : "text-foreground"
                            )}>
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
                            className="w-full border-border bg-background text-foreground hover:bg-muted hover:text-foreground text-xs h-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle contact team action
                              window.location.href = "mailto:team@usdrop.com?subject=Standard Ocean Shipping Inquiry"
                            }}
                          >
                            <Mail className="h-3 w-3 mr-1.5" />
                            Contact Team
                          </Button>
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

