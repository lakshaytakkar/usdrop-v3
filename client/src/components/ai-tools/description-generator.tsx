import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Wand2, Copy, Download, Type, Users, AlignLeft } from "lucide-react"
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
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-foreground">Description Generator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Type className="h-4 w-4 text-foreground" />
                  Product Name
                </Label>
                <Input
                  id="productName"
                  type="text"
                  placeholder="e.g., Premium Wireless Headphones"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="bg-background border-border text-foreground"
                  data-testid="input-product-name"
                />
              </div>

              <div>
                <Label htmlFor="productDetails" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-foreground" />
                  Product Details
                </Label>
                <Textarea
                  id="productDetails"
                  placeholder="Describe key features, benefits, specifications..."
                  value={productDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  className="bg-background border-border text-foreground min-h-[120px]"
                  data-testid="input-product-details"
                />
              </div>

              <div>
                <Label htmlFor="targetAudience" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-foreground" />
                  Target Audience (Optional)
                </Label>
                <Input
                  id="targetAudience"
                  type="text"
                  placeholder="e.g., Fitness enthusiasts, Professionals"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="bg-background border-border text-foreground"
                  data-testid="input-target-audience"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!productName || !productDetails || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-generate-description"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Description"}
              </Button>
            </div>

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
                      data-testid="button-copy-description"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="h-8"
                      data-testid="button-download-description"
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
                  ? "bg-blue-50/50 border-blue-200"
                  : "bg-blue-50/30 border-blue-100"
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
