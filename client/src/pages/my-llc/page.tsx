
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
  Building2,
  Star,
} from "lucide-react"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION, STAGGER } from "@/lib/motion/constants"

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
  { feature: "Shopify Website Development", justLlc: false, elite: true, highlight: true },
  { feature: "Annual Compliance Reminders", justLlc: true, elite: true },
  { feature: "Dedicated Account Manager", justLlc: false, elite: true },
  { feature: "Priority Support", justLlc: false, elite: true },
]

const benefits = [
  {
    icon: ShoppingCart,
    title: "Marketplace Approvals",
    description: "Amazon, Walmart, eBay and TikTok Shop require a US LLC and EIN to sell.",
    image: "/images/llc/benefit-protection.png",
    size: "large" as const,
  },
  {
    icon: Landmark,
    title: "US Business Bank Account",
    description: "Open a real US bank account with Mercury, Relay or Chase for payouts.",
    image: "/images/llc/benefit-banking.png",
    size: "small" as const,
  },
  {
    icon: CreditCard,
    title: "Payment Gateway Access",
    description: "Stripe, PayPal Business and Shopify Payments all require a US LLC.",
    image: "/images/llc/benefit-tax.png",
    size: "small" as const,
  },
  {
    icon: ShieldCheck,
    title: "Personal Asset Protection",
    description: "An LLC separates personal assets from your business liabilities.",
    image: "/images/llc/benefit-protection.png",
    size: "small" as const,
  },
  {
    icon: Globe,
    title: "US Business Credibility",
    description: "A US address gives your brand legitimacy and higher conversion rates.",
    image: "/images/llc/benefit-states.png",
    size: "large" as const,
  },
  {
    icon: FileText,
    title: "Tax Benefits & Compliance",
    description: "Wyoming or Delaware LLCs offer tax advantages and simple compliance.",
    image: "/images/llc/benefit-tax.png",
    size: "small" as const,
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

const trustLogos = [
  { name: "Amazon", logo: "/images/logos/amazon.svg" },
  { name: "Walmart", logo: "/images/logos/walmart.svg" },
  { name: "Shopify", logo: "/images/logos/shopify.svg" },
  { name: "eBay", logo: "/images/logos/ebay.svg" },
  { name: "TikTok", logo: "/images/logos/tiktok.svg" },
  { name: "Stripe", logo: "/images/logos/stripe.svg" },
  { name: "PayPal", logo: "/images/logos/paypal.svg" },
]

const stats = [
  { value: "5,000+", label: "LLCs Formed", icon: Building2 },
  { value: "4.9/5", label: "Client Rating", icon: Star },
  { value: "30%", label: "USDrop Savings", icon: Tag },
]

const imgEllipse11806 = "/images/hero/ellipse-11806.svg"
const imgEllipse11807 = "/images/hero/ellipse-11807.svg"
const imgEllipse11809 = "/images/hero/ellipse-11809.svg"
const imgArrowIcon = "/images/hero/arrow-icon.svg"

export default function MyLLCPage() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 relative">
      <div className="relative overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] size-[640px] pointer-events-none">
          <div className="absolute inset-[-65.63%]">
            <img alt="" className="block max-w-none size-full" src={imgEllipse11806} />
          </div>
        </div>
        <div className="absolute top-[-200px] left-[-200px] size-[640px] pointer-events-none">
          <div className="absolute inset-[-65.63%]">
            <img alt="" className="block max-w-none size-full" src={imgEllipse11809} />
          </div>
        </div>
        <div className="absolute bottom-[-100px] left-[-100px] size-[500px] pointer-events-none">
          <div className="absolute inset-[-65.63%]">
            <img alt="" className="block max-w-none size-full" src={imgEllipse11807} />
          </div>
        </div>

        <div className="relative z-[1]">
          <section className="pt-12 pb-6 px-6 md:px-12 lg:px-20">
            <div className="max-w-5xl mx-auto">
              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border border-white shadow-sm">
                    <img src="/3d-ecom-icons-blue/Category_Grid.png" alt="USDrop" className="h-7 w-7 object-contain" />
                    <span className="text-[14px] font-bold text-black tracking-[-0.2px]">USDrop</span>
                    <span className="text-[14px] text-[#999] font-medium">×</span>
                    <span className="text-[14px] font-bold text-black tracking-[-0.2px]">LegalNations</span>
                  </div>

                  <h1
                    className="text-[44px] md:text-[56px] lg:text-[64px] font-bold text-black leading-[1.08] tracking-[-1.5px] md:tracking-[-2px] lg:tracking-[-2.4px]"
                    data-testid="text-llc-title"
                  >
                    Form Your{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                      US LLC
                    </span>
                  </h1>
                  <p className="text-[17px] md:text-[19px] text-[#555] max-w-xl mx-auto leading-[1.5]">
                    We've partnered with LegalNations to bring you the most affordable and trusted LLC formation for dropshippers.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
                    <a
                      href="https://legalnations.com/usdrop-elite"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="button-hero-cta"
                      className="block"
                    >
                      <div className="bg-white h-[52px] overflow-clip rounded-[10px] w-[200px] relative">
                        <div
                          className="absolute inset-0 cursor-pointer"
                          style={{ backgroundImage: "linear-gradient(165.12deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%)" }}
                        />
                        <div
                          className="absolute h-[48px] left-1/2 rounded-[8px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[196px] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-between px-5"
                          style={{ backgroundImage: "linear-gradient(155.02deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)" }}
                        >
                          <span className="text-[15px] text-white font-bold">Get Started</span>
                          <div className="flex items-center justify-center size-5" style={{ transform: "rotate(180deg)" }}>
                            <div className="size-full relative">
                              <div className="absolute inset-[17%] flex items-center justify-center">
                                <div className="h-[8px] w-[10px]" style={{ transform: "rotate(-45deg)" }}>
                                  <img alt="" className="block max-w-none size-full" src={imgArrowIcon} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>

                    <button
                      onClick={() => setVideoOpen(true)}
                      className="h-[52px] overflow-hidden rounded-[10px] w-[200px] relative border border-black/[0.1] hover:border-black/[0.2] transition-all cursor-pointer bg-white flex items-center justify-between px-5"
                      data-testid="button-watch-video"
                    >
                      <span className="text-[15px] text-[#323140] font-bold">Watch Video</span>
                      <Play className="size-5 text-[#323140] fill-[#323140]" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
                    {[
                      "Govt-Registered Agent",
                      "5,000+ LLCs Formed",
                      "BBB Accredited",
                      "Lowest Price Guarantee",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-[13px] text-[#555] font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </MotionFadeIn>

              <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow} delay={0.15}>
                <div className="mt-12 rounded-[20px] overflow-hidden border border-black/[0.06] shadow-lg">
                  <img
                    src="/images/llc/hero-documents.png"
                    alt="LLC Formation Documents"
                    className="w-full h-auto object-cover"
                    data-testid="img-hero-documents"
                  />
                </div>
              </MotionFadeIn>
            </div>
          </section>

          <section className="py-12 lg:py-16 overflow-hidden">
            <MotionFadeIn direction="up" distance={DISTANCE.sm} duration={DURATION.slow}>
              <p className="text-center text-[13px] font-semibold text-[#999] uppercase tracking-[0.12em] mb-8">
                Accepted by every major marketplace and payment gateway
              </p>
              <div className="relative overflow-hidden">
                <div className="flex animate-marquee-llc gap-12 items-center">
                  {[...trustLogos, ...trustLogos, ...trustLogos].map((brand, i) => (
                    <div
                      key={`${brand.name}-${i}`}
                      className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                      data-testid={`logo-trust-${brand.name.toLowerCase()}-${i}`}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-[48px] sm:h-[54px] w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <style>{`
                @keyframes marquee-llc {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-33.333%); }
                }
                .animate-marquee-llc {
                  animation: marquee-llc 25s linear infinite;
                  width: max-content;
                }
              `}</style>
            </MotionFadeIn>
          </section>

          <section className="py-12 lg:py-20 px-6 md:px-12 lg:px-20" data-testid="section-stats">
            <div className="max-w-4xl mx-auto">
              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
                <div className="grid grid-cols-3 gap-8 lg:gap-16">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center" data-testid={`stat-${stat.label}`}>
                      <p className="text-[40px] sm:text-[52px] lg:text-[60px] font-bold text-black tracking-[-0.03em] leading-none mb-1">
                        {stat.value}
                      </p>
                      <p className="text-[13px] sm:text-[14px] text-[#888] font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </MotionFadeIn>
            </div>
          </section>

          <section className="py-12 lg:py-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-5xl mx-auto">
              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
                <div
                  className="relative rounded-[20px] overflow-hidden cursor-pointer group border border-black/[0.06] shadow-lg"
                  onClick={() => setVideoOpen(true)}
                  data-testid="button-play-llc-video"
                >
                  <div className="aspect-video relative">
                    <img
                      src="/images/llc/video-thumbnail.png"
                      alt="LLC Formation Video"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="h-20 w-20 mx-auto rounded-full bg-white/95 backdrop-blur-sm shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-8 w-8 text-black ml-1" />
                        </div>
                        <p className="text-white font-bold text-[20px] tracking-[-0.4px] drop-shadow-md">
                          Why You Need a US LLC for Dropshipping
                        </p>
                        <p className="text-[14px] text-white/60">3 min watch</p>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionFadeIn>
            </div>
          </section>

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

          <section className="py-12 lg:py-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-5xl mx-auto space-y-12">
              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
                <div className="text-center space-y-3 mb-4">
                  <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em]">
                    Benefits
                  </p>
                  <h2 className="text-[36px] md:text-[44px] lg:text-[52px] font-bold text-black tracking-[-1.5px] leading-[1.1]">
                    Why Every Dropshipper Needs a US LLC
                  </h2>
                  <p className="text-[16px] text-[#888] max-w-lg mx-auto">
                    Six critical reasons to form your LLC today.
                  </p>
                </div>
              </MotionFadeIn>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {benefits.map((benefit, index) => (
                  <MotionFadeIn
                    key={benefit.title}
                    direction="up"
                    distance={DISTANCE.md}
                    duration={DURATION.slow}
                    delay={index * STAGGER.md}
                  >
                    <div
                      className={`group relative rounded-[16px] overflow-hidden border border-black/[0.06] bg-white hover:shadow-lg hover:border-black/[0.1] transition-all duration-300 ${
                        benefit.size === "large" ? "lg:col-span-1" : ""
                      }`}
                      data-testid={`card-llc-benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="h-40 overflow-hidden bg-gradient-to-br from-[#f0f4ff] to-[#e8ecf8] relative">
                        <img
                          src={benefit.image}
                          alt={benefit.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="h-10 w-10 rounded-[10px] bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center">
                          <benefit.icon className="h-5 w-5 text-black" />
                        </div>
                        <h3 className="text-[18px] font-bold text-black tracking-[-0.3px]">{benefit.title}</h3>
                        <p className="text-[14px] text-[#666] leading-[1.5]">{benefit.description}</p>
                      </div>
                    </div>
                  </MotionFadeIn>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 lg:py-20 px-6 md:px-12 lg:px-20" data-testid="section-pricing-comparison">
            <div className="max-w-5xl mx-auto space-y-10">
              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
                <div className="text-center space-y-3">
                  <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em]">
                    Pricing
                  </p>
                  <h2 className="text-[36px] md:text-[44px] lg:text-[52px] font-bold text-black tracking-[-1.5px] leading-[1.1]">
                    Choose Your Plan
                  </h2>
                  <p className="text-[16px] text-[#888] max-w-xl mx-auto leading-[1.5]">
                    USDrop members save 30% compared to going directly through LegalNations.
                  </p>
                </div>
              </MotionFadeIn>

              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow} delay={0.1}>
                <div className="rounded-[16px] border border-black/[0.06] bg-gradient-to-r from-[#fafbff] to-[#f5f0ff] p-5 flex flex-col sm:flex-row items-center justify-between gap-4" data-testid="banner-discount">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white border border-black/[0.06] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Tag className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-black">Exclusive USDrop Member Discount</p>
                      <p className="text-[13px] text-[#666]">Save 30% off LegalNations regular pricing</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border-2 border-dashed border-indigo-200 bg-white font-mono text-[14px] font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex-shrink-0 cursor-pointer"
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
              </MotionFadeIn>

              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow} delay={0.15}>
                <div className="rounded-[20px] border border-black/[0.06] bg-white overflow-hidden shadow-sm">
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
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <Crown className="h-4 w-4 text-indigo-600" />
                          <p className="text-[15px] font-bold text-black">Elite</p>
                        </div>
                        <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 text-[10px] text-indigo-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]">Most Popular</span>
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

                  {comparisonFeatures.map((row, i) => {
                    const isHighlight = 'highlight' in row && row.highlight;
                    return (
                      <div
                        key={row.feature}
                        className={`grid grid-cols-3 ${i < comparisonFeatures.length - 1 ? 'border-b border-black/[0.04]' : ''} ${isHighlight ? 'bg-emerald-50/60' : i % 2 === 0 ? 'bg-[#FAFAFA]/50' : ''}`}
                        data-testid={`row-compare-${i}`}
                      >
                        <div className="px-5 py-3.5 border-r border-black/[0.04] flex items-center gap-2">
                          <p className={`text-[15px] ${isHighlight ? 'text-emerald-700 font-semibold' : 'text-[#333]'}`}>{row.feature}</p>
                          {isHighlight && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-600 border border-emerald-200">New</span>
                          )}
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
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isHighlight ? 'bg-emerald-100' : 'bg-[#FAFAFA]'}`}>
                              <Check className={`h-4 w-4 ${isHighlight ? 'text-emerald-600' : 'text-black'}`} />
                            </div>
                          ) : (
                            <Minus className="h-4 w-4 text-[#ccc]" />
                          )}
                        </div>
                      </div>
                    );
                  })}

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
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-[10px] text-[14px] transition-all shadow-md"
                        data-testid="button-get-elite"
                      >
                        <Crown className="h-4 w-4" />
                        Get Elite
                      </a>
                    </div>
                  </div>
                </div>
              </MotionFadeIn>

              <MotionFadeIn direction="up" distance={DISTANCE.sm} duration={DURATION.slow}>
                <p className="text-center text-[13px] text-[#999]">
                  Prices shown reflect the exclusive 30% USDrop discount. Regular LegalNations pricing is $389 (Just LLC) and $699 (Elite).
                </p>
              </MotionFadeIn>
            </div>
          </section>

          <section className="py-12 lg:py-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-5xl mx-auto space-y-10">
              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
                <div className="text-center space-y-3">
                  <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em]">
                    Included
                  </p>
                  <h2 className="text-[36px] md:text-[44px] font-bold text-black tracking-[-1.5px] leading-[1.1]">
                    What You'll Get
                  </h2>
                </div>
              </MotionFadeIn>

              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow} delay={0.1}>
                <div className="bg-white border border-black/[0.06] rounded-[20px] p-8 md:p-10 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    {includedItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#fafbff] transition-colors" data-testid={`card-llc-included-${i}`}>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <p className="text-[15px] text-[#333] leading-[1.5]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </MotionFadeIn>
            </div>
          </section>

          <section className="py-12 lg:py-20 px-6 md:px-12 lg:px-20" data-testid="section-llc-cta">
            <div className="max-w-5xl mx-auto">
              <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
                <div className="bg-[#323140] rounded-3xl p-14 md:p-20 text-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, #77C3FF 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E8E0FF 0%, transparent 50%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat',
                    }}
                  />
                  <div className="relative z-10">
                    <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-10">
                      {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className="text-[24px] md:text-[28px] font-bold text-white tracking-[-0.5px]">
                            {stat.value}
                          </p>
                          <p className="text-[11px] text-white/50 font-medium mt-1">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-bold text-white tracking-[-0.03em] leading-[1.15] mb-4">
                      Ready to Make It Official?
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto text-[17px]">
                      Form your US LLC today and unlock marketplace approvals, payment gateways, and a real US business identity.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                      <a
                        href="https://legalnations.com/usdrop-elite"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="button-get-llc-cta"
                        className="block"
                      >
                        <div className="bg-transparent h-[52px] overflow-clip rounded-[10px] w-[220px] relative">
                          <div
                            className="absolute inset-0 cursor-pointer"
                            style={{ backgroundImage: "linear-gradient(165.12deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%)" }}
                          />
                          <div
                            className="absolute h-[48px] left-1/2 rounded-[8px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[216px] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2 px-6"
                            style={{ background: "rgba(255,255,255,0.95)" }}
                          >
                            <span className="text-[15px] text-[#323140] font-bold">Get Elite Package</span>
                            <ArrowRight className="h-4 w-4 text-[#323140]" />
                          </div>
                        </div>
                      </a>
                      <p className="text-[13px] text-[#666]">
                        Use code <span className="font-mono font-bold text-white">{DISCOUNT_CODE}</span> for 30% off
                      </p>
                    </div>
                  </div>
                </div>
              </MotionFadeIn>
            </div>
          </section>

          <div className="pb-8" />
        </div>
      </div>
    </div>
  )
}
