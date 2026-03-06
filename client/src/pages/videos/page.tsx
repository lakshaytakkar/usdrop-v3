import { useState, useMemo, useEffect, useCallback } from "react"
import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { FrameworkBanner } from "@/components/framework-banner"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { VideoCard } from "./components/video-card"
import { videoCategories, type ProductVideo } from "./data/videos"
import { useOnboarding } from "@/contexts/onboarding-context"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/supabase"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const [videos, setVideos] = useState<ProductVideo[]>([])
  const [loading, setLoading] = useState(true)
  const { isFree } = useOnboarding()

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/ad-videos")
      if (res.ok) {
        const data = await res.json()
        const mapped: ProductVideo[] = data.map((v: any, i: number) => ({
          id: i + 1,
          title: v.title,
          videoUrl: v.video_url,
          thumbnailUrl: v.thumbnail_url || "",
          category: v.category,
          views: v.views || 0,
          likes: v.likes || 0,
          dateAdded: v.date_added || v.created_at?.split("T")[0] || "",
        }))
        if (mapped.length > 0) {
          setVideos(mapped)
        }
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, videos])

  return (
    <ModuleAccessGuard moduleId="meta-ads">
      <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0">
        <FrameworkBanner
          title="Product Videos"
          description="Browse viral product videos — hover to preview, discover your next winner"
          iconSrc="/3d-ecom-icons-blue/Megaphone_Ads.png"
          tutorialVideoUrl=""
        />

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-testid="input-videos-search"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {videoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border",
                  selectedCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 pb-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[9/16] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 pb-8">
            {filteredVideos.map((video, index) => {
              const { isLocked } = getTeaserLockState(index, isFree, {
                freeVisibleCount: 6,
                strategy: "first-n-items",
              })
              return (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLocked={isLocked}
                  onLockedClick={() => setIsUpsellOpen(true)}
                />
              )
            })}
          </div>
        )}

        {!loading && filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No videos uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">Videos will appear here once uploaded by an admin</p>
          </div>
        )}
      </div>

      <UpsellDialog
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
      />
    </ModuleAccessGuard>
  )
}
