"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { 
  ChevronDown, 
  Truck, 
  Sparkles, 
  BarChart3, 
  Search,
  GraduationCap,
  BookOpen,
  Newspaper,
  HelpCircle
} from "lucide-react"
import { useState, useEffect } from "react"

export function LandingHeader() {
  const [isMounted, setIsMounted] = useState(false)
  const [ecosystemOpen, setEcosystemOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="w-full border-b border-gray-200 sticky top-0 z-50" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="w-full px-16 py-4">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo className="text-black" />
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
          <div 
            className="relative"
            onMouseEnter={() => setEcosystemOpen(true)}
            onMouseLeave={() => setEcosystemOpen(false)}
          >
            <button className="flex items-center gap-1 text-base text-black font-medium hover:opacity-70 transition-opacity uppercase tracking-[0.05em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
              ECOSYSTEM
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${ecosystemOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {ecosystemOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-lg shadow-lg border border-gray-100 bg-white" style={{ animation: 'fadeIn 0.2s ease-in-out forwards' }}>
                <Link href="/fulfillment" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Fulfillment
                  </span>
                </Link>
                <Link href="/ai-toolkit" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    AI Studio
                  </span>
                </Link>
                <Link href="/intelligence-hub" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Intelligence
                  </span>
                </Link>
                <Link href="/research-tools" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Research
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/what-is-dropshipping" className="text-base text-black font-medium hover:opacity-70 transition-opacity uppercase tracking-[0.05em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
            LEARN
          </Link>

          <div 
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className="flex items-center gap-1 text-base text-black font-medium hover:opacity-70 transition-opacity uppercase tracking-[0.05em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
              RESOURCES
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {resourcesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-lg shadow-lg border border-gray-100 bg-white" style={{ animation: 'fadeIn 0.2s ease-in-out forwards' }}>
                <Link href="/academy" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Academy
                  </span>
                </Link>
                <Link href="/learn" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Learn
                  </span>
                </Link>
                <Link href="/intelligence-hub" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Intelligence Hub
                  </span>
                </Link>
                <Link href="/help-center" className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Help Center
                  </span>
                </Link>
              </div>
            )}
          </div>

            <Link href="/pricing" className="text-base text-black font-medium hover:opacity-70 transition-opacity uppercase tracking-[0.05em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
              PRICING
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="h-9 px-5 text-sm font-medium text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors uppercase tracking-[0.05em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                LOGIN
              </button>
            </Link>
            <Link href="/signup">
              <button className="h-9 px-5 text-sm font-medium text-white bg-[#8B5CF6] rounded-md hover:bg-[#7C3AED] transition-colors uppercase tracking-[0.05em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                SIGNUP
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

