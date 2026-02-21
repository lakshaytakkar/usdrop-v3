import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  List,
  Image,
  Film,
  Layers,
  Globe,
  Calendar,
  Eye,
  Activity,
  Tag,
  Languages,
  MapPin,
  Flower2,
  Flame,
  Rocket,
  Crown,
  Trophy,
} from "lucide-react"
import { AdCard } from "./components/ad-card"
import { AdDetailSheet } from "./components/ad-detail-sheet"
import {
  MetaAd,
  sampleAds,
  quickFilterOptions,
  mediaTypeOptions,
  statusOptions,
  regionOptions,
  categoryOptions,
  languageOptions,
  countryOptions,
  impressionOptions,
} from "./data/ads"
import { cn } from "@/lib/utils"

const quickFilterIconMap: Record<string, any> = {
  flower: Flower2,
  flame: Flame,
  rocket: Rocket,
  crown: Crown,
  trophy: Trophy,
}

function FilterSection({
  label,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  label: string
  icon: any
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1.5 cursor-pointer ds-label"
      >
        <span className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-gray-400" />
          {label}
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-1.5 space-y-0.5">{children}</div>}
    </div>
  )
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[13px] transition-colors cursor-pointer",
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-50"
      )}
    >
      <div
        className={cn(
          "w-3 h-3 rounded-sm border-[1.5px] flex-shrink-0 flex items-center justify-center",
          active ? "border-blue-500 bg-blue-500" : "border-gray-300"
        )}
      >
        {active && (
          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </button>
  )
}

function FilterSidebar({
  filters,
  setFilter,
  onReset,
}: {
  filters: FilterState
  setFilter: (key: keyof FilterState, value: string) => void
  onReset: () => void
}) {
  return (
    <aside className="w-[220px] shrink-0 hidden lg:block border-r border-gray-200/60 bg-white/50 backdrop-blur-sm overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 ds-label">
            <Filter className="h-4 w-4" />
            Filters
          </div>
        </div>

        <div className="space-y-3">
          <FilterSection label="Media types" icon={Image} defaultOpen>
            {mediaTypeOptions.map((opt) => (
              <FilterOption
                key={opt}
                label={opt}
                active={filters.mediaType === opt.toLowerCase()}
                onClick={() => setFilter("mediaType", opt.toLowerCase())}
              />
            ))}
          </FilterSection>

          <div className="border-t border-gray-100" />

          <FilterSection label="Status" icon={Activity}>
            {statusOptions.map((opt) => (
              <FilterOption
                key={opt}
                label={opt}
                active={filters.status === opt.toLowerCase()}
                onClick={() => setFilter("status", opt.toLowerCase())}
              />
            ))}
          </FilterSection>

          <div className="border-t border-gray-100" />

          <FilterSection label="Impression Level" icon={Eye}>
            {impressionOptions.map((opt) => (
              <FilterOption
                key={opt}
                label={opt}
                active={filters.impressionLevel === opt.toLowerCase()}
                onClick={() => setFilter("impressionLevel", opt.toLowerCase())}
              />
            ))}
          </FilterSection>

          <div className="border-t border-gray-100" />

          <FilterSection label="Languages" icon={Languages}>
            {languageOptions.map((opt) => (
              <FilterOption
                key={opt}
                label={opt}
                active={filters.language === opt.toLowerCase()}
                onClick={() => setFilter("language", opt.toLowerCase())}
              />
            ))}
          </FilterSection>

          <div className="border-t border-gray-100" />

          <FilterSection label="Countries" icon={MapPin}>
            {countryOptions.map((opt) => (
              <FilterOption
                key={opt}
                label={opt}
                active={filters.country === opt.toLowerCase()}
                onClick={() => setFilter("country", opt.toLowerCase())}
              />
            ))}
          </FilterSection>

          <div className="border-t border-gray-100" />

          <FilterSection label="Category" icon={Tag}>
            {categoryOptions.map((opt) => (
              <FilterOption
                key={opt}
                label={opt}
                active={filters.category === opt.toLowerCase()}
                onClick={() => setFilter("category", opt.toLowerCase())}
              />
            ))}
          </FilterSection>

          <div className="border-t border-gray-100" />

          <FilterSection label="Region" icon={Globe}>
            {regionOptions.map((opt) => (
              <FilterOption
                key={opt}
                label={opt}
                active={filters.region === opt.toLowerCase()}
                onClick={() => setFilter("region", opt.toLowerCase())}
              />
            ))}
          </FilterSection>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs cursor-pointer"
            onClick={onReset}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset All Filters
          </Button>
        </div>
      </div>
    </aside>
  )
}

interface FilterState {
  mediaType: string
  status: string
  impressionLevel: string
  language: string
  country: string
  category: string
  region: string
}

const defaultFilters: FilterState = {
  mediaType: "all",
  status: "all",
  impressionLevel: "all",
  language: "all",
  country: "all",
  category: "all",
  region: "all",
}

