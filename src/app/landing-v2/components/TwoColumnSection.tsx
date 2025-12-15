"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function TwoColumnSection() {
  return (
    <section className="w-full py-20 border-b border-gray-200 relative" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-[1200px] mx-auto px-16 relative">
        {/* Left border */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
        {/* Right border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-16 border-t border-gray-200 pt-12">
          {/* Left Column - Product Research */}
          <div className="flex flex-col">
            <div className="mb-4 text-xs font-medium text-gray-500 uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
              PRODUCT RESEARCH
            </div>
            <h2 className="mb-3 text-3xl font-normal text-gray-400 leading-[1.2] tracking-tight" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
              Smart and data-driven{" "}
              <span className="text-black italic">product discovery for entrepreneurs.</span>
            </h2>
            <p className="mb-6 text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              Find winning products before they saturate. AI analyzes trends, competition, and profitability to surface products that actually sell.
            </p>
            <Link href="/research-tools" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group w-fit">
              <span className="text-sm font-medium uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                RESEARCH TOOLS
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Column - AI Content Creation */}
          <div className="flex flex-col">
            <div className="mb-4 text-xs font-medium text-gray-500 uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
              AI CONTENT STUDIO
            </div>
            <h2 className="mb-3 text-3xl font-normal text-gray-400 leading-[1.2] tracking-tight" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
              Instant and professional{" "}
              <span className="text-black italic">content creation for marketers.</span>
            </h2>
            <p className="mb-6 text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              Generate product photos, ad creatives, and marketing visuals in seconds. No photoshoots, no designers—just AI-powered content that converts.
            </p>
            <Link href="/ai-toolkit" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group w-fit">
              <span className="text-sm font-medium uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                AI STUDIO
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

