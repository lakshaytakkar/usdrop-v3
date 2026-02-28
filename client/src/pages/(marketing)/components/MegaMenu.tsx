import { Link } from "wouter"
import { useState, useRef, useEffect, useId } from "react"
import { ChevronDown } from "lucide-react"

interface MenuColumn {
  heading: string
  links: { title: string; href: string }[]
}

interface MenuCategory {
  label: string
  href?: string
  columns?: MenuColumn[]
}

const menuData: MenuCategory[] = [
  {
    label: "Products",
    columns: [
      {
        heading: "Research",
        links: [
          { title: "Winning Products", href: "/features/winning-products" },
          { title: "Winning Ads", href: "/features/winning-ads" },
          { title: "Winning Stores", href: "/features/winning-stores" },
        ],
      },
    ],
  },
  {
    label: "Platform",
    columns: [
      {
        heading: "Tools",
        links: [
          { title: "Dashboard", href: "/features/dashboard" },
          { title: "Fulfilment", href: "/features/fulfilment" },
          { title: "Shopify", href: "/shopify" },
        ],
      },
    ],
  },
  {
    label: "Learn",
    columns: [
      {
        heading: "Resources",
        links: [
          { title: "Full Courses", href: "/features/courses" },
          { title: "Live Sessions", href: "/features/live-sessions" },
          { title: "What is Dropshipping", href: "/what-is-dropshipping" },
        ],
      },
    ],
  },
  {
    label: "LLC",
    href: "/llc",
  },
  {
    label: "Free Learning",
    href: "/free-learning",
  },
]

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

  if (!category.columns) {
    return (
      <Link
        href={category.href || "/"}
        className="text-[14px] text-black/70 font-medium hover:text-black transition-colors py-2 whitespace-nowrap"
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
        className="flex items-center gap-1 text-[14px] text-black/70 font-medium hover:text-black transition-colors py-2 whitespace-nowrap"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        data-testid={`button-menu-${category.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {category.label}
        <ChevronDown
          className={`size-3.5 opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={panelId}
        role="menu"
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
          <div className="flex gap-10 px-6 py-5">
            {category.columns.map((col) => (
              <div key={col.heading} className="min-w-[160px]">
                <p className="text-[12px] font-medium text-black/40 mb-3 tracking-wide">
                  {col.heading}
                </p>
                <div className="flex flex-col gap-0.5">
                  {col.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="text-[14px] text-black/80 hover:text-black py-1.5 transition-colors whitespace-nowrap"
                      data-testid={`link-menu-item-${link.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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

  if (!category.columns) {
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
        {category.columns.map((col) => (
          <div key={col.heading} className="pl-1 mb-2">
            <p className="text-[11px] font-medium text-black/40 mb-1 px-3 tracking-wide">
              {col.heading}
            </p>
            <div className="flex flex-col">
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] text-black/80 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={onClose}
                  data-testid={`link-mobile-item-${link.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
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
    <nav className="flex items-center gap-6" data-testid="nav-mega-menu-desktop">
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
