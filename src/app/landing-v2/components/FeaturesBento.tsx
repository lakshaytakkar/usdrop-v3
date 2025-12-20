"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Sparkles, Truck, Calculator, BarChart3, GraduationCap } from "lucide-react"

const features = [
  {
    id: "product-discovery",
    title: "Product Discovery",
    description: "Find winning products before they saturate. AI analyzes millions of data points to surface high-margin opportunities.",
    icon: Search,
    href: "/research-tools",
    image: "/landing/product-discovery-banner.png",
    span: "col-span-2 row-span-2",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "ai-studio",
    title: "AI Studio",
    description: "Generate product photos, ad creatives, and marketing visuals in seconds. No photoshoots required.",
    icon: Sparkles,
    href: "/ai-toolkit",
    image: "/landing/ai-studio-model.png",
    span: "col-span-1 row-span-1",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "fulfillment",
    title: "Fulfillment",
    description: "Fast US shipping with automated order processing. Seamless integration with your store.",
    icon: Truck,
    href: "/fulfillment",
    image: "/landing/supplier-network.png",
    span: "col-span-1 row-span-1",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "profit-calculator",
    title: "Profit Calculator",
    description: "Calculate margins, shipping costs, and profitability before you list.",
    icon: Calculator,
    href: "/ai-toolkit/profit-calculator",
    image: "/images/banner-thumbnails/profit-calculator.png",
    span: "col-span-1 row-span-1",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "competitor-intelligence",
    title: "Competitor Intelligence",
    description: "Analyze competitor stores, track their bestsellers, and discover market opportunities.",
    icon: BarChart3,
    href: "/competitor-stores",
    image: "/landing/competitor-intelligence.png",
    span: "col-span-1 row-span-1",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "academy",
    title: "Academy",
    description: "Learn dropshipping strategies, scaling tactics, and business growth from industry experts.",
    icon: GraduationCap,
    href: "/academy",
    image: "/images/academy/learning-environment.png",
    span: "col-span-2 row-span-1",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
]

export function FeaturesBento() {
  return (
    <section className="w-full py-20 border-b border-gray-200 relative" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-[1200px] mx-auto px-16 relative">
        {/* Left border */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
        {/* Right border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
        
        {/* Section Header */}
        <div className="mb-12 border-t border-gray-200 pt-12">
          <div className="mb-4 text-xs font-medium text-gray-500 uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
            FEATURES
          </div>
          <h2 className="mb-3 text-4xl font-normal text-black leading-[1.1] tracking-tight" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
            Everything you need to build and scale
          </h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
            A complete platform that brings together product research, content creation, and fulfillment in one place.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-4 auto-rows-[200px]">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.id}
                href={feature.href}
                className={`${feature.span} ${feature.bgColor} rounded-lg border border-gray-200 p-6 flex flex-col hover:border-gray-300 hover:shadow-sm transition-all group relative overflow-hidden`}
              >
                {/* Background Image (subtle) */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-md ${feature.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-normal text-gray-900 leading-tight" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    {feature.description}
                  </p>

                  {/* Link */}
                  <div className="mt-4 flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span className="text-xs font-medium uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                      EXPLORE
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}





