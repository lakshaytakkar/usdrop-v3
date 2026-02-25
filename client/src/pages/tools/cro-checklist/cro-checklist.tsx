import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface ChecklistItem {
  id: string
  label: string
  description: string
  priority: "critical" | "high" | "medium"
}

interface ChecklistCategory {
  id: string
  title: string
  icon: string
  color: { bg: string; text: string; border: string; progress: string }
  items: ChecklistItem[]
}

const categories: ChecklistCategory[] = [
  {
    id: "homepage",
    title: "Homepage & First Impression",
    icon: "/images/cro-icons/homepage.png",
    color: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", progress: "bg-purple-500" },
    items: [
      { id: "hp-1", label: "Clear value proposition above the fold", description: "Visitors should understand what you sell and why within 3 seconds of landing", priority: "critical" },
      { id: "hp-2", label: "Professional logo and consistent branding", description: "A polished logo, consistent color scheme, and cohesive visual identity", priority: "high" },
      { id: "hp-3", label: "Hero section with strong CTA", description: "Eye-catching hero banner with a clear call-to-action like 'Shop Now' or 'Browse Collection'", priority: "critical" },
      { id: "hp-4", label: "Featured products or bestsellers visible", description: "Showcase your top products or categories prominently on the homepage", priority: "high" },
      { id: "hp-5", label: "Social proof on homepage (reviews, press, numbers)", description: "Display customer count, review scores, press mentions, or trust badges", priority: "high" },
      { id: "hp-6", label: "Announcement bar for promotions", description: "Top-of-page banner showing free shipping threshold, active sales, or offers", priority: "medium" },
    ],
  },
  {
    id: "product-pages",
    title: "Product Pages",
    icon: "/images/cro-icons/product-pages.png",
    color: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", progress: "bg-blue-500" },
    items: [
      { id: "pp-1", label: "High-quality product images (5+ per product)", description: "Multiple angles, lifestyle shots, size reference, and zoom functionality", priority: "critical" },
      { id: "pp-2", label: "Compelling product title with keywords", description: "Descriptive, SEO-friendly titles that clearly communicate the product", priority: "critical" },
      { id: "pp-3", label: "Detailed product description with benefits", description: "Focus on customer benefits, not just features. Use bullet points for scannability", priority: "critical" },
      { id: "pp-4", label: "Visible price with compare-at/sale pricing", description: "Show current price clearly, with original price crossed out if on sale", priority: "high" },
      { id: "pp-5", label: "Customer reviews displayed on product page", description: "Show star ratings, written reviews, and customer photos if available", priority: "critical" },
      { id: "pp-6", label: "Clear Add to Cart button (contrasting color)", description: "CTA button should stand out with a bold color and be easily clickable", priority: "critical" },
      { id: "pp-7", label: "Shipping info visible on product page", description: "Show estimated delivery time and shipping cost before checkout", priority: "high" },
      { id: "pp-8", label: "Size guide or product specifications table", description: "Reduce returns with clear sizing charts or detailed specs", priority: "medium" },
      { id: "pp-9", label: "Related products / 'You may also like' section", description: "Cross-sell with relevant product recommendations to increase AOV", priority: "high" },
      { id: "pp-10", label: "Urgency elements (stock counter, timer)", description: "Low stock indicators or limited-time offers to encourage quick decisions", priority: "medium" },
    ],
  },
  {
    id: "trust-security",
    title: "Trust & Security",
    icon: "/images/cro-icons/trust-security.png",
    color: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", progress: "bg-emerald-500" },
    items: [
      { id: "ts-1", label: "SSL certificate active (HTTPS)", description: "Your entire site should load over HTTPS — essential for security and SEO", priority: "critical" },
      { id: "ts-2", label: "Trust badges near Add to Cart and checkout", description: "Display payment security badges, money-back guarantee, and secure checkout icons", priority: "critical" },
      { id: "ts-3", label: "Professional About Us page", description: "Tell your brand story, show the team, and build a human connection", priority: "high" },
      { id: "ts-4", label: "Clear Contact page with multiple channels", description: "Email, phone, live chat, and physical address (if applicable)", priority: "high" },
      { id: "ts-5", label: "Return & refund policy clearly accessible", description: "Easy-to-find, clear policy reduces purchase anxiety. Link in footer and product pages", priority: "critical" },
      { id: "ts-6", label: "Privacy policy and terms of service", description: "Legally required pages that also build trust with cautious shoppers", priority: "high" },
      { id: "ts-7", label: "Customer testimonials or case studies", description: "Real customer stories with photos add powerful social proof", priority: "medium" },
    ],
  },
  {
    id: "checkout",
    title: "Checkout & Payment",
    icon: "/images/cro-icons/checkout.png",
    color: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", progress: "bg-orange-500" },
    items: [
      { id: "co-1", label: "Guest checkout option available", description: "Don't force account creation — it's the #1 reason for cart abandonment", priority: "critical" },
      { id: "co-2", label: "Multiple payment methods (Card, PayPal, Apple Pay)", description: "Offer the payment methods your target market prefers", priority: "critical" },
      { id: "co-3", label: "Cart abandonment email sequence set up", description: "Automated emails to recover lost sales (send at 1h, 24h, 72h)", priority: "critical" },
      { id: "co-4", label: "Order summary visible throughout checkout", description: "Show product image, name, quantity, and price at every checkout step", priority: "high" },
      { id: "co-5", label: "Progress indicator in multi-step checkout", description: "Show customers where they are in the checkout process", priority: "medium" },
      { id: "co-6", label: "Shipping costs shown before checkout page", description: "Unexpected shipping costs are the #2 reason for cart abandonment", priority: "critical" },
      { id: "co-7", label: "Upsell / cross-sell in cart", description: "Suggest complementary products or offer a bundle discount in the cart", priority: "high" },
      { id: "co-8", label: "Discount code field visible but not prominent", description: "Include it but don't make it so visible that people leave to search for codes", priority: "medium" },
    ],
  },
  {
    id: "speed-mobile",
    title: "Speed & Mobile Optimization",
    icon: "/images/cro-icons/speed-mobile.png",
    color: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100", progress: "bg-cyan-500" },
    items: [
      { id: "sm-1", label: "Page load time under 3 seconds", description: "Every extra second of load time reduces conversions by ~7%", priority: "critical" },
      { id: "sm-2", label: "Mobile-responsive design (test on real devices)", description: "60-80% of ecommerce traffic is mobile — your site must look perfect on phones", priority: "critical" },
      { id: "sm-3", label: "Images optimized and compressed", description: "Use WebP format, lazy loading, and proper sizing to reduce page weight", priority: "high" },
      { id: "sm-4", label: "No broken links or 404 errors", description: "Regularly audit for dead links that frustrate visitors and hurt SEO", priority: "high" },
      { id: "sm-5", label: "Touch-friendly buttons and navigation on mobile", description: "Buttons should be at least 44x44px with adequate spacing for thumb taps", priority: "high" },
      { id: "sm-6", label: "Sticky Add to Cart on mobile product pages", description: "Keep the buy button always visible as users scroll on mobile", priority: "medium" },
    ],
  },
  {
    id: "seo-content",
    title: "SEO & Content",
    icon: "/images/cro-icons/seo-content.png",
    color: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", progress: "bg-rose-500" },
    items: [
      { id: "sc-1", label: "Unique meta titles and descriptions for all pages", description: "Every page should have a unique, keyword-rich title tag and meta description", priority: "critical" },
      { id: "sc-2", label: "Image alt tags with descriptive keywords", description: "Help search engines understand your images and improve accessibility", priority: "high" },
      { id: "sc-3", label: "Blog or content section with relevant articles", description: "Content marketing drives organic traffic and builds authority", priority: "medium" },
      { id: "sc-4", label: "Clean URL structure (no random strings)", description: "Use readable URLs like /products/wireless-earbuds instead of /products/12345", priority: "high" },
      { id: "sc-5", label: "Google Analytics and Search Console connected", description: "Track traffic, conversions, and search performance data", priority: "critical" },
      { id: "sc-6", label: "Facebook Pixel and conversion tracking installed", description: "Essential for running effective paid ads and building audiences", priority: "critical" },
    ],
  },
  {
    id: "engagement",
    title: "Customer Engagement & Retention",
    icon: "/images/cro-icons/engagement.png",
    color: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", progress: "bg-amber-500" },
    items: [
      { id: "ce-1", label: "Email capture popup (with incentive)", description: "Offer 10-15% off first order in exchange for email subscription", priority: "critical" },
      { id: "ce-2", label: "Welcome email sequence for new subscribers", description: "Automated series introducing your brand and best products", priority: "high" },
      { id: "ce-3", label: "Post-purchase email flow (review request + upsell)", description: "Follow up after delivery to get reviews and suggest next purchase", priority: "high" },
      { id: "ce-4", label: "Live chat or chatbot for instant support", description: "Answer questions in real-time to remove purchase barriers", priority: "medium" },
      { id: "ce-5", label: "Social media links in header/footer", description: "Connect visitors to your social presence for ongoing engagement", priority: "medium" },
      { id: "ce-6", label: "Loyalty or rewards program", description: "Encourage repeat purchases with points, tiers, or exclusive offers", priority: "medium" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Testing",
    icon: "/images/cro-icons/analytics.png",
    color: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", progress: "bg-indigo-500" },
    items: [
      { id: "at-1", label: "Conversion tracking set up for all goals", description: "Track Add to Cart, Initiate Checkout, and Purchase events at minimum", priority: "critical" },
      { id: "at-2", label: "Heatmap tool installed (Hotjar, Microsoft Clarity)", description: "See where visitors click, scroll, and drop off on your pages", priority: "high" },
      { id: "at-3", label: "Monitor cart abandonment rate weekly", description: "Track and analyze why carts are being abandoned to find fixes", priority: "high" },
      { id: "at-4", label: "A/B test product page elements regularly", description: "Test headlines, images, CTA text, and pricing to optimize conversions", priority: "medium" },
      { id: "at-5", label: "Review site search data for product gaps", description: "Analyze what visitors search for to discover unmet demand", priority: "medium" },
    ],
  },
]

const priorityConfig = {
  critical: { label: "Critical", className: "bg-red-50 text-red-600 border-red-100" },
  high: { label: "High", className: "bg-amber-50 text-amber-600 border-amber-100" },
  medium: { label: "Medium", className: "bg-blue-50 text-blue-600 border-blue-100" },
}

export function CROChecklist() {
  const { user } = useAuth()
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map(c => [c.id, true]))
  )
  const [filterPriority, setFilterPriority] = useState<"all" | "critical" | "high" | "medium">("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestCheckedRef = useRef<Record<string, boolean>>({})

  const saveToServer = useCallback(async (data: Record<string, boolean>) => {
    try {
      await apiFetch('/api/cro-checklist/state', {
        method: 'PUT',
        body: JSON.stringify({ checked_items: data }),
      })
    } catch (err) {
      console.error('Failed to save checklist state:', err)
    }
  }, [])

  const debouncedSave = useCallback((data: Record<string, boolean>) => {
    latestCheckedRef.current = data
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      saveToServer(data)
    }, 500)
  }, [saveToServer])

  useEffect(() => {
    if (!user) { setIsLoading(false); return }
    apiFetch('/api/cro-checklist/state')
      .then(res => res.json())
      .then(data => {
        if (data.checked_items && typeof data.checked_items === 'object') {
          setChecked(data.checked_items)
          latestCheckedRef.current = data.checked_items
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  const toggleCheck = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    debouncedSave(next)
  }

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const overallPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const getScore = () => {
    if (overallPercent >= 90) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" }
    if (overallPercent >= 70) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50" }
    if (overallPercent >= 50) return { label: "Needs Work", color: "text-amber-600", bg: "bg-amber-50" }
    return { label: "Getting Started", color: "text-red-500", bg: "bg-red-50" }
  }
  const score = getScore()

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <Card className="bg-white border-gray-100">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("px-3 py-1 rounded-full text-sm font-bold", score.bg, score.color)} data-testid="text-cro-score">
              {score.label} — {overallPercent}%
            </div>
            <span className="text-sm text-gray-400">{checkedCount} of {totalItems} completed</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", overallPercent >= 70 ? "bg-emerald-500" : overallPercent >= 40 ? "bg-amber-500" : "bg-red-400")}
              style={{ width: `${overallPercent}%` }}
              data-testid="progress-cro-overall"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "critical", "high", "medium"] as const).map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all cursor-pointer",
              filterPriority === p
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
            data-testid={`button-filter-${p}`}
          >
            {p === "all" ? "All Items" : priorityConfig[p].label}
          </button>
        ))}

        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all cursor-pointer ml-auto",
            !showCompleted
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          )}
          data-testid="button-toggle-completed"
        >
          {showCompleted ? "Hide Completed" : "Show Completed"}
        </button>
      </div>

      <div className="space-y-3">
        {categories.map(category => {
          const filteredItems = category.items.filter(item => {
            if (filterPriority !== "all" && item.priority !== filterPriority) return false
            if (!showCompleted && checked[item.id]) return false
            return true
          })

          if (filteredItems.length === 0) return null

          const catChecked = category.items.filter(i => checked[i.id]).length
          const catPercent = Math.round((catChecked / category.items.length) * 100)
          const isExpanded = expandedCategories[category.id]

          return (
            <Card key={category.id} className="bg-white border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                data-testid={`button-category-${category.id}`}
              >
                <div className="shrink-0 w-9 h-9 flex items-center justify-center">
                  <img src={category.icon} alt={category.title} className="w-9 h-9 object-contain" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-gray-900">{category.title}</h3>
                    <span className="text-[11px] text-gray-400 font-medium">{catChecked}/{category.items.length}</span>
                  </div>
                  <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", category.color.progress)}
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>
                <span className={cn("text-sm font-bold", catPercent === 100 ? "text-emerald-500" : "text-gray-400")}>{catPercent}%</span>
                {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />}
              </button>

              {isExpanded && (
                <div className="border-t border-gray-50">
                  {filteredItems.map((item, idx) => {
                    const isChecked = !!checked[item.id]
                    const pConfig = priorityConfig[item.priority]
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={cn(
                          "flex items-start gap-3 px-5 py-3.5 transition-all cursor-pointer group",
                          idx < filteredItems.length - 1 && "border-b border-gray-50",
                          isChecked ? "bg-emerald-50/30" : "hover:bg-gray-50/50"
                        )}
                        data-testid={`checklist-item-${item.id}`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isChecked ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("text-[14px] font-medium transition-all", isChecked ? "text-gray-400 line-through" : "text-gray-900")}>
                              {item.label}
                            </span>
                            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full border", pConfig.className)}>
                              {pConfig.label}
                            </span>
                          </div>
                          <p className={cn("text-[12px] mt-0.5 leading-relaxed", isChecked ? "text-gray-300" : "text-gray-500")}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
