"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen } from "lucide-react"

export function LandingHero() {
  return (
    <section className="w-full py-20 border-b border-gray-200 relative" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-[1200px] mx-auto px-16 relative">
        {/* Left border */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
        {/* Right border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
        <div className="flex flex-col items-center text-center">
          {/* Hero Icon */}
          <div className="mb-10 flex items-center justify-center">
            <div className="w-32 h-32 flex items-center justify-center relative">
              <Image 
                src="/images/email/email-icon.jpg" 
                alt="USDrop AI Platform" 
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="mb-4 text-5xl font-normal text-gray-900 leading-[1.1] tracking-[-0.02em] max-w-4xl" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
            Dropshipping for Entrepreneurs & Builders
          </h1>

          {/* Description */}
          <p className="mb-8 text-base text-gray-600 max-w-2xl leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
            Discover winning products, create stunning ads, and automate fulfillment—all in one AI-powered platform designed to scale your dropshipping business.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/demo">
              <button className="h-10 px-6 text-sm font-medium text-black border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all" style={{ fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.05em' }}>
                WATCH DEMO
              </button>
            </Link>
            <Link href="/signup">
              <button className="h-10 px-6 text-sm font-medium text-white bg-[#8B5CF6] rounded-md hover:bg-[#7C3AED] transition-colors shadow-sm" style={{ fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.05em' }}>
                GET STARTED FREE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

