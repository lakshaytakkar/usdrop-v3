import { PlayCircle } from "lucide-react"

interface FrameworkBannerProps {
  title: string
  description: string
  iconSrc: string
  onTutorialClick?: () => void
}

export function FrameworkBanner({ title, description, iconSrc, onTutorialClick }: FrameworkBannerProps) {
  return (
    <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 flex-shrink-0 w-full" data-testid={`banner-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 flex items-center justify-center">
            <img
              src={iconSrc}
              alt={`${title} icon`}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">{title}</h1>
            <p className="text-xs text-white/90 mt-0.5">{description}</p>
          </div>
        </div>
        {onTutorialClick && (
          <button
            onClick={onTutorialClick}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
            data-testid="button-tutorial"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Tutorial
          </button>
        )}
      </div>
    </div>
  )
}
