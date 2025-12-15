"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Share2, Wand2, Copy, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

export function SocialMediaStudio() {
  const [productInfo, setProductInfo] = useState("")
  const [platform, setPlatform] = useState("instagram")
  const [postType, setPostType] = useState("product")
  const [generatedCaption, setGeneratedCaption] = useState("")
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!productInfo) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedCaption(`🔥 New product alert! ${productInfo} is here and it's amazing! Don't miss out on this incredible opportunity. Shop now and transform your experience! ✨`)
      setGeneratedHashtags([
        "#dropshipping", "#ecommerce", "#onlineshop", "#shopnow", 
        "#productlaunch", "#newarrival", "#musthave", "#trending"
      ])
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopyCaption = () => {
    if (generatedCaption) {
      navigator.clipboard.writeText(generatedCaption)
    }
  }

  const handleCopyHashtags = () => {
    if (generatedHashtags.length > 0) {
      navigator.clipboard.writeText(generatedHashtags.join(" "))
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Share2 className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Social Media Studio</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="productInfo" className="text-sm font-medium text-foreground mb-2 block">
                  Product Information
                </Label>
                <Textarea
                  id="productInfo"
                  placeholder="Describe your product or what you want to post about..."
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  className="bg-background border-border text-foreground min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Post Type</Label>
                  <Select value={postType} onValueChange={setPostType}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!productInfo || isGenerating}
                className={cn(
                  "w-full",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Content"}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-foreground">Caption</Label>
                  {generatedCaption && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCaption}
                      className="h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <div className={cn(
                  "p-4 rounded-lg border min-h-[120px]",
                  generatedCaption
                    ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900"
                    : "bg-muted/50 border-border"
                )}>
                  {generatedCaption ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {generatedCaption}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Generated caption will appear here...
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Hashtags
                  </Label>
                  {generatedHashtags.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyHashtags}
                      className="h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <div className={cn(
                  "p-4 rounded-lg border min-h-[100px]",
                  generatedHashtags.length > 0
                    ? "bg-pink-50/50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900"
                    : "bg-muted/50 border-border"
                )}>
                  {generatedHashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {generatedHashtags.map((tag, index) => (
                        <span key={index} className="text-sm text-foreground bg-background px-2 py-1 rounded border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Generated hashtags will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

