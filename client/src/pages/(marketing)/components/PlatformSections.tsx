import { Link } from "wouter"
import {
  GraduationCap, Compass, TrendingUp, Sparkles, Building2, Truck, Palette, Store,
  ArrowRight, Check, PackageCheck, Boxes, CreditCard, Globe,
} from "lucide-react"

/* On-brand landing sections (light theme, Inter Display, blue gradient accents)
   that tell the all-in-one USDrop story: ecosystem → how it works → spotlights. */

const PILLARS = [
  { icon: GraduationCap, title: "Free Learning", desc: "Master USA dropshipping from zero, free." },
  { icon: Compass, title: "1:1 Mentorship", desc: "A proven framework + expert guidance." },
  { icon: TrendingUp, title: "Winning Products", desc: "AI-validated products that actually sell." },
  { icon: Sparkles, title: "Build Your Store", desc: "A done-for-you Shopify store in minutes." },
  { icon: Building2, title: "US LLC", desc: "Form your US company — done for you." },
  { icon: Truck, title: "Fulfillment", desc: "We ship from our China warehouse." },
  { icon: Palette, title: "AI Studio", desc: "Generate ads, copy & creatives with AI." },
  { icon: Store, title: "Marketplaces", desc: "Sell on Amazon, Walmart, TikTok Shop." },
]

const STEPS = [
  { n: 1, icon: GraduationCap, title: "Learn the game", desc: "Start free — learn product research, store setup and ads from an industry expert." },
  { n: 2, icon: Building2, title: "Get your US company", desc: "We form your US LLC and build you a conversion-ready Shopify store." },
  { n: 3, icon: Boxes, title: "Stock winning products", desc: "Add AI-validated winning products to your store in one click." },
  { n: 4, icon: Truck, title: "We fulfill, you scale", desc: "Orders ship from our China warehouse with real tracking while you grow." },
]

const SPOTLIGHTS = [
  {
    kicker: "Find products that sell",
    title: "Stop guessing. Sell what's proven.",
    desc: "Browse AI-validated winning products with real demand signals, profit math and competitor insight — then push to your store instantly.",
    points: ["AI product validator & score", "Real trend & demand data", "One-click add to your store"],
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)",
    chips: [TrendingUp, PackageCheck, Boxes],
  },
  {
    kicker: "Your company, done for you",
    title: "A real US business — without the hassle.",
    desc: "Form your US LLC, get an EIN, open a US bank account and accept Stripe & PayPal. Plus a built-for-conversion Shopify store, ready to sell.",
    points: ["US LLC + EIN + BOI compliance", "US bank + Stripe & PayPal", "Done-for-you Shopify store"],
    icon: Building2,
    gradient: "linear-gradient(135deg, #064e3b 0%, #047857 55%, #0d9e5f 100%)",
    chips: [Building2, CreditCard, Sparkles],
  },
  {
    kicker: "Fulfillment, handled",
    title: "We ship from our China warehouse.",
    desc: "When orders land in your store, our team sources, quality-checks, packs and ships them on a fast line with real tracking — no inventory, no headaches.",
    points: ["Sourcing + quality control", "Branded, fast shipping", "Real end-to-end tracking"],
    icon: Truck,
    gradient: "linear-gradient(135deg, #3730a3 0%, #6366f1 55%, #818cf8 100%)",
    chips: [Truck, Globe, PackageCheck],
  },
]

function SectionHeading({ kicker, title, accent, subtitle }: { kicker: string; title: string; accent?: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[12px] font-semibold uppercase tracking-wider mb-4">{kicker}</div>
      <h2 className="text-[30px] sm:text-[40px] text-black tracking-[-1.4px] font-medium leading-[1.15]">
        {title} {accent && <span className="font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{accent}</span>}
      </h2>
      <p className="text-[#555555] text-[15px] sm:text-[16px] mt-3 leading-relaxed">{subtitle}</p>
    </div>
  )
}

function EcosystemSection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading kicker="The whole stack" title="Everything you need," accent="in one platform." subtitle="USDrop replaces a dozen tools and services with one guided platform — from your first lesson to a fully-fulfilled US business." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-black/[0.06] bg-white/70 backdrop-blur-sm p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-blue-200 transition-all">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4"><p.icon className="h-5 w-5" /></div>
              <h3 className="text-[16px] font-semibold text-black">{p.title}</h3>
              <p className="text-[13.5px] text-[#666] mt-1 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading kicker="How it works" title="From zero to" accent="scaling — in 4 steps." subtitle="A guided path with our team behind you the whole way." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-black/[0.06] bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600"><s.icon className="h-5 w-5" /></div>
                <span className="text-[40px] font-bold text-black/[0.06] leading-none">{s.n}</span>
              </div>
              <h3 className="text-[16px] font-semibold text-black">{s.title}</h3>
              <p className="text-[13.5px] text-[#666] mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Spotlights() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {SPOTLIGHTS.map((s, i) => (
          <div key={s.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
            <div className="lg:[direction:ltr]">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[12px] font-semibold uppercase tracking-wider mb-4">{s.kicker}</div>
              <h3 className="text-[26px] sm:text-[32px] text-black tracking-[-1px] font-medium leading-[1.15]">{s.title}</h3>
              <p className="text-[#555555] text-[15px] mt-3 leading-relaxed">{s.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {s.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 shrink-0"><Check className="h-3 w-3 text-blue-600" /></span>
                    <span className="text-[14px] text-[#333]">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:[direction:ltr]">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center" style={{ background: s.gradient }}>
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }} />
                <div className="relative flex items-center gap-4">
                  {s.chips.map((Chip, ci) => (
                    <div key={ci} className={`flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 ${ci === 1 ? "w-20 h-20" : "w-14 h-14"}`}>
                      <Chip className={ci === 1 ? "h-9 w-9 text-white" : "h-6 w-6 text-white/80"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PlatformSections() {
  return (
    <>
      <EcosystemSection />
      <Spotlights />
      <HowItWorksSection />
    </>
  )
}
