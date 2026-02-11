"use client"

import Link from "next/link"

const footerLinks = {
  Product: [
    { name: "AI Research", href: "/#features" },
    { name: "AI Studio", href: "/#studio" },
    { name: "AI Fulfillment", href: "/#workflow" },
    { name: "Integrations", href: "/#features" },
  ],
  Resources: [
    { name: "Blog", href: "/blog" },
    { name: "Guides", href: "/#features" },
    { name: "Help Center", href: "/help-center" },
    { name: "Academy", href: "/academy" },
  ],
  Company: [
    { name: "About Us", href: "/#about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "mailto:support@usdrop.ai" },
  ],
  Legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0f0f14] text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-baseline gap-1 mb-5">
              <span className="text-2xl font-bold tracking-tight text-white">USDrop</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">AI</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[240px]">
              The AI-powered dropshipping platform that finds winners, creates content, and handles fulfillment.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-medium text-white text-sm tracking-wide uppercase mb-5">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} USDrop AI. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-slate-500 hover:text-white transition-colors duration-200 text-sm"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-slate-500 hover:text-white transition-colors duration-200 text-sm"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              className="text-slate-500 hover:text-white transition-colors duration-200 text-sm"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
