import { Hero } from "./components/Hero"
import { LogoMarquee } from "./components/LogoMarquee"
import { BentoFeatures } from "./components/BentoFeatures"
import { Workflow } from "./components/Workflow"
import { ProblemSolution } from "./components/ProblemSolution"
import { Testimonials } from "./components/Testimonials"
import { StudioShowcase } from "./components/StudioShowcase"
import { PricingPreview } from "./components/PricingPreview"
import { FinalCTA } from "./components/FinalCTA"
import { Footer } from "./components/Footer"

export default function MarketingPage() {
  return (
    <>
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
    </>
  )
}
