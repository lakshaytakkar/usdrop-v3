import { useState, useEffect, useRef } from "react"
import { MarketingLayout } from "@/layouts/MarketingLayout"
import { Link } from "wouter"
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star,
  X,
} from "lucide-react"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 2000
          const step = (timestamp: number) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            setCount(Math.floor(progress * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <div ref={ref} className="text-[36px] md:text-[44px] font-bold text-black tracking-[-1px]">{count}{suffix}</div>
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-black/[0.06] rounded-[14px] overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-[#FAFAFA] transition-colors"
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="text-[15px] font-semibold text-black pr-4">{question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-[#999] shrink-0" /> : <ChevronDown className="h-5 w-5 text-[#999] shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-[14px] text-[#666] leading-[1.6]">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function MentorshipPage() {
  return (
    <MarketingLayout>
      <div className="pt-24">
        <HeroSection />
        <StatsBar />
        <PainPointsSection />
        <BenefitsSection />
        <ComparisonSection />
        <TestimonialsSection />
        <BonusesSection />
        <FAQSection />
        <FinalCTASection />
      </div>
    </MarketingLayout>
  )
}

function HeroSection() {
  return (
    <section
      className="pt-[80px] md:pt-[100px] pb-16 md:pb-20 px-4 relative"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(195,170,255,0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(180,215,255,0.10) 0%, transparent 55%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 mb-8 shadow-sm" data-testid="badge-mentorship">
          <span className="text-[13px] font-semibold text-[#323140] uppercase tracking-[0.06em]">1-on-1 Dropshipping Mentorship</span>
        </div>

        <h1 className="text-[40px] md:text-[52px] lg:text-[64px] font-bold text-black leading-[1.08] tracking-[-1.5px] md:tracking-[-2px] mb-6">
          We Research, Source & Launch{" "}
          <span className="relative inline-block">
            <span className="text-[#4F46E5]">Your Store</span>
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
              <path d="M2 6C40 2 80 2 100 4C120 6 160 3 198 5" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>

        <p className="text-[17px] md:text-[19px] text-[#666] max-w-xl mx-auto mb-10 leading-[1.5]">
          Skip years of trial-and-error. Get personal guidance from experts who handle the hard parts so you build a profitable brand.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#final-cta"
            data-testid="button-hero-cta"
            className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
            onClick={(e) => { e.preventDefault(); document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            Book Your Free Strategy Call
            <ArrowRight className="size-4" />
          </a>
          <p className="text-[13px] text-[#999]">No commitment required</p>
        </div>

        <div className="mt-14 relative mx-auto max-w-3xl">
          <div className="rounded-[20px] overflow-hidden shadow-2xl shadow-black/10 border border-black/[0.04]">
            <img
              src="/images/mentorship/hero-workspace.png"
              alt="Dropshipping mentorship workspace"
              className="w-full"
              decoding="async"
              data-testid="img-hero"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { value: 150, suffix: "+", label: "Entrepreneurs Mentored" },
    { value: 500, suffix: "+", label: "Products Researched" },
    { value: 8, suffix: " Weeks", label: "Avg. Time to Launch" },
    { value: 500, suffix: "K+", label: "Revenue Generated" },
  ]

  return (
    <section className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-[13px] text-[#999] font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PainPointsSection() {
  const pains = [
    {
      emoji: "😩",
      label: "The Problem",
      title: "Overwhelmed by where to even start?",
      description: "No clear roadmap, endless YouTube videos, and conflicting advice leave you stuck in analysis paralysis.",
    },
    {
      emoji: "🎲",
      label: "The Risk",
      title: "Wasting money on the wrong products?",
      description: "Trial-and-error product research burns through your budget before you ever make a sale.",
    },
    {
      emoji: "💸",
      label: "The Gap",
      title: "Can't find reliable suppliers?",
      description: "Scam suppliers, poor product quality, and slow shipping kill your store's reputation before it starts.",
    },
  ]

  return (
    <section className="py-20 lg:py-28 px-4" data-testid="section-pain-points">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
            Sound familiar?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pains.map((point, i) => (
            <div
              key={i}
              className="bg-[#FAFAFA] border border-black/[0.04] rounded-[16px] p-8"
              data-testid={`card-pain-${i}`}
            >
              <div className="text-[32px] mb-4">{point.emoji}</div>
              <p className="text-[11px] font-bold text-[#999] uppercase tracking-[0.12em] mb-3">
                {point.label}
              </p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-black tracking-[-0.4px] leading-[1.2] mb-3">
                {point.title}
              </h3>
              <p className="text-[15px] text-[#666] leading-[1.5]">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#final-cta"
            data-testid="button-pain-cta"
            className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
            onClick={(e) => { e.preventDefault(); document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            Get Expert Help Instead
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const benefits = [
    {
      title: "We Find Winning Products for You",
      description: "Our team identifies high-demand, low-competition products using advanced research tools and real market data. You start with a proven edge — no guesswork involved.",
      image: "/images/mentorship/benefit-research.png",
    },
    {
      title: "Vetted Suppliers, Better Margins",
      description: "We connect you with trusted, verified suppliers who deliver quality products at competitive prices. Save 15-20% compared to sourcing on your own.",
      image: "/images/mentorship/benefit-sourcing.png",
    },
    {
      title: "Your Store, Built to Convert",
      description: "From listing optimization to storefront design, we set up your Shopify store using proven frameworks that turn browsers into buyers.",
      image: "/images/mentorship/benefit-store.png",
    },
    {
      title: "Ad Strategy That Delivers ROI",
      description: "Get hands-on guidance with Meta ads, audience targeting, and creative strategy. Launch campaigns that generate real returns from day one.",
      image: "/images/mentorship/benefit-ads.png",
    },
  ]

  return (
    <section className="py-20 lg:py-28 px-4" data-testid="section-benefits">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
            What we do for you
          </h2>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {benefits.map((benefit, i) => {
            const isReversed = i % 2 === 1
            return (
              <div
                key={i}
                className={`flex flex-col gap-10 lg:gap-16 items-center ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
                data-testid={`card-benefit-${i}`}
              >
                <div className="w-full lg:w-[55%] flex-shrink-0">
                  <div className="rounded-[20px] overflow-hidden bg-[#F8F8FA] border border-black/[0.04] aspect-[4/3]">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover"
                      decoding="async"
                      data-testid={`img-benefit-${i}`}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-[45%]">
                  <h3 className="text-[28px] lg:text-[36px] font-bold text-black tracking-[-0.8px] lg:tracking-[-1.2px] leading-[1.15] mb-5">
                    {benefit.title}
                  </h3>
                  <p className="text-[16px] lg:text-[17px] text-[#555] leading-[1.6] mb-6">
                    {benefit.description}
                  </p>
                  <a
                    href="#final-cta"
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-black hover:text-[#4F46E5] transition-colors uppercase tracking-[0.04em]"
                    onClick={(e) => { e.preventDefault(); document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' }) }}
                  >
                    Get Started
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  const comparisons = [
    { label: "Getting Started", diy: "No roadmap, wasted months guessing", mentored: "Step-by-step guidance from day one" },
    { label: "Product Research", diy: "Struggling to find profitable products", mentored: "Winning products identified by experts" },
    { label: "Supplier Access", diy: "Overspending, no trusted contacts", mentored: "Save 15-20% with verified suppliers" },
    { label: "Time to Launch", diy: "Trial-and-error takes 6-12 months", mentored: "Launch in under 8 weeks" },
    { label: "Product Quality", diy: "Risk of scams and low-quality items", mentored: "Products verified before shipping" },
    { label: "Ad Strategy", diy: "Burning money on untested campaigns", mentored: "Proven ad frameworks for real ROI" },
  ]

  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
            DIY vs. Expert Mentorship
          </h2>
        </div>

        <div className="bg-white rounded-[20px] border border-black/[0.06] shadow-lg overflow-hidden">
          <div className="grid grid-cols-3">
            <div className="p-4 md:p-5 bg-[#FAFAFA] border-b border-black/[0.06]" />
            <div className="p-4 md:p-5 bg-[#FAFAFA] border-b border-x border-black/[0.06] text-center">
              <span className="text-[12px] font-bold text-red-500 uppercase tracking-[0.08em]">Doing It Yourself</span>
            </div>
            <div className="p-4 md:p-5 bg-[#FAFAFA] border-b border-black/[0.06] text-center">
              <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-[0.08em]">With Mentorship</span>
            </div>
          </div>

          {comparisons.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 ${i < comparisons.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
              <div className="p-4 md:p-5 flex items-center">
                <span className="text-[13px] font-semibold text-black">{row.label}</span>
              </div>
              <div className="p-4 md:p-5 border-x border-black/[0.04] flex items-start gap-2">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#666]">{row.diy}</span>
              </div>
              <div className="p-4 md:p-5 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#333] font-medium">{row.mentored}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#final-cta"
            data-testid="button-comparison-cta"
            className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
            onClick={(e) => { e.preventDefault(); document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            Skip the Struggle
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const stories = [
    {
      name: "Rahul K.",
      role: "Store Owner",
      quote: "Went from zero to consistent daily sales within 3 months. The product research alone saved me months of guesswork.",
      revenue: "$25K+",
    },
    {
      name: "Priya M.",
      role: "E-commerce Entrepreneur",
      quote: "The ad strategy guidance was exactly what I needed. My ROAS went from 0.8 to 3.2 in just six weeks.",
      revenue: "$40K+",
    },
    {
      name: "Arjun S.",
      role: "Full-Time Dropshipper",
      quote: "I was stuck losing money on bad products. The mentorship helped me find winners and scale profitably.",
      revenue: "$60K+",
    },
  ]

  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1] mb-3">
            Real results from real mentees
          </h2>
          <p className="text-[17px] text-[#666]">$500K+ combined revenue generated</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <div key={i} className="bg-white rounded-[16px] border border-black/[0.06] p-6" data-testid={`card-testimonial-${i}`}>
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-[15px] text-[#555] leading-[1.6] mb-6">"{story.quote}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-black/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-black">{story.name}</p>
                    <p className="text-[12px] text-[#999]">{story.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-bold text-[#4F46E5]">{story.revenue}</p>
                  <p className="text-[11px] text-[#999]">Revenue</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BonusesSection() {
  const bonuses = [
    { title: "Full USDrop Academy Access", value: "$997" },
    { title: "AI Toolkit Suite", value: "$499" },
    { title: "Private Community Access", value: "$297" },
    { title: "Priority Support Channel", value: "$199" },
  ]

  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1] mb-3">
            Included free with your mentorship
          </h2>
          <p className="text-[17px] text-[#666]">Over $1,990 in bonuses</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {bonuses.map((bonus, i) => (
            <div key={i} className="flex items-center justify-between bg-[#FAFAFA] border border-black/[0.04] rounded-[14px] p-5" data-testid={`card-bonus-${i}`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-[15px] font-semibold text-black">{bonus.title}</span>
              </div>
              <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {bonus.value}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#final-cta"
            data-testid="button-bonus-cta"
            className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
            onClick={(e) => { e.preventDefault(); document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            Claim Your Spot + All Bonuses
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: "What exactly is included in the mentorship?",
      a: "Product research, supplier sourcing, store setup guidance, ad strategy, and ongoing 1-on-1 support. Plus full access to USDrop's platform tools and Academy.",
    },
    {
      q: "How long until I can launch my store?",
      a: "Most mentees launch within 6-8 weeks. This includes product research, supplier verification, store building, and ad setup.",
    },
    {
      q: "Do I need prior experience?",
      a: "No. We start from fundamentals and build up to advanced strategies. The program is designed for both beginners and intermediates.",
    },
    {
      q: "How much time do I need per week?",
      a: "8-10 hours during setup. Once live, you can manage in 2-3 hours per day.",
    },
    {
      q: "Can I do this alongside my full-time job?",
      a: "Absolutely. Most of our successful mentees started as a side hustle. The program is designed to be flexible.",
    },
    {
      q: "Is there ongoing support after launch?",
      a: "Yes — continued community access, platform tools, and follow-up calls. We're invested in your long-term success.",
    },
  ]

  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
            Questions? We've got answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTASection() {
  return (
    <section id="final-cta" className="py-20 lg:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-[24px] overflow-hidden">
          <img
            src="/images/mentorship/success-results.png"
            alt="Dropshipping success"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />

          <div className="relative z-10 p-10 md:p-16 text-center">
            <h2 className="text-[32px] md:text-[44px] font-bold text-white tracking-[-1.2px] leading-[1.1] mb-4">
              Ready to launch your store?
            </h2>
            <p className="text-[17px] text-white/70 max-w-lg mx-auto mb-8 leading-[1.5]">
              Book a free strategy call. No commitment, no pressure — just a clear plan for your dropshipping business.
            </p>

            <a
              href="#final-cta"
              data-testid="button-final-cta-book"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-100 text-black font-bold px-10 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
            >
              Book Your Free Strategy Call
              <ArrowRight className="size-4" />
            </a>

            <div className="flex items-center justify-center gap-6 text-white/50 text-[13px] mt-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>No commitment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>100% free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Limited spots</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-[13px] text-[#999]">
            Have questions? Reach out at{" "}
            <a href="mailto:support@usdrop.com" className="text-[#4F46E5] font-semibold hover:underline">support@usdrop.com</a>
          </p>
        </div>
      </div>
    </section>
  )
}
