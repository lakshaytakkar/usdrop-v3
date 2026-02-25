import { Link } from "wouter"
import { Calendar, ArrowRight } from "lucide-react"
import { LockOverlay } from "@/components/ui/lock-overlay"

interface SeasonalBannerProps {
  name: string
  slug: string
  thumbnail: string
  dateRange: string
  marketingDateRange: string
  gradient: string
  isLocked?: boolean
  onLockedClick?: () => void
}

export function SeasonalBanner({
  name,
  slug,
  thumbnail,
  dateRange,
  marketingDateRange,
  isLocked = false,
  onLockedClick,
}: SeasonalBannerProps) {
  const content = (
    <div
      className="relative rounded-xl bg-white border border-black/[0.06] p-5 flex items-center gap-5 group hover:border-black/[0.10] transition-all cursor-pointer"
      data-testid={`card-seasonal-${slug}`}
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-black/[0.06] bg-[#FAFAFA]">
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] md:text-[18px] font-bold text-black tracking-[-0.3px] mb-1.5">
          {name}
        </h3>
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-4">
          <div className="flex items-center gap-1.5 text-[13px] text-[#666]">
            <Calendar className="h-3.5 w-3.5 text-[#999]" />
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-[#666]">
            <Calendar className="h-3.5 w-3.5 text-[#999]" />
            <span>Marketing: {marketingDateRange}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 relative">
        {isLocked ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#F5F5F7] text-[13px] font-semibold text-[#999]">
            Browse Collection
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-black text-white text-[13px] font-semibold group-hover:bg-gray-900 transition-colors">
            Browse
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        )}
        {isLocked && (
          <LockOverlay
            onClick={onLockedClick}
            variant="button"
            size="sm"
            className="rounded-lg"
          />
        )}
      </div>
    </div>
  )

  if (isLocked) {
    return content
  }

  return (
    <Link href={`/winning-products?category=${slug}`}>
      {content}
    </Link>
  )
}
