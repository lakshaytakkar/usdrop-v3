import { useState, useMemo } from "react"
import { format } from "date-fns"
import { FrameworkBanner } from "@/components/framework-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, ExternalLink, Search, ChevronDown, ChevronRight, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { LockOverlay } from "@/components/ui/lock-overlay"
import { ButtonSpinner } from "@/components/ui/blue-spinner"

interface Session {
  id: string
  title: string
  description: string
  url: string
  date: Date
  duration: string
  category: string
}

const mentorAttribution = ": by Mr. Suprans (Dropshipping Expert - 14 years experience)"

const sessions: Session[] = [
  { id: "session-001", title: "Onboarding Process and Framework Flow Training", description: "Master the complete onboarding process and framework flow for dropshipping success.", url: "https://drive.google.com/file/d/1W2FCbId6yjCD2y0N2aDn25dasmP8mxJ1/view?usp=drive_link", date: new Date(2025, 0, 5, 10, 0), duration: "90 min", category: "Foundation & Onboarding" },
  { id: "session-002", title: "USA Dropshipping Foundation: Part 02", description: "Deep dive into the fundamentals of USA dropshipping.", url: "https://drive.google.com/file/d/1UIhtfvNebnIolKdHOGlsa56_20oAr2k-/view?usp=drive_link", date: new Date(2025, 0, 8, 14, 0), duration: "75 min", category: "Foundation & Onboarding" },
  { id: "session-003", title: "USA Dropshipping Foundation: Part 03", description: "Continue building your USA dropshipping foundation.", url: "https://drive.google.com/file/d/1URhfv8Klx95DaLlSuQByvVsTn_vAKJzN/view?usp=drive_link", date: new Date(2025, 0, 10, 15, 0), duration: "75 min", category: "Foundation & Onboarding" },
  { id: "session-004", title: "USA Dropshipping Foundation: Part 04", description: "Critical aspects of USA dropshipping business development.", url: "https://drive.google.com/file/d/1UT1B5-Oi8paBXUvXgKMWiFPIgVCYRMwz/view?usp=drive_link", date: new Date(2025, 0, 12, 11, 0), duration: "75 min", category: "Foundation & Onboarding" },
  { id: "session-005", title: "USA Dropshipping Foundation: Part 05", description: "Complete your understanding of USA dropshipping fundamentals.", url: "https://drive.google.com/file/d/1UX5nrKDl2sQ48UBIEXUmzk44BTr_YrJ8/view?usp=drive_link", date: new Date(2025, 0, 15, 14, 0), duration: "75 min", category: "Foundation & Onboarding" },
  { id: "session-006", title: "Complete Agenda and Startup Approach", description: "Step-by-step approach to launching your USA dropshipping business.", url: "https://drive.google.com/file/d/1kVn5cqjZ4-IOFuVIsYerzcStlt7-vRh5/view?usp=drive_link", date: new Date(2025, 0, 18, 10, 0), duration: "60 min", category: "Foundation & Onboarding" },
  { id: "session-007", title: "Market Overview and Motivation", description: "Understand the vast opportunities in USA dropshipping.", url: "https://drive.google.com/file/d/1Qx7YosjxGnJj8AvUHMJiMoWrwu6yJnkt/view?usp=drive_link", date: new Date(2025, 0, 20, 16, 0), duration: "60 min", category: "Foundation & Onboarding" },
  { id: "session-008", title: "Investment Requirements and LLC Formation", description: "Investment requirements and LLC formation for your business.", url: "https://drive.google.com/file/d/1aK2uqj64xRPaeN1QymNpP55_QBk86_CV/view?usp=drive_link", date: new Date(2025, 0, 22, 13, 0), duration: "75 min", category: "Foundation & Onboarding" },
  { id: "session-009", title: "Strategies of the Top 0.01%", description: "Exclusive session revealing elite dropshipping strategies.", url: "https://drive.google.com/file/d/1P-KncuomziF5iKeu-HPXP2OlrQ2NrxQI/view?usp=drive_link", date: new Date(2025, 0, 25, 15, 0), duration: "90 min", category: "Strategy & Mentorship" },
  { id: "session-010", title: "Learning from Top 30 Clients", description: "Proven frameworks used by the top 30 mentorship clients.", url: "https://drive.google.com/file/d/1kVn5cqjZ4-IOFuVIsYerzcStlt7-vRh5/view?usp=sharing", date: new Date(2025, 0, 28, 11, 0), duration: "90 min", category: "Strategy & Mentorship" },
  { id: "session-011", title: "Product Research: Trend Analysis and Tools", description: "Master tools and techniques for identifying trending products.", url: "https://drive.google.com/file/d/1aXGfmbBGpdacOzdbrUinPshUzipUWY-6/view?usp=sharing", date: new Date(2025, 1, 2, 14, 0), duration: "75 min", category: "Product Research" },
  { id: "session-012", title: "Research Tools: Minea and Niche Selection", description: "Deep dive into Minea and advanced niche selection strategies.", url: "https://drive.google.com/file/d/1b5Ddw-YAohXLu_Qz6v6nVJ0ZCpK9Hmsb/view?usp=sharing", date: new Date(2025, 1, 5, 10, 0), duration: "75 min", category: "Product Research" },
  { id: "session-013", title: "Product Selection Mastery: Part 01", description: "Fundamentals of choosing winning products.", url: "https://drive.google.com/file/d/1f3mEWrmFJDba7aCP1u-zOk3f6Smbuq4F/view?usp=drive_link", date: new Date(2025, 1, 8, 15, 0), duration: "75 min", category: "Product Research" },
  { id: "session-014", title: "Product Selection Mastery: Part 02", description: "Advanced product selection strategies and techniques.", url: "https://drive.google.com/file/d/1f3pRj_tIfiM5t4R_EntjIWmDDMBWl4Px/view?usp=drive_link", date: new Date(2025, 1, 10, 11, 0), duration: "75 min", category: "Product Research" },
  { id: "session-015", title: "Product Selection Mastery: Part 03", description: "Advanced techniques and market analysis.", url: "https://drive.google.com/file/d/1hgk_BvLr6lKWDQNNRU-9H_WOnJ-kXQQY/view?usp=drive_link", date: new Date(2025, 1, 12, 14, 0), duration: "75 min", category: "Product Research" },
  { id: "session-016", title: "Product Selection Mastery: Part 04", description: "Detailed analysis and case studies.", url: "https://drive.google.com/file/d/1fhEhmQwx4b1Noia6t31M0YoPvYtFqayj/view?usp=drive_link", date: new Date(2025, 1, 15, 16, 0), duration: "75 min", category: "Product Research" },
  { id: "session-017", title: "Product Selection Mastery: Part 05", description: "Advanced selection and scaling techniques.", url: "https://drive.google.com/file/d/188YRid9B73Pgr-qFSkGJ10YM2_bkfLY5/view?usp=drive_link", date: new Date(2025, 1, 18, 10, 0), duration: "75 min", category: "Product Research" },
  { id: "session-018", title: "Product Selection Mastery: Part 06 - Advanced Tools", description: "Latest tools and updated methodologies.", url: "https://drive.google.com/file/d/1NlA1gXmXiTbvhl0rr_-TI52l-OJHBaQG/view?usp=drive_link", date: new Date(2025, 1, 20, 13, 0), duration: "75 min", category: "Product Research" },
  { id: "session-019", title: "Product Selection Mastery: Part 07", description: "Advanced case studies and real-world applications.", url: "https://drive.google.com/file/d/1sfUfzNO8woLOtPS11TOJT5z_D9-6fdJ4/view?usp=drive_link", date: new Date(2025, 1, 22, 15, 0), duration: "75 min", category: "Product Research" },
  { id: "session-020", title: "Product Selection Mastery: Part 08", description: "Portfolio building and optimization.", url: "https://drive.google.com/file/d/199BgSabiqM2FbjmI_CzlZ1y4blNPoXit/view?usp=drive_link", date: new Date(2025, 1, 25, 11, 0), duration: "75 min", category: "Product Research" },
  { id: "session-021", title: "Advanced Product Research Mentorship", description: "Exclusive session on advanced research methodologies.", url: "https://drive.google.com/file/d/19L5RgrmPY6Nx1bfYsKp9o4CHJk4yZZv9/view?usp=drive_link", date: new Date(2025, 1, 28, 14, 0), duration: "90 min", category: "Strategy & Mentorship" },
  { id: "session-022", title: "Product Research Methodology: Part 01", description: "Systematic approaches to product discovery.", url: "https://drive.google.com/file/d/12e0g798OyfbY2Iohe7r1Ek0KZTutLytU/view?usp=drive_link", date: new Date(2025, 1, 28, 16, 0), duration: "75 min", category: "Product Research" },
  { id: "session-023", title: "Product Sourcing: Complete Guide", description: "Complete guide to sourcing products for USA dropshipping.", url: "https://drive.google.com/file/d/1Aol_1py7Bk8Cd1iiTq0xVnKH2gjBpBVV/view?usp=drive_link", date: new Date(2025, 2, 3, 10, 0), duration: "75 min", category: "Sourcing & Suppliers" },
  { id: "session-024", title: "USA Local Suppliers and Marketplace Integration", description: "Domestic suppliers for faster shipping and better quality.", url: "https://drive.google.com/file/d/1zk7yuCHHI0kYlectp4hgNWjvNRiRkUdO/view?usp=sharing", date: new Date(2025, 2, 5, 14, 0), duration: "75 min", category: "Sourcing & Suppliers" },
  { id: "session-025", title: "AI-Powered Supplier Sourcing and Automation", description: "Using AI tools for efficient supplier sourcing.", url: "https://drive.google.com/file/d/1h2mt7Cat-2QVWw7dvOzFHfD0QZFNBPoG/view?usp=sharing", date: new Date(2025, 2, 8, 11, 0), duration: "75 min", category: "Sourcing & Suppliers" },
  { id: "session-026", title: "Chinese Supplier Options for Dropshipping", description: "When and how to use Chinese suppliers effectively.", url: "https://drive.google.com/file/d/13sYa-JQmnyUl9ifweHqZrL75YvB2yVoF/view?usp=drive_link", date: new Date(2025, 2, 10, 15, 0), duration: "75 min", category: "Sourcing & Suppliers" },
  { id: "session-027", title: "Chinese Sourcing and Private Warehouse Operations", description: "Advanced sourcing and warehouse management.", url: "https://drive.google.com/file/d/1TzJ8pLx57y3_s7Vns-YF3SWVHnNJiIJv/view?usp=drive_link", date: new Date(2025, 2, 12, 13, 0), duration: "90 min", category: "Sourcing & Suppliers" },
  { id: "session-028", title: "1688 Platform Sourcing", description: "Master the 1688 platform for product sourcing.", url: "https://drive.google.com/file/d/1UEL3yzQa3txz81Uqi4nPlRAUnsJCVKNv/view?usp=drive_link", date: new Date(2025, 2, 15, 10, 0), duration: "75 min", category: "Sourcing & Suppliers" },
  { id: "session-029", title: "Product Sourcing and Meta Ads Integration", description: "Combine sourcing strategies with Meta Ads.", url: "https://drive.google.com/file/d/1UdWtytsepQ6s6O1DDhQKphiSEmjjRqEg/view?usp=drive_link", date: new Date(2025, 2, 18, 14, 0), duration: "90 min", category: "Sourcing & Suppliers" },
  { id: "session-030", title: "UTU Ecosystem: Product Sourcing", description: "UTU ecosystem and integrated sourcing tools.", url: "https://drive.google.com/file/d/1MKdMxXKhLS6jsKL0-PyK19IffVR5hXUY/view?usp=drive_link", date: new Date(2025, 2, 20, 16, 0), duration: "75 min", category: "Sourcing & Suppliers" },
  { id: "session-031", title: "CJ Dropshipping, Zen Drop, and Meta Ads", description: "Integrating CJ Dropshipping and Zen Drop with Meta Ads.", url: "https://drive.google.com/file/d/1piKAnO9VzzVqPA-rXS7u-EyXY0SmQqDK/view?usp=drive_link", date: new Date(2025, 2, 22, 11, 0), duration: "90 min", category: "Sourcing & Suppliers" },
  { id: "session-032", title: "Top 25 Products for USA Dropshipping: Part 01", description: "Best performing products in USA dropshipping markets.", url: "https://drive.google.com/file/d/1jwHOqyvtByJPLZZomHZ_No6a2XwqdUAz/view?usp=drive_link", date: new Date(2025, 2, 25, 15, 0), duration: "75 min", category: "Product Research" },
  { id: "session-033", title: "Top 25 Products for USA Dropshipping: Part 02", description: "More winning products and market insights.", url: "https://drive.google.com/file/d/19MYc6qcDxH7gQ9I1U-Lw8fD1kfuq4Brj/view?usp=drive_link", date: new Date(2025, 2, 27, 13, 0), duration: "75 min", category: "Product Research" },
  { id: "session-034", title: "Top 300 Selling Products: Comprehensive List", description: "Extensive analysis of top 300 products.", url: "https://drive.google.com/file/d/1U-ow3jwSyf6nYBkC-1c5U52j78e4R4-u/view?usp=drive_link", date: new Date(2025, 2, 28, 10, 0), duration: "90 min", category: "Product Research" },
  { id: "session-035", title: "Meta Ads Campaign Strategy: C1 & C2 Mastery", description: "Master Campaign 1 and Campaign 2 strategies.", url: "https://drive.google.com/file/d/1ScLTeCcDdXP1PYhAw-gE4fjVJSgENGQD/view?usp=sharing", date: new Date(2025, 3, 2, 14, 0), duration: "75 min", category: "Meta Ads" },
  { id: "session-036", title: "Meta Ads Ad Set Testing: Systematic Approach", description: "Systematic ad set testing methodologies.", url: "https://drive.google.com/file/d/1zab7M3c-5eDtht1_2mKcxn79y4Knmn3i/view?usp=drive_link", date: new Date(2025, 3, 5, 11, 0), duration: "75 min", category: "Meta Ads" },
  { id: "session-037", title: "Meta Ads Research Framework", description: "Advanced research framework and methodologies.", url: "https://drive.google.com/file/d/1R2_8fppN1-PqI7g9ycfZ_YbNvDB_MwY1/view?usp=drive_link", date: new Date(2025, 3, 8, 15, 0), duration: "90 min", category: "Meta Ads" },
  { id: "session-038", title: "Meta Ads: Control, Matrix Analysis, and Personas", description: "Advanced controlling, matrix analysis, and persona targeting.", url: "https://drive.google.com/file/d/1VhVU05PEa0BCyfY1F8yXXKxXxCvrdqjm/view?usp=sharing", date: new Date(2025, 3, 10, 13, 0), duration: "90 min", category: "Meta Ads" },
  { id: "session-039", title: "Meta Ads ABO: Budget Optimization", description: "Ad Set Budget Optimization for better performance.", url: "https://drive.google.com/file/d/1ScLTeCcDdXP1PYhAw-gE4fjVJSgENGQD/view?usp=sharing", date: new Date(2025, 3, 12, 15, 0), duration: "75 min", category: "Meta Ads" },
  { id: "session-040", title: "Meta Ads Automation: Scaling Strategies", description: "Advanced automation and scaling techniques.", url: "https://drive.google.com/file/d/1ScLTeCcDdXP1PYhAw-gE4fjVJSgENGQD/view?usp=sharing", date: new Date(2025, 3, 15, 14, 0), duration: "90 min", category: "Meta Ads" },
]

