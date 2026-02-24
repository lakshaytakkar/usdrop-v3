
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Lock,
  Play,
  X,
  ShoppingCart,
  Landmark,
  CreditCard,
  ShieldCheck,
  FileText,
  Globe,
  AlertCircle,
  Check,
  Minus,
  Star,
  Copy,
  Zap,
  Crown,
  Tag,
  CheckCircle2,
} from "lucide-react"

const DISCOUNT_CODE = "USDROP30"

const comparisonFeatures = [
  { feature: "LLC Formation (any US state)", justLlc: true, elite: true },
  { feature: "EIN (Tax ID) from IRS", justLlc: true, elite: true },
  { feature: "Articles of Organization", justLlc: true, elite: true },
  { feature: "Operating Agreement", justLlc: true, elite: true },
  { feature: "Registered Agent (1st year)", justLlc: true, elite: true },
  { feature: "US Mailing Address", justLlc: false, elite: true },
  { feature: "US Phone Number", justLlc: false, elite: true },
  { feature: "US Bank Account Setup", justLlc: false, elite: true },
  { feature: "ITIN Application Assistance", justLlc: false, elite: true },
  { feature: "Resale Certificate Filing", justLlc: false, elite: true },
  { feature: "Amazon Seller Account Setup", justLlc: false, elite: true },
  { feature: "Shopify Store Setup", justLlc: false, elite: true },
  { feature: "Annual Compliance Reminders", justLlc: true, elite: true },
  { feature: "Dedicated Account Manager", justLlc: false, elite: true },
  { feature: "Priority Support", justLlc: false, elite: true },
]

