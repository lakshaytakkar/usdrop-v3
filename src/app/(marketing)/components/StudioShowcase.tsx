"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import Image from "next/image"
import { EtherealBackground } from "./EtherealBackground"
import { useState } from "react"

const showcaseImages = [
  {
    id: 1,
    src: "/images/landing/showcase-products-flatlay.png",
    alt: "Product flat lay",
    description: "Professional product flat lay arranged on clean background",
    gridPosition: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: 2,
    src: "/images/landing/showcase-hero-product.png",
    alt: "Hero product shot",
    description: "Studio-lit hero product photography with reflections",
    gridPosition: "lg:col-span-1 lg:row-span-2",
  },
  {
    id: 3,
    src: "/images/landing/showcase-model-fashion.png",
    alt: "AI model try-on",
    description: "AI-generated model showcasing fashion products",
    gridPosition: "lg:col-start-4 lg:row-start-2 lg:col-span-1 lg:row-span-1",
  },
  {
    id: 4,
    src: "/images/landing/showcase-desk-setup.png",
    alt: "Lifestyle setup",
    description: "Lifestyle product photography in real-world setting",
    gridPosition: "lg:col-start-2 lg:row-start-1 lg:col-span-2 lg:row-span-1",
  },
  {
    id: 5,
    src: "/images/landing/showcase-beauty-products.png",
    alt: "Beauty products",
    description: "Premium beauty product showcase with elegant styling",
    gridPosition: "lg:col-start-1 lg:row-start-2 lg:col-span-1 lg:row-span-1",
  },
  {
    id: 6,
    src: "/images/landing/showcase-ad-creative.png",
    alt: "Ad creative",
    description: "Bold ad creative designed for social media campaigns",
    gridPosition: "lg:col-start-3 lg:row-start-2 lg:col-span-1 lg:row-span-1",
  },
]

function ImageCard({ image, index }: { image: (typeof showcaseImages)[0]; index: number }) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <MotionFadeIn
      direction="up"
      distance={DISTANCE.lg}
      delay={index * 0.1}
      duration={DURATION.slow}
      className={`${image.gridPosition} col-span-1 row-span-1`}
    >
      <div
        className="relative rounded-[16px] overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow h-full w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative w-full h-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2}
          />
        </div>

        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "opacity-0"
          } flex items-end p-6 rounded-[16px]`}
        >
          <p className="text-white text-sm font-medium leading-relaxed">{image.description}</p>
        </div>
      </div>
    </MotionFadeIn>
  )
}

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
              See what our AI Studio creates—professional marketing visuals generated in seconds
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-6 auto-rows-[300px] md:auto-rows-[250px] lg:auto-rows-[280px]">
          {showcaseImages.map((image, index) => (
            <ImageCard key={image.id} image={image} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