const CATEGORY_ORDER = [
  "Foundation & Onboarding",
  "Strategy & Mentorship",
  "Product Research",
  "Sourcing & Suppliers",
  "Meta Ads",
]

const CATEGORY_COLORS: Record<string, string> = {
  "Foundation & Onboarding": "bg-blue-50 text-blue-700 border-blue-200",
  "Strategy & Mentorship": "bg-purple-50 text-purple-700 border-purple-200",
  "Product Research": "bg-green-50 text-green-700 border-green-200",
  "Sourcing & Suppliers": "bg-orange-50 text-orange-700 border-orange-200",
  "Meta Ads": "bg-pink-50 text-pink-700 border-pink-200",
}

export default function MySessionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CATEGORY_ORDER))
  const [openingId, setOpeningId] = useState<string | null>(null)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      if (selectedCategory && s.category !== selectedCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      }
      return true
    })
  }, [searchQuery, selectedCategory])

  const grouped = useMemo(() => {
    const map: Record<string, Session[]> = {}
    for (const s of filtered) {
      if (!map[s.category]) map[s.category] = []
      map[s.category].push(s)
    }
    return CATEGORY_ORDER.filter(c => map[c]).map(c => ({ category: c, sessions: map[c] }))
  }, [filtered])

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const handleWatch = (session: Session) => {
    if (isFree) {
      setIsUpsellOpen(true)
      return
    }
    setOpeningId(session.id)
    window.open(session.url, "_blank", "noopener,noreferrer")
    setTimeout(() => setOpeningId(null), 600)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2" data-testid="page-my-sessions">
      <FrameworkBanner
        title="My Sessions"
        description="Recorded live strategy sessions with expert mentorship"
        iconSrc="/3d-ecom-icons-blue/Webinar_Video.png"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 h-9 px-3 rounded-lg border border-gray-200 bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            data-testid="input-search-sessions"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer",
              !selectedCategory
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            )}
            data-testid="filter-all"
          >
            All ({sessions.length})
          </button>
          {CATEGORY_ORDER.map(cat => {
            const count = sessions.filter(s => s.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer",
                  selectedCategory === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                )}
                data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3 pb-6">
        {grouped.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-muted-foreground">No sessions found</p>
            </CardContent>
          </Card>
        )}

        {grouped.map(({ category, sessions: catSessions }) => {
          const isExpanded = expandedCategories.has(category)
          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-2 w-full text-left mb-2 group cursor-pointer"
                data-testid={`toggle-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-semibold text-gray-700">{category}</span>
                <Badge variant="secondary" className={cn("text-[10px] px-2 py-0 border", CATEGORY_COLORS[category])}>
                  {catSessions.length} sessions
                </Badge>
              </button>

              {isExpanded && (
                <div className="space-y-1.5 ml-6">
                  {catSessions.map((session, idx) => (
                    <div
                      key={session.id}
                      className="relative group flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                      data-testid={`session-${session.id}`}
                    >
                      <div className="flex-shrink-0 flex flex-col items-center justify-center leading-none" data-testid={`date-${session.id}`}>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[22px] font-bold text-gray-800">{format(session.date, "d")}</span>
                          <span className="text-[13px] font-semibold text-gray-500 uppercase">{format(session.date, "MMM")}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">{format(session.date, "yyyy")}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" data-testid={`text-title-${session.id}`}>
                          {session.title}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {session.duration}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => handleWatch(session)}
                          disabled={openingId === session.id}
                          className={cn(
                            "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-all cursor-pointer",
                            "bg-blue-600 text-white hover:bg-blue-700",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                          )}
                          data-testid={`button-watch-${session.id}`}
                        >
                          {openingId === session.id ? (
                            <ButtonSpinner className="text-white" />
                          ) : (
                            <>
                              <Play className="h-3 w-3" />
                              Watch
                            </>
                          )}
                        </button>
                        {isFree && (
                          <LockOverlay
                            onClick={() => setIsUpsellOpen(true)}
                            variant="button"
                            size="sm"
                            className="rounded-md"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <UpsellDialog
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
      />
    </div>
  )
}
