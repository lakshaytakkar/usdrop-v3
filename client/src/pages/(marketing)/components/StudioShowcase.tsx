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
    heading: "Your Store Deserves Winning Products",
    subtitle: "While you sleep, your AI keeps finding the next big seller",
    image: "/images/landing/carousel-1.png",
  },
  {
    id: 2,
    bgColor: "#D4F0E0",
    heading: "AI Product Research That Never Stops",
    subtitle: "Find what's trending before everyone else does",
    image: "/images/landing/carousel-2.png",
  },
  {
    id: 3,
    bgColor: "#E8E0FF",
    heading: "Discovery to Delivery, Fully Automated",
    subtitle: "One platform handles everything end to end",
    image: "/images/landing/carousel-3.png",
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
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16 max-w-[886px] mx-auto">
            <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mx-auto mb-6">
              Showcase
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              Trending Products, Curated by AI
            </h2>
          </div>
        </MotionFadeIn>

        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow} delay={0.2}>
          <div className="relative flex items-center justify-center gap-6 lg:gap-8">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              className="absolute left-0 lg:left-[-60px] z-20 rounded-full bg-[#323140] text-white flex-shrink-0"
              data-testid="button-carousel-previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="relative w-full max-w-4xl mx-auto h-80 lg:h-96">
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

              <div
                className="absolute inset-0 rounded-3xl overflow-hidden transition-all duration-500 ease-out shadow-lg"
                style={{
                  backgroundColor: slides[currentSlide].bgColor,
                  zIndex: 10,
                }}
              >
                <div className="flex h-full">
                  <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-black mb-3 leading-tight">
                        {slides[currentSlide].heading}
                      </h3>
                      <p className="text-[15px] lg:text-base text-gray-700">
                        {slides[currentSlide].subtitle}
                      </p>
                    </div>
                    <div>
                      <Link href="/studio">
                        <Button
                          className="bg-[#323140] text-white gap-2"
                          data-testid="button-learn-more"
                        >
                          Learn More
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:block w-[45%] relative">
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].heading}
                      className="absolute inset-0 w-full h-full object-cover"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>

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
