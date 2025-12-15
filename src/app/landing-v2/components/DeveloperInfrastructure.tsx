"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"

export function DeveloperInfrastructure() {
  return (
    <section className="w-full py-20 border-b border-gray-200 relative" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-[1200px] mx-auto px-16 relative">
        {/* Left border */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
        {/* Right border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-4 text-xs font-medium text-gray-500 uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
            FULFILLMENT
          </div>
          <h2 className="mb-4 text-4xl font-normal text-black leading-[1.1] tracking-tight" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
            Automated fulfillment infrastructure
          </h2>
          <p className="mb-8 text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
            Fast US shipping, automated order processing, and seamless integration with your store. Built for speed, reliability, and scale.
          </p>
          <Link href="/fulfillment" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
              LEARN MORE
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

