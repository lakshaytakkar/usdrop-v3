import { PlayCircle } from "lucide-react"
import { useState } from "react"
import { VideoTutorialModal } from "@/components/ui/video-tutorial-modal"

interface FrameworkBannerProps {
  title: string
  description: string
  iconSrc: string
  onTutorialClick?: () => void
  tutorialVideoUrl?: string
}

export function FrameworkBanner({ title, description, iconSrc, onTutorialClick, tutorialVideoUrl }: FrameworkBannerProps) {
  const [videoOpen, setVideoOpen] = useState(false)

  const handleTutorialClick = () => {
    if (onTutorialClick) {
      onTutorialClick()
    } else {
      setVideoOpen(true)
    }
  }

  const showTutorialButton = onTutorialClick || tutorialVideoUrl !== undefined

  // Compact header (replaces the old full-width blue banner to reclaim vertical
  // space). Keeps the page title + optional tutorial link; one slim row.
  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-shrink-0 w-full pb-1" data-testid={`banner-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="min-w-0">
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-foreground truncate">{title}</h1>
          {description && <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{description}</p>}
        </div>
        {showTutorialButton && (
          <button
            onClick={handleTutorialClick}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] bg-white hover:bg-gray-50 text-foreground text-xs font-medium transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            data-testid="button-tutorial"
          >
            <PlayCircle className="h-3.5 w-3.5 text-blue-600" />
            Tutorial
          </button>
        )}
      </div>

      <VideoTutorialModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        title={`${title} Tutorial`}
        videoUrl={tutorialVideoUrl}
      />
    </>
  )
}
