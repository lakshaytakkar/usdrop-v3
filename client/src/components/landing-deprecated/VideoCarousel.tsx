

import React, { useRef, useEffect, useState } from 'react';

interface VideoCarouselProps {
  videos?: string[];
}

// Product video ads from the product video ads folder
const defaultVideos = [
  '/videos/7556992074424372511.mp4',
  '/videos/7563181916459994399.mp4',
  '/videos/7564264190710418702.mp4',
  '/videos/7567204602899221815.mp4',
  '/videos/7567452981033995533.mp4',
  '/videos/7568923496424672525.mp4',
  '/videos/7570411528164363550.mp4',
  '/videos/All-In-One Winter Mask Hood.mp4',
];

export const VideoCarousel: React.FC<VideoCarouselProps> = ({ 
  videos = defaultVideos 
}) => {
  // Duplicate videos multiple times for seamless infinite loop
  const duplicatedVideos = [...videos, ...videos, ...videos];
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lazy load videos when they're about to enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-video-index') || '0');
            if (!loadedVideos.has(index)) {
              setLoadedVideos(prev => new Set([...prev, index]));
            }
          }
        });
      },
      { 
        rootMargin: '200px', // Start loading 200px before video enters viewport
        threshold: 0.1 
      }
    );

    videoRefs.current.forEach((videoEl, index) => {
      if (videoEl) {
        observer.observe(videoEl.closest('[data-video-index]') as Element || videoEl);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [loadedVideos]);

  // Only play videos that are loaded and visible
  useEffect(() => {
    const playVisibleVideos = () => {
      videoRefs.current.forEach((video, index) => {
        if (video && loadedVideos.has(index)) {
          const rect = video.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible && video.paused) {
            video.play().catch(() => {
              // Auto-play might be blocked, that's okay
            });
          } else if (!isVisible && !video.paused) {
            video.pause();
          }
        }
      });
    };

    playVisibleVideos();
    const interval = setInterval(playVisibleVideos, 1000);

    return () => clearInterval(interval);
  }, [loadedVideos]);

  return (
    <div className="relative w-full mt-12 overflow-hidden" ref={containerRef}>
      {/* Seamless gradient fade edges - no visible borders */}
      <div className="absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-[#020617] via-[#020617]/50 to-transparent z-30 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-[#020617] via-[#020617]/50 to-transparent z-30 pointer-events-none" />
      
      {/* Video marquee container */}
      <div className="flex gap-4 animate-video-marquee">
        {duplicatedVideos.map((video, index) => {
          const shouldLoad = loadedVideos.has(index);
          
          return (
            <div
              key={index}
              data-video-index={index}
              className="flex-shrink-0 relative group"
            >
              {/* Video card - no borders, seamless design */}
              <div className="relative w-[280px] aspect-[9/16] overflow-hidden transform"
                   style={{
                     borderRadius: '1.5rem',
                   }}
              >
                {shouldLoad ? (
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[index] = el;
                      }
                    }}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata" // Changed from "auto" to "metadata" - only loads video metadata
                    src={video}
                    onLoadedData={(e) => {
                      const videoEl = e.currentTarget;
                      videoEl.play().catch(() => {
                        // Auto-play might be blocked, that's okay
                      });
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // Placeholder while video is not loaded
                  <div className="w-full h-full bg-slate-800 animate-pulse" />
                )}
                
                {/* Subtle hover glow - no visible borders */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/5 group-hover:to-purple-500/3 transition-all duration-300 rounded-[1.5rem] pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Custom animation styles - faster speed */}
      <style>{`
        @keyframes video-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-33.333% - 8px));
          }
        }
        .animate-video-marquee {
          animation: video-marquee 25s linear infinite;
        }
        .animate-video-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

