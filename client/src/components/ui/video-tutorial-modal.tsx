import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface VideoTutorialModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  videoUrl?: string
}

export function VideoTutorialModal({ isOpen, onClose, title, videoUrl }: VideoTutorialModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isYouTube = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be")
  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            data-testid="button-close-video-tutorial"
          >
            <X className="h-4.5 w-4.5 text-gray-500" />
          </button>
        </div>

        <div className="relative w-full bg-gray-950" style={{ aspectRatio: "16/9" }}>
          {videoUrl ? (
            isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(videoUrl)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
              />
            ) : (
              <video
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-contain"
                controls
                autoPlay
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium">Tutorial video coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
