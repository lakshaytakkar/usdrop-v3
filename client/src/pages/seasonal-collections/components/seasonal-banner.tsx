import { Calendar, ShoppingBag, Clock } from "lucide-react"
import { LockOverlay } from "@/components/ui/lock-overlay"
import type { SeasonalCollection } from "../page"

interface SeasonalCardProps {
  collection: SeasonalCollection
  isLocked?: boolean
  onLockedClick?: () => void
}

const seasonBadgeColors: Record<string, string> = {
  Winter: "bg-blue-50 text-blue-700 border-blue-200",
  Spring: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Summer: "bg-amber-50 text-amber-700 border-amber-200",
  Fall: "bg-orange-50 text-orange-700 border-orange-200",
}

export function SeasonalCard({
  collection,
  isLocked = false,
  onLockedClick,
}: SeasonalCardProps) {
  const { name, slug, thumbnail, season, dateRange, marketingDateRange, description, peakSalesTag } = collection
  const badgeColor = seasonBadgeColors[season] || "bg-gray-50 text-gray-700 border-gray-200"

  const card = (
    <div
      className="relative rounded-2xl bg-white border border-black/[0.06] overflow-hidden group hover:shadow-md hover:border-black/[0.10] transition-all"
      data-testid={`card-seasonal-${slug}`}
    >
      <div className="relative w-full aspect-[4/3] bg-[#F5F5F7] overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeColor}`}>
            {season}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-medium backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {peakSalesTag}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-[15px] font-bold text-black tracking-[-0.3px] leading-tight line-clamp-1">
          {name}
        </h3>

        <p className="text-[12.5px] leading-[1.5] text-[#666] line-clamp-2 min-h-[38px]">
          {description}
        </p>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[12px] text-[#555]">
            <Calendar className="h-3 w-3 text-[#999] flex-shrink-0" />
            <span className="font-medium">Sales:</span>
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#555]">
            <ShoppingBag className="h-3 w-3 text-[#999] flex-shrink-0" />
            <span className="font-medium">Marketing:</span>
            <span>{marketingDateRange}</span>
          </div>
        </div>

        <div className="relative mt-1">
          <button
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black/[0.04] text-[13px] font-semibold text-[#999] cursor-default"
            disabled
            data-testid={`button-browse-${slug}`}
          >
            Coming Soon
          </button>
          {isLocked && (
            <LockOverlay
              onClick={onLockedClick}
              variant="button"
              size="sm"
              className="rounded-xl"
            />
          )}
        </div>
      </div>
    </div>
  )

  return card
}
