
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  CheckCircle2,
  Shield,
  FileText,
  Building2,
  Globe,
  Clock,
  CreditCard,
  Mail,
  Star,
  MapPin,
  BadgeCheck,
  Scale,
  Landmark,
  HeadphonesIcon,
} from "lucide-react"

export default function MyLLCPage() {
  return (
    <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
      <div className="max-w-4xl mx-auto w-full space-y-10">

        <div className="text-center space-y-3">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200" data-testid="badge-llc-verified">
            <Building2 className="h-3 w-3 mr-1" />
            Official LLC Formation Service
          </Badge>
          <h1 className="ds-page-title ds-text-heading" data-testid="text-llc-title">
            Your LLC Formation
          </h1>
          <p className="ds-body ds-text-muted max-w-2xl mx-auto">
            Get your US-based LLC set up quickly and legally. We handle the entire formation process so you can focus on building your dropshipping business.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "100%", label: "Success Rate", icon: BadgeCheck, color: "text-emerald-600" },
            { value: "500+", label: "LLCs Formed", icon: Building2, color: "text-blue-600" },
            { value: "7-10 Days", label: "Processing Time", icon: Clock, color: "text-purple-600" },
            { value: "All 50", label: "US States", icon: Globe, color: "text-orange-600" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200/60 bg-white/60 p-4 text-center space-y-1.5" style={{ backdropFilter: 'blur(8px)' }} data-testid={`card-llc-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
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
                title: "Choose Your State",
                description: "Select the best state for your LLC formation. We recommend Wyoming or Delaware for e-commerce businesses due to favorable tax laws and privacy protections.",
              },
              {
                step: "2",
                title: "Provide Your Details",
                description: "Share your basic information including your desired business name, registered agent preferences, and management structure. We verify name availability instantly.",
              },
              {
                step: "3",
                title: "We File Your Documents",
                description: "Our team prepares and files your Articles of Organization with the state. All legal documents are reviewed for accuracy before submission.",
              },
              {
                step: "4",
                title: "EIN & Tax Setup",
                description: "We obtain your Employer Identification Number (EIN) from the IRS and set up your federal tax ID so you can open business bank accounts and process payments.",
              },
              {
                step: "5",
                title: "Operating Agreement",
                description: "Receive a professionally drafted Operating Agreement customized for your e-commerce business, outlining ownership structure and management responsibilities.",
              },
              {
                step: "6",
                title: "Ready to Operate",
                description: "Your LLC is officially formed. You receive all formation documents, compliance calendar, and ongoing support to keep your business in good standing.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200/60 bg-white/60" style={{ backdropFilter: 'blur(8px)' }} data-testid={`card-llc-step-${item.step}`}>
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
          <h2 className="ds-section-title ds-text-heading">What's Included</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: FileText,
                title: "Articles of Organization",
                description: "Professionally prepared and filed with the state. Includes name availability check and expedited processing.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Landmark,
                title: "EIN / Tax ID Number",
                description: "Federal Employer Identification Number obtained from the IRS for banking, taxes, and business operations.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Scale,
                title: "Operating Agreement",
                description: "Custom operating agreement tailored for e-commerce and dropshipping business structures.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Shield,
                title: "Registered Agent",
                description: "First year of registered agent service included. Receive legal documents and state correspondence on your behalf.",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                icon: CreditCard,
                title: "Business Banking Guide",
                description: "Step-by-step guide to opening your business bank account and setting up payment processing for your store.",
                color: "text-pink-600",
                bg: "bg-pink-50",
              },
              {
                icon: HeadphonesIcon,
                title: "Ongoing Compliance",
                description: "Annual report reminders, compliance calendar, and dedicated support to keep your LLC in good standing.",
                color: "text-teal-600",
                bg: "bg-teal-50",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-gray-200/60 bg-white/60 p-5 space-y-3" style={{ backdropFilter: 'blur(8px)' }} data-testid={`card-llc-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
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
              <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-700">US</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-lg font-semibold ds-text-heading">USDrop LLC Services</h3>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm ds-text-muted">LLC Formation Team</p>
              <p className="text-sm ds-text-body leading-relaxed">
                Our experienced formation team has helped 500+ entrepreneurs set up their US-based LLCs. From filing to compliance, we handle every detail so your business is legally protected from day one.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start pt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">5.0</span>
                </div>
                <span className="text-xs ds-text-muted">&bull;</span>
                <span className="text-sm ds-text-muted">500+ LLCs formed</span>
                <span className="text-xs ds-text-muted">&bull;</span>
                <span className="text-sm ds-text-muted inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  United States
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button size="lg" className="gap-2" data-testid="button-contact-llc-team">
                <Mail className="h-4 w-4" />
                Contact Team
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white space-y-4">
          <h2 className="text-2xl font-bold">Ready to Form Your LLC?</h2>
          <p className="text-blue-100 max-w-lg mx-auto">
            Protect your personal assets and establish credibility with a properly formed US LLC. Get started today with expert guidance every step of the way.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-blue-700" data-testid="button-start-llc">
              <Building2 className="h-4 w-4" />
              Start My LLC
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white" data-testid="button-learn-more-llc">
              <FileText className="h-4 w-4" />
              Learn More
            </Button>
          </div>
        </div>

        <div className="pb-8" />
      </div>
    </div>
  )
}
