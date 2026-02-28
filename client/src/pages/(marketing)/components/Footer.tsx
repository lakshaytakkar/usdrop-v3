import { Link } from "wouter"
import { ArrowRight } from "lucide-react"
import { FormEvent, useState } from "react"
const footerLinks = {
  research: {
    title: "Research",
    links: [
      { label: "Winning Products", href: "/features/winning-products" },
      { label: "Winning Ads", href: "/features/winning-ads" },
      { label: "Winning Stores", href: "/features/winning-stores" },
    ],
  },
  framework: {
    title: "My Mentorship",
    links: [
      { label: "Journey Roadmap", href: "/features/roadmap" },
      { label: "Live Dashboard", href: "/features/dashboard" },
      { label: "Products Tracking", href: "/features/products-tracking" },
    ],
  },
  learning: {
    title: "Learning",
    links: [
      { label: "Live Sessions", href: "/features/live-sessions" },
      { label: "Courses", href: "/features/courses" },
      { label: "Blog", href: "/features/blog" },
    ],
  },
  tools: {
    title: "Tools",
    links: [
      { label: "Description Generator", href: "/features/description-generator" },
      { label: "Profit Calculator", href: "/features/profit-calculator" },
      { label: "Shipping Calculator", href: "/features/shipping-calculator" },
      { label: "Policy Generator", href: "/features/policy-generator" },
      { label: "Invoice Generator", href: "/features/invoice-generator" },
      { label: "Email Templates", href: "/features/email-templates" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "What is Dropshipping", href: "/what-is-dropshipping" },
      { label: "Shopify Integration", href: "/shopify" },
      { label: "Marketplaces", href: "/features/fulfilment" },
    ],
  },
}

export function Footer() {
  const [email, setEmail] = useState("")

  const handleEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmail("")
  }

  return (
    <footer className="relative z-[2] bg-[#F5F5F7] border-t border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Link href="/" className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-gray-900">USDrop</span>
                <span className="text-2xl font-bold text-blue-600">AI</span>
              </Link>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              The all-in-one AI-powered platform for dropshipping. Research, build, and scale your store — all from one place.
            </p>

            <form onSubmit={handleEmailSubmit} className="max-w-sm">
              <p className="text-sm font-medium text-gray-900 mb-3">Stay in the loop</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-l-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                  data-testid="input-email-subscribe"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-r-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                  data-testid="button-subscribe"
                >
                  Subscribe
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {Object.values(footerLinks).map((section) => (
                <div key={section.title}>
                  <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
                          data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} USDrop AI. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="link-privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
