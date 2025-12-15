"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import Image from "next/image"

// Placeholder images - will be replaced with NanoBanana generated images
const showcaseImages = [
  { id: 1, src: "/images/landing/studio-showcase-1.png", alt: "AI Generated Product Visual" },
  { id: 2, src: "/images/landing/studio-showcase-2.png", alt: "AI Generated Product Visual" },
  { id: 3, src: "/images/landing/studio-showcase-3.png", alt: "AI Generated Product Visual" },
  { id: 4, src: "/images/landing/studio-showcase-4.png", alt: "AI Generated Product Visual" },
  { id: 5, src: "/images/landing/studio-showcase-5.png", alt: "AI Generated Product Visual" },
  { id: 6, src: "/images/landing/studio-showcase-6.png", alt: "AI Generated Product Visual" },
]

export function StudioShowcase() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Zero Photoshoots. Infinite Visuals.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See how AI transforms products into professional marketing visuals in seconds
            </p>
          </div>
        </MotionFadeIn>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {showcaseImages.map((image, index) => (
            <MotionFadeIn
              key={image.id}
              direction="up"
              distance={DISTANCE.lg}
              delay={index * 0.1}
              duration={DURATION.slow}
            >
              <div className="relative break-inside-avoid mb-6 rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square relative">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback placeholder
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      if (target.parentElement) {
                        target.parentElement.className = "aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                        target.parentElement.innerHTML = `<div class="text-slate-400 text-sm">AI Generated Visual</div>`
                      }
                    }}
                  />
                </div>
              </div>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}


