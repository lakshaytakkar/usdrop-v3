import { Hero } from "./components/Hero"
import { LogoMarquee } from "./components/LogoMarquee"
import { ProblemSolution } from "./components/ProblemSolution"
import { BentoFeatures } from "./components/BentoFeatures"
import { VoiceAIFeatures } from "./components/VoiceAIFeatures"
import { Workflow } from "./components/Workflow"
import { StudioShowcase } from "./components/StudioShowcase"
import { Testimonials } from "./components/Testimonials"
import { PricingPreview } from "./components/PricingPreview"
import { FinalCTA } from "./components/FinalCTA"
import { Footer } from "./components/Footer"

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <ProblemSolution />
      <BentoFeatures />
      <VoiceAIFeatures />
      <Workflow />
      <StudioShowcase />
      <Testimonials />
      <PricingPreview />
      <FinalCTA />
      <Footer />
    </>
  )
}

