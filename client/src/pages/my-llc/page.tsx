
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Lock,
  Play,
  X,
  ExternalLink,
  ShoppingCart,
  Landmark,
  CreditCard,
  ShieldCheck,
  FileText,
  Globe,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export default function MyLLCPage() {
  const [videoOpen, setVideoOpen] = useState(false)

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
      <div className="max-w-4xl mx-auto w-full space-y-10">

        <div className="text-center space-y-3">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200" data-testid="badge-llc-service">
            <Building2 className="h-3 w-3 mr-1" />
            LLC Formation Service
          </Badge>
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

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h2 className="ds-section-title ds-text-heading">Your LLC Status</h2>
          </div>
          <p className="text-sm ds-text-muted -mt-2">These fields are required to operate your e-commerce business in the US.</p>
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
          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              data-testid="button-get-llc"
              onClick={() => window.open('https://usdrop.ai/llc', '_blank')}
            >
              <Building2 className="h-4 w-4" />
              Get My LLC Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white/30 text-white hover:bg-white/10"
              data-testid="button-learn-more-llc"
              onClick={() => setVideoOpen(true)}
            >
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
