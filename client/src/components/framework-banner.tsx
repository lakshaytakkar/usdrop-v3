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

  // Page titles/subtitles were redundant with the top-nav + sub-nav and ate
  // vertical space, so the heading row is intentionally removed. Only surface a
  // Tutorial affordance when a page explicitly provides a video (rare).
  const showTutorialButton = !!onTutorialClick || (typeof tutorialVideoUrl === "string" && tutorialVideoUrl.length > 0)

  if (!showTutorialButton) return null

  return (
    <>
      <div className="flex items-center justify-end w-full pb-1">
        <button
          onClick={handleTutorialClick}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] bg-white hover:bg-gray-50 text-foreground text-xs font-medium transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          data-testid="button-tutorial"
        >
          <PlayCircle className="h-3.5 w-3.5 text-blue-600" />
          Tutorial
        </button>
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
