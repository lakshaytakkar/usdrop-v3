
import { useState } from "react"
import {
  Play,
  X,
  ShoppingCart,
  Landmark,
  CreditCard,
  ShieldCheck,
  FileText,
  Globe,
  Check,
  Minus,
  Copy,
  Zap,
  Crown,
  Tag,
  CheckCircle2,
  ArrowRight,
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

const benefits = [
  {
    icon: ShoppingCart,
    title: "Marketplace Approvals",
    description: "Amazon, Walmart, eBay and TikTok Shop require a US LLC and EIN to sell.",
  },
  {
    icon: Landmark,
    title: "US Business Bank Account",
    description: "Open a real US bank account with Mercury, Relay or Chase for payouts.",
  },
  {
    icon: CreditCard,
    title: "Payment Gateway Access",
    description: "Stripe, PayPal Business and Shopify Payments all require a US LLC.",
  },
  {
    icon: ShieldCheck,
    title: "Personal Asset Protection",
    description: "An LLC separates personal assets from your business liabilities.",
  },
  {
    icon: Globe,
    title: "US Business Credibility",
    description: "A US address gives your brand legitimacy and higher conversion rates.",
  },
  {
    icon: FileText,
    title: "Tax Benefits & Compliance",
    description: "Wyoming or Delaware LLCs offer tax advantages and simple compliance.",
  },
]

const includedItems = [
  "Registered LLC in your chosen state (Wyoming, Delaware, or any US state)",
  "EIN (Employer Identification Number) from the IRS",
  "Articles of Organization filed and approved",
  "Custom Operating Agreement for e-commerce",
  "Registered Agent service (first year included)",
  "Step-by-step guide to open your US bank account",
  "Compliance calendar and annual filing reminders",
]

export default function MyLLCPage() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="flex flex-1 flex-col px-6 md:px-12 lg:px-20 py-8 md:py-12 min-h-0 relative">
      <div className="max-w-5xl mx-auto w-full space-y-20 lg:space-y-28">

        <div className="text-center space-y-6">
          <p className="text-[11px] font-bold text-[#999] uppercase tracking-[0.12em]">LLC Formation</p>
          <h1
            className="text-[40px] md:text-[52px] font-bold text-black leading-[1.08] tracking-[-1.5px] md:tracking-[-2px]"
            data-testid="text-llc-title"
          >
            Form Your US LLC
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#666] max-w-xl mx-auto leading-[1.5]">
            The foundation for marketplace approvals, payment processing, and legal protection.
          </p>
          <div className="pt-2">
            <a
              href="https://legalnations.com/usdrop-elite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
              data-testid="button-hero-cta"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div
          className="relative rounded-[20px] overflow-hidden cursor-pointer group border border-black/[0.04]"
          onClick={() => setVideoOpen(true)}
          data-testid="button-play-llc-video"
        >
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-24 w-24 mx-auto rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-10 w-10 text-black ml-1" />
                </div>
                <p className="text-white font-bold text-[20px] tracking-[-0.4px] drop-shadow-md">Why You Need a US LLC for Dropshipping</p>
                <p className="text-[14px] text-white/60">3 min watch</p>
              </div>
            </div>
          </div>
        </div>

        {videoOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-12 right-0 text-white/80 transition-colors cursor-pointer"
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

        <div className="space-y-10" data-testid="section-pricing-comparison">
          <div className="text-center space-y-3">
            <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
              Choose Your Plan
            </h2>
            <p className="text-[15px] text-[#666] max-w-xl mx-auto leading-[1.5]">
              USDrop members save 30% compared to going directly through LegalNations.
            </p>
          </div>

          <div className="rounded-[16px] border border-black/[0.04] bg-[#FAFAFA] p-5 flex flex-col sm:flex-row items-center justify-between gap-4" data-testid="banner-discount">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white border border-black/[0.04] flex items-center justify-center flex-shrink-0">
                <Tag className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-black">Exclusive USDrop Member Discount</p>
                <p className="text-[13px] text-[#666]">Save 30% off LegalNations regular pricing</p>
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border-2 border-dashed border-black/[0.12] bg-white font-mono text-[14px] font-bold text-black hover:bg-gray-50 transition-colors flex-shrink-0 cursor-pointer"
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

          <div className="rounded-[20px] border border-black/[0.04] bg-white overflow-hidden">
            <div className="grid grid-cols-3">
              <div className="p-5 border-b border-r border-black/[0.04]">
                <p className="text-[11px] font-bold text-[#999] uppercase tracking-[0.12em]">Features</p>
              </div>

              <div className="p-5 border-b border-r border-black/[0.04] text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <Zap className="h-4 w-4 text-black" />
                    <p className="text-[15px] font-bold text-black">Just LLC</p>
                  </div>
                  <p className="text-[12px] text-[#999]">Essential formation</p>
                  <div className="pt-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-[13px] text-[#999] line-through">$389</span>
                      <span className="text-[28px] font-bold text-black tracking-[-0.5px]">$272</span>
                    </div>
                    <p className="text-[11px] text-[#666] font-medium mt-0.5">Save 30% with USDrop</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border-b border-black/[0.04] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-black" />
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <Crown className="h-4 w-4 text-black" />
                    <p className="text-[15px] font-bold text-black">Elite</p>
                  </div>
                  <span className="inline-block bg-[#FAFAFA] border border-black/[0.04] text-[10px] text-black font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]">Most Popular</span>
                  <div className="pt-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-[13px] text-[#999] line-through">$699</span>
                      <span className="text-[28px] font-bold text-black tracking-[-0.5px]">$489</span>
                    </div>
                    <p className="text-[11px] text-[#666] font-medium mt-0.5">Save 30% with USDrop</p>
                  </div>
                </div>
              </div>
            </div>

            {comparisonFeatures.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 ${i < comparisonFeatures.length - 1 ? 'border-b border-black/[0.04]' : ''} ${i % 2 === 0 ? 'bg-[#FAFAFA]/50' : ''}`}
                data-testid={`row-compare-${i}`}
              >
                <div className="px-5 py-3.5 border-r border-black/[0.04] flex items-center">
                  <p className="text-[15px] text-[#333]">{row.feature}</p>
                </div>
                <div className="px-5 py-3.5 border-r border-black/[0.04] flex items-center justify-center">
                  {row.justLlc ? (
                    <div className="h-6 w-6 rounded-full bg-[#FAFAFA] flex items-center justify-center">
                      <Check className="h-4 w-4 text-black" />
                    </div>
                  ) : (
                    <Minus className="h-4 w-4 text-[#ccc]" />
                  )}
                </div>
                <div className="px-5 py-3.5 flex items-center justify-center">
                  {row.elite ? (
                    <div className="h-6 w-6 rounded-full bg-[#FAFAFA] flex items-center justify-center">
                      <Check className="h-4 w-4 text-black" />
                    </div>
                  ) : (
                    <Minus className="h-4 w-4 text-[#ccc]" />
                  )}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 border-t border-black/[0.04] bg-[#FAFAFA]/50">
              <div className="p-5 border-r border-black/[0.04]" />
              <div className="p-5 border-r border-black/[0.04] flex justify-center">
                <a
                  href="https://legalnations.com/usdrop-llc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-black font-bold px-6 py-3 rounded-[10px] text-[14px] border border-black/[0.08] transition-colors"
                  data-testid="button-get-just-llc"
                >
                  Get Just LLC
                </a>
              </div>
              <div className="p-5 flex justify-center">
                <a
                  href="https://legalnations.com/usdrop-elite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-[10px] text-[14px] transition-colors"
                  data-testid="button-get-elite"
                >
                  <Crown className="h-4 w-4" />
                  Get Elite
                </a>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <p className="text-[13px] text-[#999]">
              Prices shown reflect the exclusive 30% USDrop discount. Regular LegalNations pricing is $389 (Just LLC) and $699 (Elite).
            </p>
            <a
              href="https://legalnations.com/usdrop-elite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
              data-testid="button-mid-cta"
            >
              Start Your LLC Today
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-10">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1] text-center">
            Why Every Dropshipper Needs a US LLC
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-[#FAFAFA] border border-black/[0.04] rounded-[16px] p-8 space-y-4"
                data-testid={`card-llc-benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="h-11 w-11 rounded-[12px] bg-white border border-black/[0.04] flex items-center justify-center">
                  <benefit.icon className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-[20px] font-bold text-black tracking-[-0.4px]">{benefit.title}</h3>
                <p className="text-[15px] text-[#666] leading-[1.5]">{benefit.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              href="https://legalnations.com/usdrop-elite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
              data-testid="button-benefits-cta"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-10">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1] text-center">
            What You'll Get
          </h2>
          <div className="bg-white border border-black/[0.04] rounded-[20px] p-8 md:p-10">
            <div className="space-y-4">
              {includedItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3" data-testid={`card-llc-included-${i}`}>
                  <CheckCircle2 className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333] leading-[1.5]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-[24px] p-12 md:p-20 text-center relative overflow-hidden" data-testid="section-llc-cta">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #6366F1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #818CF8 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10 space-y-6">
            <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-bold text-white tracking-[-1px] leading-[1.1]">
              Ready to Make It Official?
            </h2>
            <p className="text-[16px] text-[#888] max-w-lg mx-auto leading-[1.5]">
              Form your US LLC today and unlock marketplace approvals, payment gateways, and a real US business identity.
            </p>
            <div className="flex flex-col items-center gap-4 pt-2">
              <a
                href="https://legalnations.com/usdrop-elite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-100 text-black font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
                data-testid="button-get-llc-cta"
              >
                Get Elite Package
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-[13px] text-[#666]">
                Use code <span className="font-mono font-bold text-white">{DISCOUNT_CODE}</span> for 30% off
              </p>
            </div>
          </div>
        </div>

        <div className="pb-8" />
      </div>
    </div>
  )
}
