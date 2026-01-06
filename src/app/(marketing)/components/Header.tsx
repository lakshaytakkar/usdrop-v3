"use client"

import Link from "next/link"
import { Logo } from "@/components/layout/logo"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check if user is logged in
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }

    checkAuth()
  }, [])

  return (
    <div 
      className="bg-[rgba(255,255,255,0.5)] border border-solid border-white content-stretch flex gap-[120px] items-center px-[12px] py-[10px] relative rounded-[12px] w-fit mx-auto"
      data-node-id="3:3922"
      style={{ backdropFilter: "blur(10px)" }}
    >
      {/* Logo - USDrop AI */}
      <div className="h-[45px] flex items-center shrink-0" data-name="Frame" data-node-id="3:3923">
        <Logo className="text-black text-lg" />
      </div>

      {/* Simplified navigation for early marketing pages */}
      <nav className="content-stretch flex gap-[32px] items-center leading-[18px] relative shrink-0 text-[16px] text-black font-medium">
        <Link href="/what-is-dropshipping" className="hover:opacity-70 transition-opacity">
          What is dropshipping?
        </Link>
        <Link href="/pricing" className="hover:opacity-70 transition-opacity">
          Pricing
        </Link>
      </nav>

      {/* Login and Get Started Buttons OR My Dashboard Button */}
      <div className="flex items-center gap-3 shrink-0">
        {isLoggedIn ? (
          /* My Dashboard Button - styled like Get Started */
          <div className="h-[42px] relative shrink-0 w-[140px]" data-node-id="3:3938">
            <Link href="/onboarding">
              <div
                className="absolute h-[42px] left-0 overflow-clip rounded-[6.462px] shadow-[0px_0px_0px_0.8px_rgba(0,0,0,0.9)] top-0 w-[140px] cursor-pointer hover:opacity-90 transition-opacity"
                data-node-id="3:3939"
                style={{
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 118.73 42\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"0.24\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(11.873 4.2 -5.9269 16.755 0 0)\"><stop stop-color=\"rgba(174,163,240,1)\" offset=\"0\"/><stop stop-color=\"rgba(131,122,180,1)\" offset=\"0.25\"/><stop stop-color=\"rgba(109,102,150,1)\" offset=\"0.375\"/><stop stop-color=\"rgba(87,82,120,1)\" offset=\"0.5\"/><stop stop-color=\"rgba(65,61,90,1)\" offset=\"0.625\"/><stop stop-color=\"rgba(44,41,60,1)\" offset=\"0.75\"/><stop stop-color=\"rgba(22,20,30,1)\" offset=\"0.875\"/><stop stop-color=\"rgba(11,10,15,1)\" offset=\"0.9375\"/><stop stop-color=\"rgba(5,5,8,1)\" offset=\"0.96875\"/><stop stop-color=\"rgba(0,0,0,1)\" offset=\"1\"/></radialGradient></defs></svg>'), linear-gradient(145.98deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)"
                }}
              >
                <p
                  className="absolute font-medium leading-[23.423px] left-1/2 translate-x-[-50%] text-[14.538px] text-white top-[calc(50%-12.12px)] whitespace-nowrap"
                  data-node-id="3:3940"
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
            {/* Login Button */}
            <Link href="/login">
              <button
                className="h-[42px] px-4 text-[14.538px] font-medium text-black hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                Log In
              </button>
            </Link>

            {/* Get Started Button */}
            <div className="h-[42px] relative shrink-0 w-[130px]" data-node-id="3:3938">
              <Link href="/signup">
                <div
                  className="absolute h-[42px] left-0 overflow-clip rounded-[6.462px] shadow-[0px_0px_0px_0.8px_rgba(0,0,0,0.9)] top-0 w-[130px] cursor-pointer hover:opacity-90 transition-opacity"
                  data-node-id="3:3939"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 118.73 42\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"0.24\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(11.873 4.2 -5.9269 16.755 0 0)\"><stop stop-color=\"rgba(174,163,240,1)\" offset=\"0\"/><stop stop-color=\"rgba(131,122,180,1)\" offset=\"0.25\"/><stop stop-color=\"rgba(109,102,150,1)\" offset=\"0.375\"/><stop stop-color=\"rgba(87,82,120,1)\" offset=\"0.5\"/><stop stop-color=\"rgba(65,61,90,1)\" offset=\"0.625\"/><stop stop-color=\"rgba(44,41,60,1)\" offset=\"0.75\"/><stop stop-color=\"rgba(22,20,30,1)\" offset=\"0.875\"/><stop stop-color=\"rgba(11,10,15,1)\" offset=\"0.9375\"/><stop stop-color=\"rgba(5,5,8,1)\" offset=\"0.96875\"/><stop stop-color=\"rgba(0,0,0,1)\" offset=\"1\"/></radialGradient></defs></svg>'), linear-gradient(145.98deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)"
                  }}
                >
                  <p
                    className="absolute font-medium leading-[23.423px] left-1/2 translate-x-[-50%] text-[14.538px] text-white top-[calc(50%-12.12px)] whitespace-nowrap"
                    data-node-id="3:3940"
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
    </div>
  )
}
