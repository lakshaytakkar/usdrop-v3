import { Header } from "@/pages/(marketing)/components/Header"
import { Hero } from "@/pages/(marketing)/components/Hero"
import { LogoMarquee } from "@/pages/(marketing)/components/LogoMarquee"
import { BentoFeatures } from "@/pages/(marketing)/components/BentoFeatures"
import { Workflow } from "@/pages/(marketing)/components/Workflow"
import { ProblemSolution } from "@/pages/(marketing)/components/ProblemSolution"
import { Testimonials } from "@/pages/(marketing)/components/Testimonials"
import { StudioShowcase } from "@/pages/(marketing)/components/StudioShowcase"
import { PricingPreview } from "@/pages/(marketing)/components/PricingPreview"
import { FinalCTA } from "@/pages/(marketing)/components/FinalCTA"
import { Footer } from "@/pages/(marketing)/components/Footer"

export default function HomePage() {
  return (
    <div className="relative bg-[#F4F2F1] overflow-hidden min-h-screen">
      <div className="absolute top-[32px] left-0 right-0 z-50">
        <Header />
      </div>

      <Hero />
      <LogoMarquee />
      <BentoFeatures />
      <Workflow />
      <ProblemSolution />
      <Testimonials />
      <StudioShowcase />
      <PricingPreview />
      <FinalCTA />
      <Footer />
    </div>
  )
}