export default function MyLLCPage() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const lockedFields = [
    { label: "LLC Name", placeholder: "Your Business Name LLC", icon: Building2 },
    { label: "EIN Number", placeholder: "XX-XXXXXXX", icon: FileText },
    { label: "Articles of Organization", placeholder: "Not filed", icon: FileText },
    { label: "Operating Agreement", placeholder: "Not created", icon: ShieldCheck },
    { label: "Registered Agent", placeholder: "None assigned", icon: Globe },
    { label: "State of Formation", placeholder: "Not selected", icon: Landmark },
  ]

  const benefits = [
    {
      icon: ShoppingCart,
      title: "Marketplace Approvals",
      description: "Amazon, Walmart, eBay and TikTok Shop require a US LLC and EIN to sell. Without one, you can't even apply.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Landmark,
      title: "US Business Bank Account",
      description: "Open a real US bank account with Mercury, Relay or Chase. Required for receiving payouts and managing cash flow.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: CreditCard,
      title: "Payment Gateway Access",
      description: "Stripe, PayPal Business and Shopify Payments all require a US LLC and EIN to process transactions for your store.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: ShieldCheck,
      title: "Personal Asset Protection",
      description: "An LLC separates your personal assets from your business. If something goes wrong, your personal finances stay protected.",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: Globe,
      title: "US Business Credibility",
      description: "Customers trust US-based businesses more. An LLC with a US address gives your brand legitimacy and higher conversion rates.",
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      icon: FileText,
      title: "Tax Benefits & Compliance",
      description: "Proper LLC formation in states like Wyoming or Delaware offers tax advantages and simple annual compliance requirements.",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ]

  return (
    <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
      <div className="max-w-5xl mx-auto w-full space-y-10">

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1" data-testid="badge-llc-featured">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              Featured Service
            </Badge>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 gap-1" data-testid="badge-llc-legalnations">
              <ShieldCheck className="h-3 w-3" />
              Powered by LegalNations
            </Badge>
          </div>
          <h1 className="ds-page-title ds-text-heading" data-testid="text-llc-title">
            Form Your US LLC
          </h1>
          <p className="ds-body ds-text-muted max-w-2xl mx-auto">
            Every serious e-commerce business needs a US LLC. It's the foundation for marketplace approvals, payment processing, and legal protection.
          </p>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer group border border-gray-200/60 shadow-sm"
          onClick={() => setVideoOpen(true)}
          data-testid="button-play-llc-video"
        >
          <div className="aspect-video bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/50 to-purple-900/60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="h-20 w-20 mx-auto rounded-full bg-white/95 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-8 w-8 text-blue-600 ml-1" />
                </div>
                <p className="text-white font-semibold text-lg drop-shadow-md">Why You Need a US LLC for Dropshipping</p>
                <p className="text-white/70 text-sm">3 min watch</p>
              </div>
            </div>
          </div>
        </div>

        {videoOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-12 right-0 text-white/80 transition-colors"
                data-testid="button-close-llc-video"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
                <p className="text-white/60 text-sm">Video player will load here</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6" data-testid="section-pricing-comparison">
          <div className="text-center space-y-2">
            <h2 className="ds-section-title ds-text-heading">Choose Your Plan</h2>
            <p className="text-sm ds-text-muted max-w-xl mx-auto">
              Compare our LLC formation packages. USDrop members save 30% compared to going directly through LegalNations.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ backdropFilter: 'blur(8px)' }} data-testid="banner-discount">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Tag className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Exclusive USDrop Member Discount</p>
                <p className="text-xs text-emerald-600">Save 30% off LegalNations regular pricing. Use code at checkout.</p>
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-emerald-300 bg-white font-mono text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors flex-shrink-0"
              data-testid="button-copy-discount-code"
            >
              {codeCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {DISCOUNT_CODE}
                </>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200/60 bg-white/70 overflow-hidden" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="grid grid-cols-3">
              <div className="p-5 border-b border-r border-gray-200/60">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Features</p>
              </div>

              <div className="p-5 border-b border-r border-gray-200/60 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <p className="font-semibold ds-text-heading text-[15px]">Just LLC</p>
                  </div>
                  <p className="text-xs text-gray-400">Essential formation</p>
                  <div className="pt-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-xs text-gray-400 line-through">$389</span>
                      <span className="text-2xl font-bold ds-text-heading">$272</span>
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Save 30% with USDrop</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border-b border-gray-200/60 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <p className="font-semibold ds-text-heading text-[15px]">Elite</p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] px-1.5 py-0">Most Popular</Badge>
                  <div className="pt-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-xs text-gray-400 line-through">$699</span>
                      <span className="text-2xl font-bold ds-text-heading">$489</span>
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Save 30% with USDrop</p>
                  </div>
                </div>
              </div>
            </div>

            {comparisonFeatures.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 ${i < comparisonFeatures.length - 1 ? 'border-b border-gray-100' : ''} ${i % 2 === 0 ? 'bg-gray-50/30' : ''}`}
                data-testid={`row-compare-${i}`}
              >
                <div className="px-5 py-3.5 border-r border-gray-100 flex items-center">
                  <p className="text-sm ds-text-body">{row.feature}</p>
                </div>
                <div className="px-5 py-3.5 border-r border-gray-100 flex items-center justify-center">
                  {row.justLlc ? (
                    <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                  ) : (
                    <Minus className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div className="px-5 py-3.5 flex items-center justify-center">
                  {row.elite ? (
                    <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                  ) : (
                    <Minus className="h-4 w-4 text-gray-300" />
                  )}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 border-t border-gray-200/60 bg-gray-50/50">
              <div className="p-5 border-r border-gray-200/60" />
              <div className="p-5 border-r border-gray-200/60 flex justify-center">
                <Button
                  className="gap-2"
                  variant="outline"
                  onClick={() => window.open('https://legalnations.com/usdrop-llc', '_blank')}
                  data-testid="button-get-just-llc"
                >
                  <Building2 className="h-4 w-4" />
                  Get Just LLC
                </Button>
              </div>
              <div className="p-5 flex justify-center">
                <Button
                  className="gap-2"
                  onClick={() => window.open('https://legalnations.com/usdrop-elite', '_blank')}
                  data-testid="button-get-elite"
                >
                  <Crown className="h-4 w-4" />
                  Get Elite
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs ds-text-muted">
              Prices shown reflect the exclusive 30% USDrop discount. Regular LegalNations pricing is $389 (Just LLC) and $699 (Elite).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h2 className="ds-section-title ds-text-heading">Your LLC Status</h2>
          </div>
          <p className="text-sm ds-text-muted -mt-2">These fields are required to operate your e-commerce business in the US. View your important LLC details right here without leaving the portal.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedFields.map((field) => (
              <div
                key={field.label}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200/60 bg-white/40 relative overflow-hidden"
                style={{ backdropFilter: 'blur(8px)' }}
                data-testid={`card-llc-field-${field.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <field.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500">{field.label}</p>
                  <p className="text-sm text-gray-300 italic">{field.placeholder}</p>
                </div>
                <Lock className="h-4 w-4 text-gray-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="ds-section-title ds-text-heading">Why Every Dropshipper Needs a US LLC</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-gray-200/60 bg-white/60 p-5 space-y-3"
                style={{ backdropFilter: 'blur(8px)' }}
                data-testid={`card-llc-benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`h-10 w-10 rounded-lg ${benefit.bg} flex items-center justify-center`}>
                  <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                </div>
                <h3 className="font-semibold ds-text-heading text-[15px]">{benefit.title}</h3>
                <p className="text-sm ds-text-muted leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="ds-section-title ds-text-heading">What You'll Get</h2>
          <div className="space-y-3">
            {[
              "Registered LLC in your chosen state (Wyoming, Delaware, or any US state)",
              "EIN (Employer Identification Number) from the IRS",
              "Articles of Organization filed and approved",
              "Custom Operating Agreement for e-commerce",
              "Registered Agent service (first year included)",
              "Step-by-step guide to open your US bank account",
              "Compliance calendar and annual filing reminders",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-gray-200/60 bg-white/60" style={{ backdropFilter: 'blur(8px)' }} data-testid={`card-llc-included-${i}`}>
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm ds-text-body leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white space-y-4" data-testid="section-llc-cta">
          <h2 className="text-2xl font-bold">Ready to Make It Official?</h2>
          <p className="text-blue-100 max-w-lg mx-auto">
            Stop leaving money on the table. Form your US LLC today and unlock marketplace approvals, payment gateways, and a real US business identity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              data-testid="button-get-llc-cta"
              onClick={() => window.open('https://legalnations.com/usdrop-elite', '_blank')}
            >
              <Crown className="h-4 w-4" />
              Get Elite Package
            </Button>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2.5">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-medium">Use code: <span className="font-mono font-bold">{DISCOUNT_CODE}</span> for 30% off</span>
            </div>
          </div>
        </div>

        <div className="pb-8" />
      </div>
    </div>
  )
}
