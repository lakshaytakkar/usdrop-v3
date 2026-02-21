import { Link } from "wouter"
import { useState, useRef, useEffect, useId } from "react"
import { ChevronDown, Sparkles } from "lucide-react"

interface MenuItem {
  title: string
  href: string
  icon3d: string
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
        href: "/features/winning-products",
        icon3d: "/images/menu/icons/winning-products.png",
      },
      {
        title: "Winning Ads",
        href: "/features/winning-ads",
        icon3d: "/images/menu/icons/winning-ads.png",
        isNew: true,
      },
      {
        title: "Winning Stores",
        href: "/features/winning-stores",
        icon3d: "/images/menu/icons/winning-stores.png",
      },
    ],
    featured: {
      title: "Live Research Data",
      description: "Real-time data from top stores and ads worldwide.",
      image: "/images/menu/research.png",
      href: "/features/winning-products",
    },
  },
  {
    label: "Framework",
    items: [
      {
        title: "Journey Roadmap",
        href: "/features/roadmap",
        icon3d: "/images/menu/icons/journey-roadmap.png",
      },
      {
        title: "Live Dashboard",
        href: "/features/dashboard",
        icon3d: "/images/menu/icons/live-dashboard.png",
      },
      {
        title: "Products Tracking",
        href: "/features/products-tracking",
        icon3d: "/images/menu/icons/products-tracking.png",
      },
    ],
    featured: {
      title: "Your Personal Hub",
      description: "Saved items, progress, and store overview.",
      image: "/images/menu/framework.png",
      href: "/features/dashboard",
    },
  },
  {
    label: "Learning",
    items: [
      {
        title: "Live Sessions",
        href: "/features/live-sessions",
        icon3d: "/images/menu/icons/live-sessions.png",
        isNew: true,
      },
      {
        title: "Full Courses",
        href: "/features/courses",
        icon3d: "/images/menu/icons/learning-modules.png",
      },
      {
        title: "Blogs",
        href: "/features/blog",
        icon3d: "/images/menu/icons/blogs.png",
      },
    ],
    featured: {
      title: "Learn & Grow",
      description: "Live sessions to full courses — master dropshipping.",
      image: "/images/menu/learning.png",
      href: "/features/courses",
    },
  },
  {
    label: "Integrations",
    items: [
      {
        title: "Shopify",
        href: "/shopify",
        icon3d: "/images/menu/icons/shopify.png",
      },
    ],
    featured: {
      title: "Seamless Connections",
      description: "Connect your store and manage everything from one place.",
      image: "/images/menu/integrations.png",
      href: "/shopify",
    },
  },
  {
    label: "Dropshipping Tools",
    items: [
      {
        title: "Description Generator",
        href: "/features/description-generator",
        icon3d: "/images/menu/icons/description-generator.png",
      },
      {
        title: "Email Templates",
        href: "/features/email-templates",
        icon3d: "/images/menu/icons/email-templates.png",
      },
      {
        title: "Policy Generator",
        href: "/features/policy-generator",
        icon3d: "/images/menu/icons/policy-generator.png",
      },
      {
        title: "Invoice Generator",
        href: "/features/invoice-generator",
        icon3d: "/images/menu/icons/invoice-generator.png",
      },
      {
        title: "Profit Calculator",
        href: "/features/profit-calculator",
        icon3d: "/images/menu/icons/profit-calculator.png",
      },
      {
        title: "Shipping Calculator",
        href: "/features/shipping-calculator",
        icon3d: "/images/menu/icons/shipping-calculator.png",
      },
    ],
    featured: {
      title: "All-in-One Toolkit",
      description: "AI-powered tools built for dropshippers.",
      image: "/images/menu/tools.png",
      href: "/features/description-generator",
    },
  },
  {
    label: "Fulfilment",
    items: [
      {
        title: "Order Fulfilment",
        href: "/features/fulfilment",
        icon3d: "/images/menu/icons/order-fulfilment.png",
      },
      {
        title: "Fast Delivery",
        href: "/features/shipping-calculator",
        icon3d: "/images/menu/icons/fast-delivery.png",
      },
    ],
    featured: {
      title: "We Ship For You",
      description: "Packing, handling, and delivery under 7 days.",
      image: "/images/menu/fulfilment.png",
      href: "/features/fulfilment",
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
        className="text-[14px] text-black/80 font-semibold hover:text-black transition-colors py-2 whitespace-nowrap"
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
        className="flex items-center gap-1 text-[14px] text-black/80 font-semibold hover:text-black transition-colors py-2 whitespace-nowrap"
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
            <div className="p-4 min-w-[220px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 mb-3 px-2">
                {category.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {category.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="group flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    data-testid={`link-menu-item-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <img
                      src={item.icon3d}
                      alt=""
                      className="size-9 object-contain shrink-0"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-gray-900 group-hover:text-black">
                        {item.title}
                      </span>
                      {item.isNew && <NewBadge />}
                    </div>
                  </Link>
                ))}
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
                      decoding="async"
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
        className="text-[15px] text-black font-semibold py-3 border-b border-gray-100 block"
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
        className="flex items-center justify-between w-full text-[15px] text-black font-semibold py-3"
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
          {category.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={onClose}
              data-testid={`link-mobile-item-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <img
                src={item.icon3d}
                alt=""
                className="size-9 object-contain shrink-0"
              />
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-gray-800">
                  {item.title}
                </span>
                {item.isNew && <NewBadge />}
              </div>
            </Link>
          ))}
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
