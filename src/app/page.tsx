import { Header } from "@/app/(marketing)/components/Header"
import { Hero } from "@/app/(marketing)/components/Hero"
import { LogoMarquee } from "@/app/(marketing)/components/LogoMarquee"
import { ProblemSolution } from "@/app/(marketing)/components/ProblemSolution"
import { BentoFeatures } from "@/app/(marketing)/components/BentoFeatures"
import { Workflow } from "@/app/(marketing)/components/Workflow"
import { StudioShowcase } from "@/app/(marketing)/components/StudioShowcase"
import { Testimonials } from "@/app/(marketing)/components/Testimonials"
import { PricingPreview } from "@/app/(marketing)/components/PricingPreview"
import { FinalCTA } from "@/app/(marketing)/components/FinalCTA"
import { Footer } from "@/app/(marketing)/components/Footer"

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

