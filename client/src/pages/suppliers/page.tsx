
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

export default function SuppliersPage() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
      <div className="max-w-4xl mx-auto w-full space-y-10">

        <div className="text-center space-y-3">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
            <Shield className="h-3 w-3 mr-1" />
            Verified & Trusted Partner
          </Badge>
          <h1 className="ds-page-title ds-text-heading">
            Your Private Supplier
          </h1>
          <p className="ds-body ds-text-muted max-w-2xl mx-auto">
            Skip the hassle of finding reliable suppliers. We source, pack, and ship your products directly to your customers in 6-8 days across the USA.
          </p>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer group border border-gray-200/60 shadow-sm"
          onClick={() => setVideoOpen(true)}
          data-testid="button-play-explainer-video"
        >
          <div className="aspect-video bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative">
            <img
              src="/images/suppliers/packing-operation.png"
              alt="USDrop Private Supplier Operations"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-white/95 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-blue-600 ml-1" />
              </div>
              <p className="text-white font-semibold text-lg drop-shadow-md">Watch How It Works</p>
            </div>
          </div>
        </div>

        {videoOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-12 right-0 text-white/80 transition-colors"
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "5.0", label: "Supplier Rating", icon: Star, color: "text-yellow-500" },
            { value: "1,250+", label: "Orders Fulfilled", icon: Package, color: "text-blue-600" },
            { value: "$0", label: "Minimum Order", icon: Zap, color: "text-emerald-600" },
            { value: "6-8 Days", label: "USA Delivery", icon: Truck, color: "text-purple-600" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200/60 bg-white/60 p-4 text-center space-y-1.5" style={{ backdropFilter: 'blur(8px)' }}>
              <stat.icon className={`h-5 w-5 mx-auto ${stat.color}`} />
              <p className="text-xl font-bold ds-text-heading">{stat.value}</p>
              <p className="text-xs ds-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <h2 className="ds-section-title ds-text-heading">How It Works</h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Browse & Pick Products",
                description: "Explore our curated product catalog across all categories. Find winning products with proven demand and competitive margins.",
              },
              {
                step: "2",
                title: "We Source & Stock for You",
                description: "Our warehouse in Dongguan, China holds inventory ready to ship. No need to buy bulk or store anything yourself.",
              },
              {
                step: "3",
                title: "Customer Places an Order",
                description: "When your customer orders from your store, the order syncs automatically to our fulfillment system within minutes.",
              },
              {
                step: "4",
                title: "Professional Packing & Labeling",
                description: "Each order is carefully packed with your branding. Custom labels, inserts, and packaging options available for whitelabeling.",
              },
              {
                step: "5",
                title: "Fast Shipping via USDrop Express Line",
                description: "Orders are dispatched within 1 business day and delivered to USA customers in 6-8 days with full tracking.",
              },
              {
                step: "6",
                title: "Automatic Tracking Updates",
                description: "Your customers receive real-time tracking information. No manual work needed — everything is automated end to end.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200/60 bg-white/60" style={{ backdropFilter: 'blur(8px)' }}>
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold ds-text-heading text-[15px]">{item.title}</h3>
                  <p className="text-sm ds-text-muted mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="ds-section-title ds-text-heading">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: "Verified & Trusted",
                description: "Fully vetted supplier with 5-star rating and 1,250+ successful orders.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Clock,
                title: "1-Day Processing",
                description: "Orders are processed and dispatched within 1 business day of receiving them.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Globe,
                title: "USA Express Delivery",
                description: "Dedicated USDrop Express Line delivers to USA customers in just 6-8 days.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Zap,
                title: "Zero Minimum Order",
                description: "No bulk purchasing required. Order one piece or a thousand — no minimums.",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                icon: Award,
                title: "Whitelabel Ready",
                description: "Custom branding, packaging, and inserts so products ship under your brand name.",
                color: "text-pink-600",
                bg: "bg-pink-50",
              },
              {
                icon: HeadphonesIcon,
                title: "Dedicated Support",
                description: "Direct line to your account manager Juice Chen for any questions or custom requests.",
                color: "text-teal-600",
                bg: "bg-teal-50",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-gray-200/60 bg-white/60 p-5 space-y-3" style={{ backdropFilter: 'blur(8px)' }}>
                <div className={`h-10 w-10 rounded-lg ${feature.bg} flex items-center justify-center`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold ds-text-heading text-[15px]">{feature.title}</h3>
                <p className="text-sm ds-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/60 bg-white/70 p-6 md:p-8" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg flex-shrink-0">
              <AvatarImage src="/images/suppliers/warehouse-worker-thumbnail.png" alt="Juice Chen" />
              <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-700">JC</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-lg font-semibold ds-text-heading">Juice Chen</h3>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm ds-text-muted">Account Manager &bull; Dongguan, China</p>
              <p className="text-sm ds-text-body leading-relaxed">
                Your dedicated point of contact for all supplier needs. From product sourcing to custom packaging, Juice handles everything to ensure smooth operations for your store.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start pt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">5.0</span>
                </div>
                <span className="text-xs ds-text-muted">&bull;</span>
                <span className="text-sm ds-text-muted">1,250+ orders fulfilled</span>
                <span className="text-xs ds-text-muted">&bull;</span>
                <span className="text-sm ds-text-muted inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  China
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button size="lg" className="gap-2" data-testid="button-contact-supplier">
                <Mail className="h-4 w-4" />
                Contact Supplier
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white space-y-4">
          <h2 className="text-2xl font-bold">Ready to Start Selling?</h2>
          <p className="text-blue-100 max-w-lg mx-auto">
            Connect with your private supplier today and start fulfilling orders automatically. No minimum orders, no upfront inventory costs.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-blue-700" data-testid="button-get-started">
              <Package className="h-4 w-4" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white" onClick={() => setVideoOpen(true)} data-testid="button-watch-video-cta">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </div>
        </div>

        <div className="pb-8" />
      </div>
    </div>
  )
}
