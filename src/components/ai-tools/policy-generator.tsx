"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Wand2, Copy, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const POLICY_TYPES = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "refund", label: "Refund Policy" },
  { id: "shipping", label: "Shipping Policy" },
  { id: "returns", label: "Returns Policy" },
]

export function PolicyGenerator() {
  const [policyType, setPolicyType] = useState("privacy")
  const [storeName, setStoreName] = useState("")
  const [storeDetails, setStoreDetails] = useState("")
  const [generatedPolicy, setGeneratedPolicy] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!storeName) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const policies: Record<string, string> = {
        "privacy": `PRIVACY POLICY\n\nLast Updated: ${new Date().toLocaleDateString()}\n\n${storeName} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.\n\nINFORMATION WE COLLECT\n\nWe may collect information about you in a variety of ways. The information we may collect includes:\n- Personal Data: Name, email address, phone number, billing address\n- Payment Information: Credit card details, payment history\n- Usage Data: How you interact with our website\n\nHOW WE USE YOUR INFORMATION\n\nWe use the information we collect to:\n- Process and fulfill your orders\n- Communicate with you about your orders\n- Improve our services and website\n- Send marketing communications (with your consent)\n\n${storeDetails ? `\nADDITIONAL INFORMATION:\n${storeDetails}` : ""}\n\nCONTACT US\n\nIf you have questions about this Privacy Policy, please contact us.`,
        "terms": `TERMS OF SERVICE\n\nLast Updated: ${new Date().toLocaleDateString()}\n\nWelcome to ${storeName}. These Terms of Service ("Terms") govern your access to and use of our website and services.\n\nACCEPTANCE OF TERMS\n\nBy accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our services.\n\nPRODUCTS AND SERVICES\n\nWe strive to provide accurate product descriptions and pricing. However, we reserve the right to correct any errors, inaccuracies, or omissions.\n\nORDERS AND PAYMENT\n\n- All orders are subject to product availability\n- We reserve the right to refuse or cancel any order\n- Payment must be received before order processing\n\n${storeDetails ? `\nADDITIONAL TERMS:\n${storeDetails}` : ""}\n\nLIMITATION OF LIABILITY\n\n${storeName} shall not be liable for any indirect, incidental, special, or consequential damages.\n\nCONTACT INFORMATION\n\nFor questions about these Terms, please contact us.`,
        "refund": `REFUND POLICY\n\nLast Updated: ${new Date().toLocaleDateString()}\n\n${storeName} is committed to your satisfaction. This Refund Policy outlines our procedures for refunds and returns.\n\nREFUND ELIGIBILITY\n\n- Items must be returned within 30 days of purchase\n- Items must be in original, unused condition\n- Original packaging and tags must be included\n\nREFUND PROCESS\n\n1. Contact our customer service team\n2. Provide order number and reason for return\n3. Receive return authorization\n4. Ship item back to us\n5. Refund processed within 5-7 business days\n\nNON-REFUNDABLE ITEMS\n\n- Digital products\n- Customized items\n- Items damaged by customer\n\n${storeDetails ? `\nADDITIONAL INFORMATION:\n${storeDetails}` : ""}\n\nCONTACT US\n\nFor refund inquiries, please contact our support team.`,
        "shipping": `SHIPPING POLICY\n\nLast Updated: ${new Date().toLocaleDateString()}\n\n${storeName} ships orders worldwide. This Shipping Policy outlines our shipping procedures and timelines.\n\nSHIPPING METHODS\n\n- Standard Shipping: 5-7 business days\n- Express Shipping: 2-3 business days\n- International Shipping: 10-15 business days\n\nSHIPPING COSTS\n\nShipping costs are calculated at checkout based on:\n- Destination\n- Package weight\n- Shipping method selected\n\nORDER PROCESSING\n\n- Orders are typically processed within 1-2 business days\n- You will receive a tracking number once your order ships\n- Delivery times are estimates and not guaranteed\n\n${storeDetails ? `\nADDITIONAL INFORMATION:\n${storeDetails}` : ""}\n\nCONTACT US\n\nFor shipping inquiries, please contact our support team.`,
        "returns": `RETURNS POLICY\n\nLast Updated: ${new Date().toLocaleDateString()}\n\n${storeName} accepts returns within 30 days of purchase. This Returns Policy explains our return procedures.\n\nRETURN CONDITIONS\n\n- Items must be unused and in original condition\n- Original packaging and tags must be included\n- Proof of purchase required\n\nRETURN PROCESS\n\n1. Contact customer service to initiate return\n2. Receive return authorization and instructions\n3. Package item securely with original packaging\n4. Ship to provided return address\n5. Refund or exchange processed upon receipt\n\nEXCHANGES\n\nWe offer exchanges for items of equal or greater value. If the new item costs more, you'll be charged the difference.\n\n${storeDetails ? `\nADDITIONAL INFORMATION:\n${storeDetails}` : ""}\n\nCONTACT US\n\nFor return inquiries, please contact our support team.`,
      }
      setGeneratedPolicy(policies[policyType] || policies["privacy"])
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    if (generatedPolicy) {
      navigator.clipboard.writeText(generatedPolicy)
    }
  }

  const handleDownload = () => {
    if (generatedPolicy) {
      const blob = new Blob([generatedPolicy], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${policyType}-policy-${storeName.replace(/\s+/g, '-')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Policy Generator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Policy Type</Label>
                <Select value={policyType} onValueChange={setPolicyType}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POLICY_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="storeName" className="text-sm font-medium text-foreground mb-2 block">
                  Store Name
                </Label>
                <input
                  id="storeName"
                  type="text"
                  placeholder="e.g., My Store"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <Label htmlFor="storeDetails" className="text-sm font-medium text-foreground mb-2 block">
                  Additional Details (Optional)
                </Label>
                <Textarea
                  id="storeDetails"
                  placeholder="Special terms, contact information, specific policies..."
                  value={storeDetails}
                  onChange={(e) => setStoreDetails(e.target.value)}
                  className="bg-background border-border text-foreground min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!storeName || isGenerating}
                className={cn(
                  "w-full",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Policy"}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold text-foreground">Generated Policy</Label>
                {generatedPolicy && (
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
                "p-4 rounded-lg border min-h-[400px] max-h-[600px] overflow-y-auto",
                generatedPolicy
                  ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900"
                  : "bg-muted/50 border-border"
              )}>
                {generatedPolicy ? (
                  <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                    {generatedPolicy}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Generated policy will appear here...
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

