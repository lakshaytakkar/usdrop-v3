import { useState, useEffect, useRef } from "react"
import { MarketingLayout } from "@/layouts/MarketingLayout"
import { Button } from "@/components/ui/button"
import {
  Play,
  ArrowRight,
  CheckCircle2,
  X,
  Users,
  TrendingUp,
  Package,
  ShoppingCart,
  Search,
  BarChart3,
  Zap,
  HeadphonesIcon,
  Target,
  ShieldCheck,
  Clock,
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Rocket,
  BookOpen,
  MessageCircle,
  Award,
  Globe,
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

  return <div ref={ref} className="text-4xl md:text-5xl font-black text-indigo-600">{count}{suffix}</div>
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="text-[15px] font-semibold text-gray-900 pr-4">{question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-[14px] text-gray-600 leading-relaxed">{answer}</p>
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
        <SuccessStoriesSection />
        <StepByStepSection />
        <WhoIsThisForSection />
        <JourneySection />
        <ComparisonSection />
        <WhyDeliversSection />
        <MeetMentorSection />
        <BonusesSection />
        <FAQSection />
        <FinalCTASection />
      </div>
    </MarketingLayout>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6">
            <span className="text-amber-600 text-sm font-semibold">Limited Spots Available</span>
            <span className="text-sm text-amber-700">|</span>
            <span className="text-sm text-gray-600">Exclusive 1-on-1 Dropshipping Mentorship</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
            We Help You Research, Source & Launch a{" "}
            <span className="relative inline-block">
              <span className="text-indigo-600">Profitable Dropshipping</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8C50 3 100 2 150 5C200 8 250 4 298 7" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>{" "}
            Business
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get personal guidance from Mr. Supran and his expert team. We handle the hard parts so you can focus on building a sustainable and profitable brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 rounded-xl text-base font-bold shadow-lg shadow-indigo-200"
              data-testid="button-hero-book-call"
              onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Free Strategy Call
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-xl text-base font-bold border-gray-300 bg-white/80"
              data-testid="button-hero-learn-more"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="h-5 w-5 mr-2 text-indigo-600" />
              See How It Works
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/50 border border-white/50">
              <img
                src="/images/mentorship/mentorship-session.png"
                alt="1-on-1 Mentorship Session"
                className="w-full h-auto"
                data-testid="img-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { value: 500, suffix: "+", label: "Products Researched" },
    { value: 200, suffix: "+", label: "Products Sourced" },
    { value: 10000, suffix: "+", label: "Orders Fulfilled" },
    { value: 150, suffix: "+", label: "Entrepreneurs Mentored" },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PainPointsSection() {
  const pains = [
    {
      title: "You Have No Clue",
      subtitle: "about how to start a dropshipping business?",
      image: "/images/mentorship/pain-confused.png",
      icon: Search,
    },
    {
      title: "You Struggle",
      subtitle: "to find profitable products and reliable suppliers.",
      image: "/images/mentorship/pain-struggling.png",
      icon: TrendingUp,
    },
    {
      title: "You're Underconfident",
      subtitle: "about scaling your store and running ads profitably.",
      image: "/images/mentorship/pain-underconfident.png",
      icon: Target,
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            You Want to Start and Run a
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900">
            Successful Dropshipping Business But...
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((pain, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={pain.image} alt={pain.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <pain.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{pain.title}</h4>
                </div>
                <p className="text-gray-600 text-[15px] leading-relaxed">{pain.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-indigo-50/80 rounded-2xl p-8 max-w-3xl mx-auto border border-indigo-100">
            <p className="text-lg md:text-xl text-gray-800 font-semibold leading-relaxed">
              No matter if you are a beginner or intermediate, we have got you covered! With our step-by-step{" "}
              <span className="text-indigo-600 font-bold">1:1 Dropshipping Mentorship Program</span>
            </p>
            <Button
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-xl font-bold"
              data-testid="button-pain-cta"
              onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Free Strategy Call
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function SuccessStoriesSection() {
  const stories = [
    {
      name: "Rahul K.",
      role: "Dropshipping Store Owner",
      quote: "Mr. Supran's mentorship transformed my approach to product sourcing. I went from zero to consistent daily sales within 3 months.",
      revenue: "$25K+",
      months: "4",
    },
    {
      name: "Priya M.",
      role: "E-commerce Entrepreneur",
      quote: "The 1-on-1 guidance on ad strategy and supplier management was exactly what I needed. Skip the trial-and-error and learn from experts.",
      revenue: "$40K+",
      months: "6",
    },
    {
      name: "Arjun S.",
      role: "Side Hustle to Full-Time",
      quote: "I was stuck with bad products and losing money on ads. The mentorship helped me find winning products and scale profitably.",
      revenue: "$60K+",
      months: "8",
    },
    {
      name: "Sneha D.",
      role: "Brand Builder",
      quote: "Outstanding supplier connections and branding strategies. My store now has repeat customers and a strong brand identity.",
      revenue: "$35K+",
      months: "5",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Our Mentees Have Already
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-indigo-600">
            Generated $500K+ in Combined Revenue
          </h3>
          <p className="text-gray-600 mt-3 text-lg">With our guidance and hands-on support</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {story.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{story.name}</h4>
                  <p className="text-sm text-indigo-600 font-medium">{story.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-4 italic">"{story.quote}"</p>
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Revenue</p>
                  <p className="text-xl font-bold text-indigo-600">{story.revenue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Time to Results</p>
                  <p className="text-xl font-bold text-gray-900">{story.months} months</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StepByStepSection() {
  const steps = [
    {
      icon: Search,
      title: "We Find Winning Products for You",
      desc: "Our team of experts identifies high-demand, low-competition products using advanced research tools and real market data, so you start with a proven edge.",
    },
    {
      icon: ShieldCheck,
      title: "We Connect You with Trusted Suppliers",
      desc: "We source products from vetted, reliable suppliers with proven track records, ensuring quality, competitive pricing, and dependable fulfillment.",
    },
    {
      icon: ShoppingCart,
      title: "We Build Listings That Convert",
      desc: "Tried and tested methods to create product listings that attract buyers, increase conversion rates, and ultimately dominate your niche.",
    },
    {
      icon: Star,
      title: "Build Trust with Social Proof",
      desc: "Expert guidance on earning positive reviews, building customer trust, and establishing your brand as a credible player in the market.",
    },
    {
      icon: BarChart3,
      title: "Rank Higher, Sell More",
      desc: "Proven ad strategies and SEO techniques to drive targeted traffic to your store and maximize your return on ad spend.",
    },
    {
      icon: Zap,
      title: "Business Operations Made Easy",
      desc: "We help you automate manual tasks and handle 90% of the setup work before launch, ensuring smoother day-to-day operations.",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Step-By-Step Guide To Launching a
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900">
            Successful Dropshipping Business
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Step {i + 1}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhoIsThisForSection() {
  const personas = [
    {
      icon: Users,
      title: "Working Professional",
      desc: "Looking for a proven side hustle that generates real passive income without quitting your job.",
    },
    {
      icon: BookOpen,
      title: "Student / Freelancer",
      desc: "Ready to invest time and effort into building a legitimate online business alongside your studies or freelance work.",
    },
    {
      icon: TrendingUp,
      title: "Business Owner",
      desc: "Looking to add a profitable e-commerce revenue stream to your existing portfolio of businesses.",
    },
    {
      icon: Rocket,
      title: "Aspiring Entrepreneur",
      desc: "You have the dedication and willingness to learn, and you want to launch a dropshipping business the right way.",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            This Mentorship Program is for You If You Are a...
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <p.icon className="h-7 w-7 text-indigo-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-xl font-bold"
            data-testid="button-who-cta"
            onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Your Free Strategy Call
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function JourneySection() {
  const phases = [
    {
      icon: MessageCircle,
      title: "Onboarding Call",
      desc: "Kick off with a 1-on-1 call to define your goals, budget, and expectations. We craft a personalized game plan aligned with your vision.",
    },
    {
      icon: Search,
      title: "Product Research",
      desc: "Mr. Supran and team identify profitable, market-ready products tailored to your niche, budget, and goals using proprietary research tools.",
    },
    {
      icon: BookOpen,
      title: "Training & Education",
      desc: "Access exclusive video courses and live sessions covering every aspect of dropshipping, followed by 1-on-1 doubt-clearing with your mentor.",
    },
    {
      icon: Package,
      title: "Supplier Sourcing & Verification",
      desc: "We connect you with vetted suppliers, negotiate pricing, and verify product quality before you commit a single dollar.",
    },
    {
      icon: Rocket,
      title: "Store Launch Assistance",
      desc: "Before products go live, we complete 90% of the pre-launch work: store setup, listing optimization, ad creatives, and funnel design.",
    },
    {
      icon: HeadphonesIcon,
      title: "Ongoing Support & Growth",
      desc: "Continuous guidance on ad campaigns, scaling strategies, and optimization. Backed by live chat and a dedicated mentor throughout your journey.",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Your Journey to Dropshipping Success
          </h2>
          <p className="text-gray-600 mt-3 text-lg">A clear roadmap from zero to profitable store</p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-200 hidden md:block" />

          <div className="space-y-8">
            {phases.map((phase, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className={`flex-1 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-md ${i % 2 === 1 ? "md:ml-auto" : ""}`}>
                    <div className={`flex items-center gap-3 mb-3 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                        <phase.icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Phase {i + 1}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{phase.title}</h4>
                    <p className="text-[14px] text-gray-600 leading-relaxed">{phase.desc}</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-sm z-10 shrink-0 shadow-lg shadow-indigo-200">
                  {i + 1}
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  const comparisons = [
    { label: "Getting Started", diy: "No clear roadmap, wasted months guessing", mentored: "1-on-1 step-by-step guidance from day one" },
    { label: "Problem Solving", diy: "Relying on YouTube and forums, more confusion", mentored: "Live support team and expert assistance on tap" },
    { label: "Time to Launch", diy: "Trial-and-error takes 6-12 months", mentored: "Expert guidance ensures launch in under 8 weeks" },
    { label: "Product Research", diy: "Struggle to find profitable products", mentored: "Winning products identified by expert research" },
    { label: "Supplier Access", diy: "Overspending on products, no trusted contacts", mentored: "Save 15-20% with verified supplier partnerships" },
    { label: "Product Quality", diy: "Risk of low-quality or mismatched products", mentored: "Products verified by experts before shipping" },
    { label: "Fraud & Scam Risk", diy: "High chances of scams and wasted money", mentored: "Trusted suppliers ensure zero fraud risk" },
    { label: "Motivation", diy: "Uncertainty leads to loss of motivation", mentored: "Clear roadmap and fast-tracked business setup" },
    { label: "Knowledge", diy: "Limited understanding, learning from mistakes", mentored: "Full access to premium courses and live training" },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Why Do You Need Mentorship?
          </h2>
          <p className="text-gray-600 mt-3 text-lg">The difference between struggling alone and having expert guidance</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="p-4 text-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Category</span>
            </div>
            <div className="p-4 text-center border-x border-gray-200">
              <span className="text-sm font-bold text-red-500 uppercase tracking-wide">Doing It Yourself</span>
            </div>
            <div className="p-4 text-center">
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">With Our Mentorship</span>
            </div>
          </div>

          {comparisons.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 ${i < comparisons.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="p-4 flex items-center">
                <span className="text-sm font-semibold text-gray-900">{row.label}</span>
              </div>
              <div className="p-4 border-x border-gray-100 flex items-start gap-2">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{row.diy}</span>
              </div>
              <div className="p-4 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">{row.mentored}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyDeliversSection() {
  const reasons = [
    {
      icon: Award,
      title: "Dedicated Dropshipping Expert",
      desc: "Get a personal mentor who handles product research, supplier vetting, and store optimization, so you never feel lost or overwhelmed.",
    },
    {
      icon: Search,
      title: "Product Research & Sourcing Help",
      desc: "The mentorship includes hands-on research to find highly profitable products and direct assistance with the sourcing and supplier verification process.",
    },
    {
      icon: Globe,
      title: "Access to USDrop Platform Tools",
      desc: "Get full access to USDrop's AI-powered product research, competitor analysis, and ad creation tools throughout your mentorship journey.",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Why Does Our Mentorship Deliver Results?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 p-8 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                <r.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{r.title}</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MeetMentorSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Meet Your Mentor
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <img
                src="/images/mentorship/mentor-portrait.png"
                alt="Mr. Supran - Your Dropshipping Mentor"
                className="w-full h-full object-cover min-h-[400px]"
                data-testid="img-mentor-portrait"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:block hidden" />
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Mr. Supran</h3>
              <p className="text-indigo-600 font-semibold text-lg mb-6">Dropshipping Expert & Business Mentor</p>

              <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
                <p>
                  With years of hands-on experience in e-commerce and dropshipping, Mr. Supran has built and scaled multiple profitable online stores from scratch. His journey began with trial and error, facing failures and losses before mastering product research, supplier management, and ad optimization.
                </p>
                <p>
                  As a mentor, he has trained over 150 entrepreneurs, helping them launch and scale their dropshipping businesses. His practical, no-fluff approach focuses on what actually works in today's competitive market.
                </p>
                <p className="font-semibold text-gray-800">
                  Devoted to empowering the next generation of e-commerce entrepreneurs, he continues to guide aspiring sellers toward building sustainable, profitable businesses.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-black text-indigo-600">150+</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Entrepreneurs Mentored</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-indigo-600">500+</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Products Researched</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-indigo-600">$500K+</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Revenue Generated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BonusesSection() {
  const bonuses = [
    {
      icon: BookOpen,
      title: "Full USDrop Academy Access",
      desc: "Get lifetime access to all premium courses covering product research, ad strategies, store optimization, and scaling techniques.",
      value: "$997",
    },
    {
      icon: Lightbulb,
      title: "AI Toolkit Suite",
      desc: "Full access to USDrop's AI-powered tools including product research engine, ad copy generator, competitor analyzer, and more.",
      value: "$499",
    },
    {
      icon: Users,
      title: "Private Community Access",
      desc: "Join an exclusive community of mentees and successful dropshippers for networking, deal sharing, and peer support.",
      value: "$297",
    },
    {
      icon: HeadphonesIcon,
      title: "Priority Support Channel",
      desc: "Get direct access to our support team with priority response times for any questions or issues that arise.",
      value: "$199",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Unlock Exclusive Bonuses
          </h2>
          <p className="text-xl text-indigo-600 font-bold">Worth Over $1,990 - Included Free</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {bonuses.map((bonus, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Value: {bonus.value}
                </span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <bonus.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 pr-20">{bonus.title}</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed">{bonus.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-10 rounded-xl text-base font-bold shadow-lg shadow-indigo-200"
            data-testid="button-bonus-cta"
            onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Claim Your Spot + All Bonuses
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: "What exactly is included in the 1-on-1 Mentorship?",
      a: "The mentorship includes personalized product research, supplier sourcing assistance, store setup guidance, ad strategy development, and ongoing 1-on-1 support from Mr. Supran and his team. You also get full access to USDrop's platform tools and the Academy.",
    },
    {
      q: "How long does it take to launch my store?",
      a: "With our structured approach, most mentees have their store fully set up and ready to launch within 6-8 weeks. This includes product research, supplier verification, store building, and ad setup.",
    },
    {
      q: "Do I need any prior experience in dropshipping or e-commerce?",
      a: "No prior experience is needed. Our mentorship is designed for beginners and intermediates alike. We start from the fundamentals and build up to advanced strategies, ensuring you have a solid foundation.",
    },
    {
      q: "How much time do I need to dedicate per week?",
      a: "We recommend dedicating at least 8-10 hours per week during the initial setup phase. Once your store is live and running, you can manage it in as little as 2-3 hours per day.",
    },
    {
      q: "What kind of results can I expect?",
      a: "Results vary based on effort, niche, and market conditions. However, our mentees typically start seeing their first sales within 2-4 weeks of launch, with many reaching consistent profitability within 3-6 months.",
    },
    {
      q: "Can I do this alongside my full-time job?",
      a: "Absolutely. Many of our successful mentees started their dropshipping business as a side hustle while working full-time. The mentorship is designed to be flexible and work around your schedule.",
    },
    {
      q: "What platforms do you support?",
      a: "We primarily focus on Shopify-based dropshipping stores, with guidance on selling through multiple channels including social media marketplaces. Our supplier network supports worldwide fulfillment.",
    },
    {
      q: "Is there ongoing support after the initial mentorship period?",
      a: "Yes. You get continued access to our community, platform tools, and can schedule follow-up calls. We're invested in your long-term success, not just the initial launch.",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-3 text-lg">Everything you need to know before getting started</p>
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
    <section id="final-cta" className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 md:p-14 text-center shadow-2xl shadow-indigo-300/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Ready to Launch Your Profitable Dropshipping Business?
            </h2>
            <p className="text-indigo-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Let us handle the research, sourcing, and strategy so you can focus on building a sustainable and profitable brand. Your journey starts with a free strategy call.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-indigo-50 h-14 px-10 rounded-xl text-base font-bold shadow-lg"
                data-testid="button-final-cta-book"
              >
                Book Your Free Strategy Call
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-indigo-200 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>100% free consultation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Limited spots available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Have questions? Reach out to us at{" "}
            <a href="mailto:support@usdrop.com" className="text-indigo-600 font-semibold hover:underline">support@usdrop.com</a>
          </p>
        </div>
      </div>
    </section>
  )
}