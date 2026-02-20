import { useEffect, useRef } from "react"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

const products = [
  { src: "/images/landing/product-earbuds.webp", alt: "Wireless Earbuds", label: "Wireless Earbuds" },
  { src: "/images/landing/product-smartwatch.webp", alt: "Smart Watch", label: "Smart Watch" },
  { src: "/images/landing/product-ringlight.webp", alt: "Ring Light", label: "Ring Light" },
  { src: "/images/landing/product-serum.webp", alt: "Skincare Serum", label: "Skincare Serum" },
  { src: "/images/landing/product-phonecase.webp", alt: "Phone Case", label: "Phone Case" },
  { src: "/images/landing/product-projector.webp", alt: "Mini Projector", label: "Mini Projector" },
  { src: "/images/landing/product-waterbottle.webp", alt: "Water Bottle", label: "Water Bottle" },
  { src: "/images/landing/product-sunsetlamp.webp", alt: "Sunset Lamp", label: "Sunset Lamp" },
]

export function ImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId: number
    let scrollPos = 0
    const speed = 0.4

    const animate = () => {
      scrollPos += speed
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0
      }
      el.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    el.addEventListener("mouseenter", handleMouseEnter)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      el.removeEventListener("mouseenter", handleMouseEnter)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const allProducts = [...products, ...products]

  return (
    <section className="py-16 lg:py-24" data-testid="section-image-carousel">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 lg:mb-14">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em] mb-5">
              Trending Now
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-black tracking-[-0.03em] leading-[1.15]">
              Discover winning products daily.
            </h2>
          </div>
        </MotionFadeIn>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-hidden px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {allProducts.map((product, i) => (
          <div
            key={`${product.alt}-${i}`}
            className="flex-shrink-0 w-[200px] sm:w-[220px] lg:w-[240px] rounded-[20px] overflow-hidden relative group"
            data-testid={`img-carousel-${i}`}
          >
            <div className="aspect-[9/16] w-full">
              <img
                src={product.src}
                alt={product.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <span className="text-white text-[13px] font-semibold" data-testid={`text-product-${i}`}>{product.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
