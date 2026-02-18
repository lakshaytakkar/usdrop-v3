

import { apiFetch } from '@/lib/supabase'
import { useState, useRef, useEffect, useMemo } from "react"
import { CourseModule } from "@/types/courses"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const PLACEHOLDER_YOUTUBE_VIDEOS = [
  "dQw4w9WgXcQ",
  "jNQXAC9IVRw",
  "ZXsQAXx_ao0",
  "9bZkp7q19f0",
  "kJQP7kiw5Fk",
  "JGwWNGJdvx8",
  "RgKAFK5djSk",
  "OPf0YbXqDm0",
  "fRh_vgS2dFE",
  "CevxZvSJLk8",
]

interface CourseVideoPlayerProps {
  module: CourseModule
  courseId: string
  moduleId: string
}

export function CourseVideoPlayer({
  module,
  courseId,
  moduleId,
}: CourseVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isYouTubeEmbed, setIsYouTubeEmbed] = useState(false)

  const placeholderVideoId = useMemo(() => {
    let hash = 0
    const str = moduleId || module.id
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash |= 0
    }
    return PLACEHOLDER_YOUTUBE_VIDEOS[Math.abs(hash) % PLACEHOLDER_YOUTUBE_VIDEOS.length]
  }, [moduleId, module.id])

  useEffect(() => {
    const loadVideoUrl = async () => {
      const content = module.content
      const directVideoUrl = module.video_url
      const storagePath = content?.video_storage_path || content?.video_url || directVideoUrl

      if (!storagePath) {
        setVideoUrl(null)
        setIsYouTubeEmbed(true)
        return
      }

      if (storagePath.includes('youtube.com') || storagePath.includes('youtu.be')) {
        setVideoUrl(storagePath)
        setIsYouTubeEmbed(true)
        return
      }

      const isStoragePath = storagePath.includes('course-videos') || storagePath.startsWith('courses/')

      if (isStoragePath) {
        try {
          let path = storagePath
          if (storagePath.includes('course-videos/')) {
            path = storagePath.split('course-videos/')[1]
          }

          const response = await apiFetch(`/api/courses/${courseId}/modules/${moduleId}/video-url?path=${encodeURIComponent(path)}`)
          if (response.ok) {
            const data = await response.json()
            setVideoUrl(data.url)
            setIsYouTubeEmbed(false)
          } else {
            setVideoUrl(content?.video_url || directVideoUrl || null)
            setIsYouTubeEmbed(false)
          }
        } catch (error) {
          console.error('Error fetching video URL:', error)
          setVideoUrl(content?.video_url || directVideoUrl || null)
          setIsYouTubeEmbed(false)
        }
      } else {
        setVideoUrl(storagePath)
        setIsYouTubeEmbed(false)
      }
    }

    loadVideoUrl()
  }, [module, courseId, moduleId])

  useEffect(() => {
    const video = videoRef.current
    if (!video || isYouTubeEmbed) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoUrl, isYouTubeEmbed])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, video.currentTime - 10)
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.min(duration, video.currentTime + 10)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.muted = false
      setIsMuted(false)
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getYouTubeEmbedUrl = (url: string | null): string => {
    if (!url) {
      return `https://www.youtube.com/embed/${placeholderVideoId}?rel=0`
    }

    let videoId = ''
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1)
      } else if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || ''
      }
    } catch {
      videoId = placeholderVideoId
    }

    return `https://www.youtube.com/embed/${videoId || placeholderVideoId}?rel=0`
  }

  if (isYouTubeEmbed) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={getYouTubeEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={module.title}
        />
      </div>
    )
  }

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${placeholderVideoId}?rel=0`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={module.title}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end">
          <div className="px-4 pb-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>

          <div className="px-4 pb-4 space-y-2">
            <div className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipBackward}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipForward}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
