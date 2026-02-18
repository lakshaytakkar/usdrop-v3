import { Header } from "@/pages/(marketing)/components/Header"
import { Hero } from "@/pages/(marketing)/components/Hero"
import { LogoMarquee } from "@/pages/(marketing)/components/LogoMarquee"
import { ProblemSolution } from "@/pages/(marketing)/components/ProblemSolution"
import { BentoFeatures } from "@/pages/(marketing)/components/BentoFeatures"
import { Workflow } from "@/pages/(marketing)/components/Workflow"
import { StudioShowcase } from "@/pages/(marketing)/components/StudioShowcase"
import { Testimonials } from "@/pages/(marketing)/components/Testimonials"
import { PricingPreview } from "@/pages/(marketing)/components/PricingPreview"
import { FinalCTA } from "@/pages/(marketing)/components/FinalCTA"
import { Footer } from "@/pages/(marketing)/components/Footer"

export default function HomePage() {
  return (
    <div className="relative bg-[rgba(255,255,255,0.4)] overflow-hidden min-h-screen">
      {/* Header positioned absolutely over the hero - exact Figma position */}
      <div className="absolute top-[32px] left-0 right-0 z-50">
        <Header />
      </div>

      {/* Marketing landing layout */}
      <Hero />
      
      <LogoMarquee />
      <ProblemSolution />
      <BentoFeatures />
      <Workflow />
      <StudioShowcase />
      <Testimonials />
      <PricingPreview />
      <FinalCTA />
      <Footer />
    </div>
  )
}

