"use client"

import Link from "next/link"
import { Logo } from "@/components/layout/logo"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: 'include' })
        setIsLoggedIn(res.ok)
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <div 
      className="bg-[rgba(255,255,255,0.5)] border border-solid border-white content-stretch flex items-center px-[12px] py-[10px] relative rounded-[12px] w-fit mx-auto"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <div className="h-[45px] flex items-center shrink-0">
        <Logo className="text-black text-lg" />
      </div>

      <nav className="hidden md:flex gap-[32px] items-center leading-[18px] ml-[120px] shrink-0 text-[16px] text-black font-medium">
        <Link href="/what-is-dropshipping" className="hover:opacity-70 transition-opacity">
          What is dropshipping?
        </Link>
        <Link href="/pricing" className="hover:opacity-70 transition-opacity">
          Pricing
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-3 shrink-0 ml-[120px]">
        {isLoggedIn ? (
          <div className="h-[42px] relative shrink-0 w-[140px]">
            <Link href="/home">
              <div
                className="absolute h-[42px] left-0 overflow-clip rounded-[6.462px] shadow-[0px_0px_0px_0.8px_rgba(0,0,0,0.9)] top-0 w-[140px] cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 118.73 42\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"0.24\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(11.873 4.2 -5.9269 16.755 0 0)\"><stop stop-color=\"rgba(174,163,240,1)\" offset=\"0\"/><stop stop-color=\"rgba(131,122,180,1)\" offset=\"0.25\"/><stop stop-color=\"rgba(109,102,150,1)\" offset=\"0.375\"/><stop stop-color=\"rgba(87,82,120,1)\" offset=\"0.5\"/><stop stop-color=\"rgba(65,61,90,1)\" offset=\"0.625\"/><stop stop-color=\"rgba(44,41,60,1)\" offset=\"0.75\"/><stop stop-color=\"rgba(22,20,30,1)\" offset=\"0.875\"/><stop stop-color=\"rgba(11,10,15,1)\" offset=\"0.9375\"/><stop stop-color=\"rgba(5,5,8,1)\" offset=\"0.96875\"/><stop stop-color=\"rgba(0,0,0,1)\" offset=\"1\"/></radialGradient></defs></svg>'), linear-gradient(145.98deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)"
                }}
              >
                <p
                  className="absolute font-medium leading-[23.423px] left-1/2 translate-x-[-50%] text-[14.538px] text-white top-[calc(50%-12.12px)] whitespace-nowrap"
                  style={{ textShadow: "0px 0.4px 0.6px rgba(0,0,0,0.14)" }}
                >
                  My Dashboard
                </p>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-0.6px_0px_0px_rgba(255,255,255,0.14)]" />
              </div>
            </Link>
          </div>
        ) : (
          <>
            <Link href="/login">
              <button
                className="h-[42px] px-4 text-[14.538px] font-medium text-black hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                Log In
              </button>
            </Link>

            <div className="h-[42px] relative shrink-0 w-[130px]">
              <Link href="/signup">
                <div
                  className="absolute h-[42px] left-0 overflow-clip rounded-[6.462px] shadow-[0px_0px_0px_0.8px_rgba(0,0,0,0.9)] top-0 w-[130px] cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 118.73 42\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"0.24\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(11.873 4.2 -5.9269 16.755 0 0)\"><stop stop-color=\"rgba(174,163,240,1)\" offset=\"0\"/><stop stop-color=\"rgba(131,122,180,1)\" offset=\"0.25\"/><stop stop-color=\"rgba(109,102,150,1)\" offset=\"0.375\"/><stop stop-color=\"rgba(87,82,120,1)\" offset=\"0.5\"/><stop stop-color=\"rgba(65,61,90,1)\" offset=\"0.625\"/><stop stop-color=\"rgba(44,41,60,1)\" offset=\"0.75\"/><stop stop-color=\"rgba(22,20,30,1)\" offset=\"0.875\"/><stop stop-color=\"rgba(11,10,15,1)\" offset=\"0.9375\"/><stop stop-color=\"rgba(5,5,8,1)\" offset=\"0.96875\"/><stop stop-color=\"rgba(0,0,0,1)\" offset=\"1\"/></radialGradient></defs></svg>'), linear-gradient(145.98deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)"
                  }}
                >
                  <p
                    className="absolute font-medium leading-[23.423px] left-1/2 translate-x-[-50%] text-[14.538px] text-white top-[calc(50%-12.12px)] whitespace-nowrap"
                    style={{ textShadow: "0px 0.4px 0.6px rgba(0,0,0,0.14)" }}
                  >
                    Get Started
                  </p>
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-0.6px_0px_0px_rgba(255,255,255,0.14)]" />
                </div>
              </Link>
            </div>
          </>
        )}
      </div>

      <button
        className="md:hidden ml-4 p-2 text-black hover:opacity-70 transition-opacity"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white rounded-[12px] shadow-lg p-4 flex flex-col gap-4 z-50 md:hidden">
          <Link
            href="/what-is-dropshipping"
            className="text-[16px] text-black font-medium hover:opacity-70 transition-opacity py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            What is dropshipping?
          </Link>
          <Link
            href="/pricing"
            className="text-[16px] text-black font-medium hover:opacity-70 transition-opacity py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <Link
                href="/home"
                className="bg-black text-white text-center py-3 rounded-lg font-medium text-[14.538px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-black text-center py-3 font-medium text-[14.538px] hover:opacity-70 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-black text-white text-center py-3 rounded-lg font-medium text-[14.538px]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
