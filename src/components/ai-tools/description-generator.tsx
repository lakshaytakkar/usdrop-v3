"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Wand2, Copy, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export function DescriptionGenerator() {
  const [productName, setProductName] = useState("")
  const [productDetails, setProductDetails] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!productName || !productDetails) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedDescription(`Introducing ${productName} - ${productDetails}. Perfect for ${targetAudience || "your customers"}. This premium product combines quality craftsmanship with modern design, delivering exceptional value and satisfaction. Experience the difference with ${productName} today.`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    if (generatedDescription) {
      navigator.clipboard.writeText(generatedDescription)
    }
  }

  const handleDownload = () => {
    if (generatedDescription) {
      const blob = new Blob([generatedDescription], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `product-description-${productName.replace(/\s+/g, '-')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Description Generator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName" className="text-sm font-medium text-foreground mb-2 block">
                  Product Name
                </Label>
                <input
                  id="productName"
                  type="text"
                  placeholder="e.g., Premium Wireless Headphones"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <Label htmlFor="productDetails" className="text-sm font-medium text-foreground mb-2 block">
                  Product Details
                </Label>
                <Textarea
                  id="productDetails"
                  placeholder="Describe key features, benefits, specifications..."
                  value={productDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  className="bg-background border-border text-foreground min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="targetAudience" className="text-sm font-medium text-foreground mb-2 block">
                  Target Audience (Optional)
                </Label>
                <input
                  id="targetAudience"
                  type="text"
                  placeholder="e.g., Fitness enthusiasts, Professionals"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!productName || !productDetails || isGenerating}
                className={cn(
                  "w-full",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Description"}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold text-foreground">Generated Description</Label>
                {generatedDescription && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="h-8"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div className={cn(
                "p-4 rounded-lg border min-h-[200px]",
                generatedDescription
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
                  : "bg-muted/50 border-border"
              )}>
                {generatedDescription ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {generatedDescription}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Generated description will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