export default function MetaAdsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("publication")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null)
  const [selectedAd, setSelectedAd] = useState<MetaAd | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPerPage, setShowPerPage] = useState("one")

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    setActiveQuickFilter(null)
    setSearchQuery("")
  }

  const filteredAds = useMemo(() => {
    return sampleAds.filter((ad) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        ad.advertiserName.toLowerCase().includes(q) ||
        ad.category.toLowerCase().includes(q) ||
        ad.adLink.toLowerCase().includes(q)

      const matchesMedia =
        filters.mediaType === "all" || ad.mediaType === filters.mediaType
      const matchesStatus =
        filters.status === "all" || ad.status === filters.status
      const matchesImpression =
        filters.impressionLevel === "all" ||
        ad.impressionLevel === filters.impressionLevel
      const matchesLanguage =
        filters.language === "all" ||
        ad.language.toLowerCase() === filters.language
      const matchesCountry =
        filters.country === "all" ||
        ad.country.toLowerCase() === filters.country
      const matchesCategory =
        filters.category === "all" ||
        ad.category.toLowerCase() === filters.category
      const matchesRegion =
        filters.region === "all" ||
        ad.region.toLowerCase() === filters.region

      return (
        matchesSearch &&
        matchesMedia &&
        matchesStatus &&
        matchesImpression &&
        matchesLanguage &&
        matchesCountry &&
        matchesCategory &&
        matchesRegion
      )
    })
  }, [searchQuery, filters])

  const handleAdClick = (ad: MetaAd) => {
    setSelectedAd(ad)
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
    setSelectedAd(null)
  }

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "all"
  ).length

  return (
    <>
      <div className="flex flex-1 flex-col gap-0 relative">
        <div className="flex flex-1 min-h-0">
          <FilterSidebar
            filters={filters}
            setFilter={setFilter}
            onReset={resetFilters}
          />

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/60 px-5 py-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search advertisers, categories, links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    data-testid="input-search-ads"
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[170px] h-10 bg-white text-sm" data-testid="select-sort-ads">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">↕</span>
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publication">Publication date</SelectItem>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="active-ads">Active ads count</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-10 w-10 flex items-center justify-center transition-colors cursor-pointer",
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-50"
                    )}
                    data-testid="button-view-grid"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "h-10 w-10 flex items-center justify-center transition-colors cursor-pointer border-l border-gray-200",
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-50"
                    )}
                    data-testid="button-view-list"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {quickFilterOptions.map((qf) => (
                  <button
                    key={qf.label}
                    onClick={() =>
                      setActiveQuickFilter(
                        activeQuickFilter === qf.label ? null : qf.label
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-medium transition-all cursor-pointer border",
                      activeQuickFilter === qf.label
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                    data-testid={`button-quickfilter-${qf.label.replace(/\s/g, "-").toLowerCase()}`}
                  >
                    {(() => { const QfIcon = quickFilterIconMap[qf.icon]; return QfIcon ? <QfIcon className="h-3.5 w-3.5" /> : null })()}
                    <span>{qf.label}</span>
                  </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                  <Select value={showPerPage} onValueChange={setShowPerPage}>
                    <SelectTrigger className="h-8 w-[180px] text-[12px] bg-white border-gray-200">
                      <SelectValue placeholder="Show" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one">Show one ad per page</SelectItem>
                      <SelectItem value="multiple">Show all ads per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-gray-600">
                    Filtering Conditions
                  </span>
                  {Object.entries(filters).filter(([_, v]) => v !== "all").map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-gray-200 bg-white text-[12px] text-gray-600"
                    >
                      {key === "mediaType" ? "Media" : key === "impressionLevel" ? "Impression" : key.charAt(0).toUpperCase() + key.slice(1)}: {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
                      <button
                        onClick={() => setFilter(key as keyof FilterState, "all")}
                        className="text-gray-400 hover:text-gray-600 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={resetFilters}
                    className="text-[12px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer ml-1"
                    data-testid="button-clear-filters"
                  >
                    Clear all
                  </button>
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="text-[12px] text-gray-500">
                    {filteredAds.length} result{filteredAds.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              {filteredAds.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-12 text-center">
                  <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">
                    No ads found
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your search or filters to find more ads.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="cursor-pointer"
                    data-testid="button-reset-empty"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset Filters
                  </Button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} onClick={handleAdClick} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAds.map((ad) => (
                    <div
                      key={ad.id}
                      onClick={() => handleAdClick(ad)}
                      className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-4 cursor-pointer hover:shadow-md transition-all"
                      data-testid={`list-ad-${ad.id}`}
                    >
                      <img
                        src={ad.creative}
                        alt={ad.advertiserName}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={ad.advertiserLogo}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {ad.advertiserName}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {ad.activeAdsCount} active ads
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                          <span className="inline-flex items-center text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                            {ad.daysActive}d Active
                          </span>
                          <span>
                            {ad.startDate} → {ad.endDate}
                          </span>
                          <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                            {ad.region}
                          </span>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded font-medium",
                            ad.impressionLevel === "high" ? "text-emerald-600 bg-emerald-50" :
                            ad.impressionLevel === "medium" ? "text-amber-600 bg-amber-50" :
                            "text-red-500 bg-red-50"
                          )}>
                            {ad.impressionLevel} impr.
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 truncate">
                          {ad.adLink}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 text-[12px] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAdClick(ad)
                        }}
                      >
                        Ad analysis
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <AdDetailSheet
          ad={selectedAd}
          open={sidebarOpen}
          onClose={handleCloseSidebar}
        />
      </div>
    </>
  )
}
