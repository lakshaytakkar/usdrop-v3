

import { Play } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { VideoPlayerModal } from "@/components/ui/video-player-modal"
import { Button } from "@/components/ui/button"

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="relative w-full min-h-[720px]">
      <div className="relative z-10 flex flex-col items-center pt-[120px] sm:pt-[160px] lg:pt-[200px] px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center max-w-[900px] w-full mb-10 lg:mb-14">
          <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] text-foreground tracking-[-2px] sm:tracking-[-3px] lg:tracking-[-4px] font-bold leading-[1.05]" data-testid="text-hero-headline">
            Find. Sell. Scale.
          </h1>
          <p className="text-muted-foreground text-[16px] sm:text-[18px] lg:text-[20px] max-w-[480px] w-full font-normal leading-[1.5]" data-testid="text-hero-subtitle">
            The AI-powered platform to launch and grow your dropshipping business.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
          <Link href="/signup">
            <Button size="lg" className="bg-black text-white dark:bg-white dark:text-black text-[15px] font-semibold px-8" data-testid="button-hero-get-started">
              Get Started Free
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsVideoOpen(true)}
            className="text-[15px] font-semibold gap-2"
            data-testid="button-hero-watch-video"
          >
            <Play className="size-4 fill-current" />
            Watch Video
          </Button>

          <VideoPlayerModal
            videoSrc="/videos/7567204602899221815.mp4"
            isOpen={isVideoOpen}
            onClose={() => setIsVideoOpen(false)}
          />
        </div>

        <p className="text-muted-foreground text-[13px] sm:text-[14px]" data-testid="text-hero-trust">
          No credit card required
        </p>
      </div>
    </div>
  )
}
