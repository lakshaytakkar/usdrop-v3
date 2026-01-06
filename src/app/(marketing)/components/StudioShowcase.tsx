"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import Image from "next/image"
import { EtherealBackground } from "./EtherealBackground"

const showcaseImages = [
  {
    id: 1,
    src: "/images/landing/studio-showcase-1.png",
    alt: "Prompt: 3D product render of a modern desk lamp on clean ecommerce background with soft shadows, suitable for dropshipping ad creative",
  },
  {
    id: 2,
    src: "/images/landing/generated/studio-showcase-2.png",
    alt: "Prompt: lifestyle scene of a customer unboxing a trending gadget in a cozy living room, social media ad style",
  },
  {
    id: 3,
    src: "/images/landing/generated/studio-showcase-3.png",
    alt: "Prompt: flat lay of multiple ecommerce products arranged on pastel background for Shopify store hero banner",
  },
  {
    id: 4,
    src: "/images/landing/generated/studio-showcase-4.png",
    alt: "Prompt: dramatic studio lighting on a single hero product with reflections and gradients, Apple-like advertising style",
  },
  {
    id: 5,
    src: "/images/landing/generated/studio-showcase-5.png",
    alt: "Prompt: overhead shot of packaging and shipping materials for US-based fulfillment workflow, minimalist aesthetic",
  },
  {
    id: 6,
    src: "/images/landing/generated/studio-showcase-6.png",
    alt: "Prompt: collage of ad creatives for a viral dropshipping product, including UGC, product closeups, and bold call-to-action text",
  },
]

export function StudioShowcase() {
  return (
    <section className="py-16 lg:py-24 bg-[rgba(255,255,255,0.4)] relative overflow-hidden">
      <EtherealBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16 max-w-[886px] mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              Zero Photoshoots. Infinite Visuals.
            </h2>
            <p className="text-[16px] text-[#555555] leading-[22px] max-w-[580px] mx-auto">
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
              <div className="relative break-inside-avoid mb-6 rounded-[16px] overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
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


