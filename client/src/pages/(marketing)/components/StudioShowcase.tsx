import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

const slides = [
  {
    id: 1,
    bgColor: "#D4EDFF",
    heading: "Because Your Store Deserves Winning Products",
    subtitle: "When your competition sleeps, your AI keeps working",
  },
  {
    id: 2,
    bgColor: "#D4F0E0",
    heading: "AI-Powered Product Research That Never Stops",
    subtitle: "Find winning products before they trend",
  },
  {
    id: 3,
    bgColor: "#E8E0FF",
    heading: "From Discovery to Delivery, All Automated",
    subtitle: "One platform to handle everything",
  },
]

export function StudioShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const getVisibleSlide = (offset: number) => {
    return (currentSlide + offset) % slides.length
  }

  return (
    <section className="py-16 lg:py-24 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badge and Heading */}
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16 max-w-[886px] mx-auto">
            {/* Dark pill badge */}
            <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mx-auto mb-6">
              Showcase
            </div>

            {/* Main heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              Discover Trending Products, Curated by AI for You
            </h2>
          </div>
        </MotionFadeIn>

        {/* Carousel Section */}
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow} delay={0.2}>
          <div className="relative flex items-center justify-center gap-6 lg:gap-8">
            {/* Left Navigation Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              className="absolute left-0 lg:left-[-60px] z-20 rounded-full bg-[#323140] text-white flex-shrink-0"
              data-testid="button-carousel-previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Carousel Container */}
            <div className="relative w-full max-w-4xl mx-auto h-80 lg:h-96">
              {/* Stacked card effect - background cards */}
              {[2, 1].map((offset, idx) => {
                const slideIndex = getVisibleSlide(offset)
                const scale = 1 - offset * 0.05
                const yOffset = offset * 12

                return (
                  <div
                    key={`bg-${idx}`}
                    className="absolute inset-0 rounded-3xl transition-all duration-500 ease-out"
                    style={{
                      backgroundColor: slides[slideIndex].bgColor,
                      transform: `scale(${scale}) translateY(${yOffset}px)`,
                      zIndex: -offset,
                    }}
                  />
                )
              })}

              {/* Main visible card */}
              <div
                className="absolute inset-0 rounded-3xl p-8 lg:p-12 flex flex-col justify-between transition-all duration-500 ease-out shadow-lg"
                style={{
                  backgroundColor: slides[currentSlide].bgColor,
                  zIndex: 10,
                }}
              >
                <div>
                  {/* Card Heading */}
                  <h3 className="text-2xl lg:text-4xl font-bold text-black mb-4 leading-tight">
                    {slides[currentSlide].heading}
                  </h3>

                  {/* Card Subtitle */}
                  <p className="text-base lg:text-lg text-gray-700 mb-8">
                    {slides[currentSlide].subtitle}
                  </p>
                </div>

                {/* Bottom section with CTA and decorative space */}
                <div className="flex items-end justify-between">
                  {/* Learn More Button */}
                  <Link href="/studio">
                    <Button
                      className="bg-[#323140] text-white gap-2"
                      data-testid="button-learn-more"
                    >
                      Learn More
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Decorative space on the right */}
                  <div className="hidden lg:block w-24 h-24 rounded-2xl bg-black/5" />
                </div>
              </div>
            </div>

            {/* Right Navigation Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              className="absolute right-0 lg:right-[-60px] z-20 rounded-full bg-[#323140] text-white flex-shrink-0"
              data-testid="button-carousel-next"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </MotionFadeIn>

        {/* Slide Indicators */}
        <MotionFadeIn direction="up" distance={DISTANCE.sm} duration={DURATION.slow} delay={0.4}>
          <div className="flex justify-center gap-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-black w-8" : "bg-gray-300 w-2"
                }`}
                data-testid={`button-slide-indicator-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}
