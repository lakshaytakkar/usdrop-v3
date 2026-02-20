import { useEffect, useRef } from "react"

const images = [
  { src: "/images/landing/showcase-ad-creative.png", alt: "Ad creative" },
  { src: "/images/landing/showcase-beauty-products.png", alt: "Beauty products" },
  { src: "/images/landing/showcase-desk-setup.png", alt: "Desk setup" },
  { src: "/images/landing/showcase-hero-product.png", alt: "Hero product" },
  { src: "/images/landing/showcase-model-fashion.png", alt: "Fashion model" },
  { src: "/images/landing/showcase-products-flatlay.png", alt: "Products flatlay" },
  { src: "/images/landing/features-product-grid.png", alt: "Product grid" },
  { src: "/images/landing/features-ai-studio.png", alt: "AI Studio" },
  { src: "/images/landing/features-product-discovery.png", alt: "Product discovery" },
  { src: "/images/landing/workflow-studio.png", alt: "Studio workflow" },
]

export function ImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId: number
    let scrollPos = 0
    const speed = 0.5

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

  const allImages = [...images, ...images]

  return (
    <section className="py-8 lg:py-12" data-testid="section-image-carousel">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {allImages.map((img, i) => (
          <div
            key={`${img.alt}-${i}`}
            className="flex-shrink-0 w-[280px] h-[180px] sm:w-[320px] sm:h-[200px] lg:w-[380px] lg:h-[240px] rounded-[16px] overflow-hidden"
            data-testid={`img-carousel-${i}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
