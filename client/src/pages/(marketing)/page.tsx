import { Hero } from "./components/Hero"
import { LogoMarquee } from "./components/LogoMarquee"
import { ImageCarousel } from "./components/ImageCarousel"
import { StatsBar } from "./components/StatsBar"
import { ProductShowcase } from "./components/ProductShowcase"
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
            radial-gradient(ellipse 80% 35% at 50% 0%, rgba(195,170,255,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 30% at 85% 8%, rgba(180,215,255,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 70% 25% at 10% 18%, rgba(180,230,200,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 80% 30% at 75% 28%, rgba(220,210,255,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 65% 25% at 20% 38%, rgba(240,210,250,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 75% 25% at 85% 48%, rgba(180,230,200,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 70% 25% at 15% 58%, rgba(180,215,255,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 70% 68%, rgba(195,170,255,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 65% 25% at 25% 78%, rgba(240,210,250,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 75% 30% at 80% 88%, rgba(180,215,255,0.14) 0%, transparent 60%)
          `,
        }}
      />
      <div className="relative z-[1]">
        <Hero />
        <LogoMarquee />
        <ImageCarousel />
        <StatsBar />
        <ProductShowcase />
        <StepsSection />
        <Testimonials />
        <FinalCTA />
      </div>
    </div>
  )
}
