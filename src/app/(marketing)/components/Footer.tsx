"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"

const footerLinks = {
  Product: [
    { name: "AI Research", href: "/research" },
    { name: "AI Studio", href: "/studio" },
    { name: "AI Fulfillment", href: "/fulfillment" },
    { name: "Integrations", href: "/integrations" },
  ],
  Resources: [
    { name: "Blog", href: "/resources/blog" },
    { name: "Guides", href: "/resources/guides" },
    { name: "Help Center", href: "/academy/help" },
    { name: "Case Studies", href: "/resources/case-studies" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
  ],
  Legal: [
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Refund Policy", href: "/legal/refund" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold tracking-tight text-white">USDrop</span>
              <span className="text-2xl font-bold text-blue-400">AI</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The AI-powered dropshipping platform that finds winners, creates content, and handles fulfillment.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} USDrop AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="https://twitter.com"
              className="text-slate-400 hover:text-white transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-slate-400 hover:text-white transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
            <Link
              href="https://discord.com"
              className="text-slate-400 hover:text-white transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

