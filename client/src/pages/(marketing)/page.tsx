import { Hero } from "./components/Hero"
import { LogoMarquee } from "./components/LogoMarquee"
import { ImageCarousel } from "./components/ImageCarousel"
import { StatsBar } from "./components/StatsBar"
import { BentoFeatures } from "./components/BentoFeatures"
import { StepsSection } from "./components/StepsSection"
import { Testimonials } from "./components/Testimonials"
import { FinalCTA } from "./components/FinalCTA"

export default function MarketingPage() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(195,170,255,0.16) 0%, transparent 70%),
            radial-gradient(ellipse 70% 35% at 80% 20%, rgba(180,215,255,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 70% 35% at 20% 50%, rgba(220,210,255,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 80% 40% at 70% 80%, rgba(180,215,255,0.10) 0%, transparent 60%)
          `,
        }}
      />
      <div className="relative z-[1]">
        <Hero />
        <LogoMarquee />
        <StatsBar />
        <ImageCarousel />
        <BentoFeatures />
        <StepsSection />
        <Testimonials />
        <FinalCTA />
      </div>
    </div>
  )
}
