import { useState } from "react"
import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { useOnboarding } from "@/contexts/onboarding-context"
import { SeasonalCard } from "./components/seasonal-banner"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"

export interface SeasonalCollection {
  name: string
  slug: string
  thumbnail: string
  season: string
  dateRange: string
  marketingDateRange: string
  description: string
  peakSalesTag: string
  gradient: string
}

const seasonalCollections: SeasonalCollection[] = [
  {
    name: "New Year's & January Sales",
    slug: "new-years",
    thumbnail: "/images/seasonal-collections/christmas-thumbnail-1.png",
    season: "Winter",
    dateRange: "Dec 26 - Jan 15",
    marketingDateRange: "Dec 20 - Jan 15",
    description: "Capitalize on New Year resolutions, fitness gear, planners, organization products, and post-holiday clearance deals.",
    peakSalesTag: "Peak: Jan 1 - Jan 5",
    gradient: "from-blue-900 to-slate-800",
  },
  {
    name: "Valentine's Day",
    slug: "valentines-day",
    thumbnail: "/images/seasonal-collections/christmas-thumbnail-2.png",
    season: "Winter",
    dateRange: "Jan 20 - Feb 14",
    marketingDateRange: "Jan 15 - Feb 14",
    description: "Romantic gifts, jewelry, personalized items, flowers, chocolates, and couple experiences drive massive impulse purchases.",
    peakSalesTag: "Peak: Feb 7 - Feb 14",
    gradient: "from-pink-900 to-red-800",
  },
  {
    name: "St. Patrick's Day",
    slug: "st-patricks-day",
    thumbnail: "/images/seasonal-collections/halloween-thumbnail-1.png",
    season: "Spring",
    dateRange: "Feb 20 - Mar 17",
    marketingDateRange: "Feb 25 - Mar 17",
    description: "Green-themed apparel, party supplies, novelty items, and Irish-themed accessories for celebrations.",
    peakSalesTag: "Peak: Mar 10 - Mar 17",
    gradient: "from-green-900 to-emerald-800",
  },
  {
    name: "Easter",
    slug: "easter",
    thumbnail: "/images/seasonal-collections/thanksgiving-thumbnail-1.png",
    season: "Spring",
    dateRange: "Mar 15 - Apr 20",
    marketingDateRange: "Mar 1 - Apr 20",
    description: "Easter baskets, spring decor, candy, egg hunt supplies, kids' gifts, and spring fashion essentials.",
    peakSalesTag: "Peak: 2 weeks before Easter",
    gradient: "from-violet-900 to-pink-800",
  },
  {
    name: "Mother's Day",
    slug: "mothers-day",
    thumbnail: "/images/seasonal-collections/fathers-day-thumbnail-1.png",
    season: "Spring",
    dateRange: "Apr 15 - May 11",
    marketingDateRange: "Apr 10 - May 11",
    description: "Personalized gifts, jewelry, self-care products, flowers, kitchen gadgets, and sentimental keepsakes.",
    peakSalesTag: "Peak: May 1 - May 11",
    gradient: "from-rose-900 to-pink-800",
  },
  {
    name: "Memorial Day & Summer Kickoff",
    slug: "memorial-day",
    thumbnail: "/images/seasonal-collections/christmas-thumbnail-3.png",
    season: "Spring",
    dateRange: "May 10 - May 27",
    marketingDateRange: "May 1 - May 27",
    description: "Outdoor furniture, grills, patriotic decor, summer clothing, pool accessories, and travel gear.",
    peakSalesTag: "Peak: May 20 - May 27",
    gradient: "from-red-900 to-blue-800",
  },
  {
    name: "Father's Day",
    slug: "fathers-day",
    thumbnail: "/images/seasonal-collections/fathers-day-thumbnail.png",
    season: "Summer",
    dateRange: "May 25 - Jun 15",
    marketingDateRange: "May 20 - Jun 15",
    description: "Tech gadgets, tools, outdoor gear, grilling accessories, wallets, watches, and personalized gifts for dads.",
    peakSalesTag: "Peak: Jun 8 - Jun 15",
    gradient: "from-blue-900 to-slate-800",
  },
  {
    name: "4th of July / Independence Day",
    slug: "independence-day",
    thumbnail: "/images/seasonal-collections/halloween-thumbnail-2.png",
    season: "Summer",
    dateRange: "Jun 15 - Jul 4",
    marketingDateRange: "Jun 1 - Jul 4",
    description: "Patriotic apparel, party supplies, fireworks accessories, outdoor entertaining, and red-white-blue themed products.",
    peakSalesTag: "Peak: Jun 28 - Jul 4",
    gradient: "from-blue-800 to-red-900",
  },
  {
    name: "Back to School",
    slug: "back-to-school",
    thumbnail: "/images/seasonal-collections/thanksgiving-thumbnail-2.png",
    season: "Summer",
    dateRange: "Jul 15 - Sep 5",
    marketingDateRange: "Jun 15 - Sep 5",
    description: "School supplies, backpacks, electronics, dorm essentials, clothing, and organizational products for students.",
    peakSalesTag: "Peak: Aug 1 - Aug 25",
    gradient: "from-amber-900 to-yellow-800",
  },
  {
    name: "Labor Day",
    slug: "labor-day",
    thumbnail: "/images/seasonal-collections/fathers-day-thumbnail-2.png",
    season: "Fall",
    dateRange: "Aug 20 - Sep 2",
    marketingDateRange: "Aug 15 - Sep 2",
    description: "End-of-summer clearance, fall fashion previews, home improvement deals, and outdoor entertaining gear.",
    peakSalesTag: "Peak: Aug 30 - Sep 2",
    gradient: "from-orange-900 to-amber-800",
  },
  {
    name: "Halloween",
    slug: "halloween",
    thumbnail: "/images/seasonal-collections/halloween-thumbnail.png",
    season: "Fall",
    dateRange: "Sep 15 - Oct 31",
    marketingDateRange: "Sep 1 - Oct 31",
    description: "Costumes, decorations, candy, party supplies, spooky home decor, and pet costumes for the biggest costume holiday.",
    peakSalesTag: "Peak: Oct 15 - Oct 31",
    gradient: "from-orange-900 to-purple-800",
  },
  {
    name: "Thanksgiving",
    slug: "thanksgiving",
    thumbnail: "/images/seasonal-collections/thanksgiving-thumbnail.png",
    season: "Fall",
    dateRange: "Nov 1 - Nov 28",
    marketingDateRange: "Oct 20 - Nov 28",
    description: "Kitchen gadgets, table decor, hosting essentials, fall-themed items, and pre-Black Friday teasers.",
    peakSalesTag: "Peak: Nov 20 - Nov 28",
    gradient: "from-orange-900 to-yellow-800",
  },
  {
    name: "Black Friday & Cyber Monday",
    slug: "black-friday",
    thumbnail: "/images/seasonal-collections/halloween-thumbnail-3.png",
    season: "Fall",
    dateRange: "Nov 25 - Dec 2",
    marketingDateRange: "Nov 1 - Dec 2",
    description: "The biggest shopping event of the year. Massive discounts, doorbuster deals, and urgency-driven promotions across all categories.",
    peakSalesTag: "Peak: Nov 28 - Dec 1",
    gradient: "from-gray-900 to-black",
  },
  {
    name: "Christmas & Holiday Season",
    slug: "christmas",
    thumbnail: "/images/seasonal-collections/christmas-thumbnail.png",
    season: "Winter",
    dateRange: "Nov 15 - Dec 25",
    marketingDateRange: "Nov 1 - Dec 25",
    description: "Gift sets, stocking stuffers, holiday decor, wrapping supplies, toys, electronics, and last-minute gift ideas.",
    peakSalesTag: "Peak: Dec 10 - Dec 23",
    gradient: "from-red-900 to-green-800",
  },
]

function SeasonalCollectionsPageContent() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {seasonalCollections.map((collection, index) => {
            const { isLocked } = getTeaserLockState(index, isFree, {
              freeVisibleCount: 4,
              strategy: "first-n-items"
            })
            return (
              <SeasonalCard
                key={collection.slug}
                collection={collection}
                isLocked={isLocked}
                onLockedClick={() => setIsUpsellOpen(true)}
              />
            )
          })}
        </div>
      </div>

      <UpsellDialog
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
      />
    </>
  )
}

export default function SeasonalCollectionsPage() {
  return (
    <ModuleAccessGuard moduleId="seasonal-collections">
      <SeasonalCollectionsPageContent />
    </ModuleAccessGuard>
  )
}
