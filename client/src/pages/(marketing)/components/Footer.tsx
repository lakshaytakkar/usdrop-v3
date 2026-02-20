
import { Link } from "wouter"
import { ChevronDown, ArrowRight } from "lucide-react"
import { FormEvent, useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmail("")
  }

  return (
    <footer className="bg-[#F4F2F1]">
      {/* Top Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16">
          {/* Left Side - Logo & Email Form */}
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-bold text-black">USDrop</span>
              <span className="text-2xl font-bold text-black">AI</span>
            </Link>

            {/* Tagline */}
            <h3 className="text-lg font-semibold text-black mb-2">
              Stay connected with USDrop AI
            </h3>
            <p className="text-sm text-[#555555] mb-6 leading-relaxed">
              Get smart updates & tips—delivered fresh to your inbox.
            </p>

            {/* Email Subscription Form */}
            <form onSubmit={handleEmailSubmit} className="flex">
              <div className="flex items-center bg-white rounded-full border border-[#E5E5E5] overflow-hidden flex-1">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-3 text-sm placeholder-[#999999] focus:outline-none bg-white"
                  required
                  data-testid="input-email-subscribe"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 font-medium text-sm flex items-center gap-2 hover:bg-black/90 transition-colors duration-200"
                  data-testid="button-subscribe"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Link Columns */}
          <div className="grid grid-cols-3 gap-8">
            {/* Pages Column 1 */}
            <div>
              <h4 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">
                Pages
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#how-it-works"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-how-it-works"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#features"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-features"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#why-choose-us"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-why-choose-us"
                  >
                    Why Choose Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#testimonials"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-testimonials"
                  >
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            {/* Pages Column 2 */}
            <div>
              <h4 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">
                Pages
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-contact-us"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-blogs"
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Column */}
            <div>
              <h4 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">
                Social
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://instagram.com"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-instagram"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://linkedin.com"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-linkedin"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://twitter.com"
                    className="text-sm text-[#555555] hover:text-black transition-colors duration-200"
                    data-testid="link-twitter"
                  >
                    Twitter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E0E0E0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left - Copyright & Manage Cookies */}
          <p className="text-xs text-[#555555]">
            USDrop © 2024-2026{" "}
            <Link
              href="/cookies"
              className="text-[#555555] hover:text-black transition-colors duration-200 font-medium"
              data-testid="link-manage-cookies"
            >
              Manage Cookies
            </Link>
          </p>

          {/* Right - Language Selector */}
          <div className="flex items-center gap-2 text-xs text-[#555555]">
            <span>English</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  )
}
