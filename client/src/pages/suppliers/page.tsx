
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  CheckCircle2,
  Star,
  Shield,
  Award,
  Truck,
  Package,
  Clock,
  Globe,
  Mail,
  Play,
  X,
  Zap,
  HeadphonesIcon,
  MapPin,
  ArrowRight,
} from "lucide-react"

const stats = [
  { value: "5.0", label: "Supplier Rating", icon: Star },
  { value: "1,250+", label: "Orders Fulfilled", icon: Package },
  { value: "$0", label: "Minimum Order", icon: Zap },
  { value: "6-8 Days", label: "USA Delivery", icon: Truck },
]

const steps = [
  {
    step: "01",
    title: "Browse & Pick Products",
    description: "Explore our curated catalog. Find winning products with proven demand and competitive margins.",
  },
  {
    step: "02",
    title: "We Source & Stock for You",
    description: "Our warehouse in Dongguan, China holds inventory ready to ship. No bulk purchasing needed.",
  },
  {
    step: "03",
    title: "Customer Places an Order",
    description: "When your customer orders, it syncs automatically to our fulfillment system within minutes.",
  },
  {
    step: "04",
    title: "Professional Packing & Labeling",
    description: "Each order is carefully packed with your branding. Custom labels and inserts available.",
  },
  {
    step: "05",
    title: "Fast Shipping via USDrop Express",
    description: "Orders dispatched within 1 business day. Delivered to USA customers in 6-8 days with full tracking.",
  },
  {
    step: "06",
    title: "Automatic Tracking Updates",
    description: "Your customers receive real-time tracking. No manual work — everything is automated.",
  },
]

const features = [
  {
    icon: Shield,
    title: "Verified & Trusted",
    description: "Fully vetted supplier with 5-star rating and 1,250+ successful orders.",
  },
  {
    icon: Clock,
    title: "1-Day Processing",
    description: "Orders processed and dispatched within 1 business day.",
  },
  {
    icon: Globe,
    title: "USA Express Delivery",
    description: "Dedicated USDrop Express Line delivers in just 6-8 days.",
  },
  {
    icon: Zap,
    title: "Zero Minimum Order",
    description: "Order one piece or a thousand — no minimums required.",
  },
  {
    icon: Award,
    title: "Whitelabel Ready",
    description: "Custom branding and packaging so products ship under your brand.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Direct line to your account manager for any questions or requests.",
  },
]

export default function SuppliersPage() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col px-6 md:px-12 lg:px-20 py-8 md:py-12 min-h-0 relative">
      <div className="max-w-5xl mx-auto w-full space-y-20 lg:space-y-28">

        <div className="text-center space-y-6">
          <p className="text-[11px] font-bold text-[#999] uppercase tracking-[0.12em]">Private Supplier</p>
          <h1
            className="text-[40px] md:text-[52px] font-bold text-black leading-[1.08] tracking-[-1.5px] md:tracking-[-2px]"
            data-testid="text-supplier-title"
          >
            Your Private Supplier
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#666] max-w-xl mx-auto leading-[1.5]">
            We source, pack, and ship your products directly to your customers in 6-8 days across the USA.
          </p>
          <div className="pt-2">
            <button
              className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors cursor-pointer"
              data-testid="button-hero-cta"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="relative rounded-[20px] overflow-hidden cursor-pointer group border border-black/[0.04]"
          onClick={() => setVideoOpen(true)}
          data-testid="button-play-explainer-video"
        >
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative">
            <img
              src="/images/suppliers/packing-operation.png"
              alt="USDrop Private Supplier Operations"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="h-10 w-10 text-black ml-1" />
              </div>
              <p className="text-white font-bold text-[20px] tracking-[-0.4px] drop-shadow-md">Watch How It Works</p>
            </div>
          </div>
        </div>

        {videoOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-12 right-0 text-white/80 transition-colors cursor-pointer"
                data-testid="button-close-video"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
                <p className="text-white/60 text-sm">Video player will load here</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#FAFAFA] border border-black/[0.04] rounded-[16px] p-6 text-center space-y-3" data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="h-11 w-11 mx-auto rounded-[12px] bg-white border border-black/[0.04] flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-black" />
              </div>
              <p className="text-[28px] font-bold text-black tracking-[-0.5px]">{stat.value}</p>
              <p className="text-[13px] text-[#999]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1] text-center">
            How It Works
          </h2>
          <div className="space-y-4">
            {steps.map((item) => (
              <div key={item.step} className="flex items-start gap-5 bg-[#FAFAFA] border border-black/[0.04] rounded-[16px] p-6 md:p-8" data-testid={`card-step-${item.step}`}>
                <span className="text-[28px] font-bold text-black/[0.12] tracking-[-0.5px] flex-shrink-0 leading-none mt-1">{item.step}</span>
                <div>
                  <h3 className="text-[17px] font-bold text-black tracking-[-0.3px]">{item.title}</h3>
                  <p className="text-[15px] text-[#666] mt-1 leading-[1.5]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors cursor-pointer"
              data-testid="button-steps-cta"
            >
              Start Selling
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-10">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-[-1.2px] leading-[1.1] text-center">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#FAFAFA] border border-black/[0.04] rounded-[16px] p-8 space-y-4"
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="h-11 w-11 rounded-[12px] bg-white border border-black/[0.04] flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-[20px] font-bold text-black tracking-[-0.4px]">{feature.title}</h3>
                <p className="text-[15px] text-[#666] leading-[1.5]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/[0.04] rounded-[20px] p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-20 w-20 border-2 border-black/[0.04] flex-shrink-0">
              <AvatarImage src="/images/suppliers/warehouse-worker-thumbnail.png" alt="Juice Chen" />
              <AvatarFallback className="text-xl font-bold bg-[#FAFAFA] text-black">JC</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-[20px] font-bold text-black tracking-[-0.4px]">Juice Chen</h3>
                <CheckCircle2 className="h-4 w-4 text-black" />
              </div>
              <p className="text-[13px] text-[#999]">Account Manager &bull; Dongguan, China</p>
              <p className="text-[15px] text-[#666] leading-[1.5]">
                Your dedicated point of contact for all supplier needs. From product sourcing to custom packaging, Juice handles everything.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start pt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-[14px] font-bold text-black">5.0</span>
                </div>
                <span className="text-[#ccc]">&bull;</span>
                <span className="text-[13px] text-[#999]">1,250+ orders</span>
                <span className="text-[#ccc]">&bull;</span>
                <span className="text-[13px] text-[#999] inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  China
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-[10px] text-[14px] transition-colors cursor-pointer"
                data-testid="button-contact-supplier"
              >
                <Mail className="h-4 w-4" />
                Contact Supplier
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-[24px] p-12 md:p-20 text-center relative overflow-hidden" data-testid="section-supplier-cta">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #6366F1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #818CF8 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10 space-y-6">
            <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-bold text-white tracking-[-1px] leading-[1.1]">
              Ready to Start Selling?
            </h2>
            <p className="text-[16px] text-[#888] max-w-lg mx-auto leading-[1.5]">
              Connect with your private supplier today. No minimum orders, no upfront inventory costs.
            </p>
            <div className="pt-2">
              <button
                className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-100 text-black font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors cursor-pointer"
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pb-8" />
      </div>
    </div>
  )
}
