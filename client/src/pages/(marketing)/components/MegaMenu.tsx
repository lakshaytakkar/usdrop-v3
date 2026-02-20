import { Link } from "wouter"
import { useState, useRef, useEffect, useId } from "react"
import {
  TrendingUp,
  BarChart3,
  Store,
  Map,
  LayoutDashboard,
  Package,
  Video,
  GraduationCap,
  Newspaper,
  ShoppingBag,
  PenTool,
  Mail,
  Shield,
  Receipt,
  Calculator,
  Truck,
  ChevronDown,
  Sparkles,
} from "lucide-react"

interface MenuItem {
  title: string
  description: string
  href: string
  icon: React.ElementType
  isNew?: boolean
}

interface MenuCategory {
  label: string
  href?: string
  items?: MenuItem[]
  featured?: {
    title: string
    description: string
    image: string
    href: string
  }
}

const menuData: MenuCategory[] = [
  {
    label: "What is Dropshipping",
    href: "/what-is-dropshipping",
  },
  {
    label: "Research",
    items: [
      {
        title: "Winning Products",
        description: "Find trending products with real-time data",
        href: "/winning-products",
        icon: TrendingUp,
      },
      {
        title: "Winning Ads",
        description: "Discover top-performing ad creatives",
        href: "/meta-ads",
        icon: BarChart3,
        isNew: true,
      },
      {
        title: "Winning Stores",
        description: "Analyze successful competitor stores",
        href: "/competitor-stores",
        icon: Store,
      },
    ],
    featured: {
      title: "Live Research Data",
      description: "All research tools come with real-time data from top stores and ads worldwide.",
      image: "/images/menu/research.png",
      href: "/winning-products",
    },
  },
  {
    label: "Framework",
    items: [
      {
        title: "Journey Roadmap",
        description: "Your step-by-step dropshipping path",
        href: "/my-roadmap",
        icon: Map,
      },
      {
        title: "Live Dashboard",
        description: "Track orders and sales in real time",
        href: "/home",
        icon: LayoutDashboard,
      },
      {
        title: "Products Tracking",
        description: "Monitor your saved products & performance",
        href: "/my-products",
        icon: Package,
      },
    ],
    featured: {
      title: "Your Personal Hub",
      description: "Everything about your dropshipping journey — saved items, progress, and store overview.",
      image: "/images/menu/framework.png",
      href: "/home",
    },
  },
  {
    label: "Learning",
    items: [
      {
        title: "Live Sessions",
        description: "Join weekly live mentoring sessions",
        href: "/webinars",
        icon: Video,
        isNew: true,
      },
      {
        title: "Full Learning Modules",
        description: "Complete courses from beginner to pro",
        href: "/mentorship",
        icon: GraduationCap,
      },
      {
        title: "Blogs",
        description: "Tips, guides, and industry insights",
        href: "/blogs",
        icon: Newspaper,
      },
    ],
    featured: {
      title: "Learn & Grow",
      description: "From live sessions to full courses — everything you need to master dropshipping.",
      image: "/images/menu/learning.png",
      href: "/mentorship",
    },
  },
  {
    label: "Integrations",
    items: [
      {
        title: "Shopify",
        description: "Connect your Shopify store and manage everything",
        href: "/shopify-integration",
        icon: ShoppingBag,
      },
    ],
    featured: {
      title: "Seamless Connections",
      description: "Connect your store and manage products, orders, and inventory from one place.",
      image: "/images/menu/integrations.png",
      href: "/shopify-integration",
    },
  },
  {
    label: "Dropshipping Tools",
    items: [
      {
        title: "Description Generator",
        description: "AI-powered product descriptions",
        href: "/tools/description-generator",
        icon: PenTool,
      },
      {
        title: "Email Templates",
        description: "Ready-to-use email templates",
        href: "/tools/email-templates",
        icon: Mail,
      },
      {
        title: "Policy Generator",
        description: "Auto-generate store policies",
        href: "/tools/policy-generator",
        icon: Shield,
      },
      {
        title: "Invoice Generator",
        description: "Create professional invoices",
        href: "/tools/invoice-generator",
        icon: Receipt,
      },
      {
        title: "Profit Calculator",
        description: "Calculate margins and profits",
        href: "/tools/profit-calculator",
        icon: Calculator,
      },
      {
        title: "Shipping Calculator",
        description: "Estimate shipping costs worldwide",
        href: "/shipping-calculator",
        icon: Truck,
      },
    ],
    featured: {
      title: "All-in-One Toolkit",
      description: "Save hours with AI-powered tools built for dropshippers.",
      image: "/images/menu/tools.png",
      href: "/tools/description-generator",
    },
  },
  {
    label: "Fulfilment",
    items: [
      {
        title: "Order Fulfilment",
        description: "We handle packing and shipping from our warehouse",
        href: "/suppliers",
        icon: Package,
      },
      {
        title: "Fast Delivery",
        description: "Delivery to your customer in under 7 days",
        href: "/shipping-calculator",
        icon: Truck,
      },
    ],
    featured: {
      title: "We Ship For You",
      description: "From our warehouse to your customer's door — packing, handling, and delivery under 7 days.",
      image: "/images/menu/fulfilment.png",
      href: "/suppliers",
    },
  },
]

function NewBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide leading-none">
      <Sparkles className="size-2.5" />
      New
    </span>
  )
}

function DesktopDropdown({
  category,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  category: MenuCategory
  isOpen: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const panelId = useId()

  if (!category.items) {
    return (
      <Link
        href={category.href || "/"}
        className="text-[14px] text-black/80 font-medium hover:text-black transition-colors py-2 whitespace-nowrap"
        data-testid={`link-menu-${category.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {category.label}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="flex items-center gap-1 text-[14px] text-black/80 font-medium hover:text-black transition-colors py-2 whitespace-nowrap"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        data-testid={`button-menu-${category.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {category.label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={panelId}
        role="menu"
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div
          className="bg-white/95 border border-gray-200/60 rounded-2xl shadow-[0px_16px_40px_-8px_rgba(0,0,0,0.12),0px_4px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="flex">
            <div className="p-4 min-w-[240px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 mb-3 px-2">
                {category.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {category.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="group flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                      data-testid={`link-menu-item-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="mt-0.5 size-8 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="size-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-gray-900 group-hover:text-black">
                            {item.title}
                          </span>
                          {item.isNew && <NewBadge />}
                        </div>
                        <p className="text-[12px] text-gray-500 leading-tight mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {category.featured && (
              <div className="p-4 border-l border-gray-100 w-[240px]">
                <Link
                  href={category.featured.href}
                  role="menuitem"
                  className="block group"
                  data-testid={`link-featured-${category.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <img
                      src={category.featured.image}
                      alt={category.featured.title}
                      className="w-full h-[130px] object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[13px] font-semibold text-gray-900 group-hover:text-black">
                    {category.featured.title}
                  </p>
                  <p className="text-[12px] text-gray-500 leading-snug mt-1">
                    {category.featured.description}
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileAccordionItem({
  category,
  isOpen,
  onToggle,
  onClose,
}: {
  category: MenuCategory
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const panelId = useId()

  if (!category.items) {
    return (
      <Link
        href={category.href || "/"}
        className="text-[15px] text-black font-medium py-3 border-b border-gray-100 block"
        onClick={onClose}
        data-testid={`link-mobile-menu-${category.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {category.label}
      </Link>
    )
  }

  return (
    <div className="border-b border-gray-100">
      <button
        className="flex items-center justify-between w-full text-[15px] text-black font-medium py-3"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-testid={`button-mobile-menu-${category.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {category.label}
        <ChevronDown
          className={`size-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-[600px] opacity-100 pb-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 pl-1">
          {category.items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={onClose}
                data-testid={`link-mobile-item-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-gray-800">
                      {item.title}
                    </span>
                    {item.isNew && <NewBadge />}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function DesktopMegaMenu() {
  const [openDesktop, setOpenDesktop] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenDesktop(label)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDesktop(null)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <nav className="flex items-center gap-3 xl:gap-5" data-testid="nav-mega-menu-desktop">
      {menuData.map((category) => (
        <DesktopDropdown
          key={category.label}
          category={category}
          isOpen={openDesktop === category.label}
          onMouseEnter={() => handleMouseEnter(category.label)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </nav>
  )
}

export function MobileMegaMenu({ onClose }: { onClose: () => void }) {
  const [openMobile, setOpenMobile] = useState<string | null>(null)

  return (
    <div className="flex flex-col" data-testid="nav-mega-menu-mobile">
      {menuData.map((category) => (
        <MobileAccordionItem
          key={category.label}
          category={category}
          isOpen={openMobile === category.label}
          onToggle={() =>
            setOpenMobile(openMobile === category.label ? null : category.label)
          }
          onClose={() => {
            setOpenMobile(null)
            onClose()
          }}
        />
      ))}
    </div>
  )
}
