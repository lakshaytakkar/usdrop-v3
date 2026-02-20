import { Hero } from "./components/Hero"
import { LogoMarquee } from "./components/LogoMarquee"
import { GettingStarted } from "./components/GettingStarted"
import { BentoFeatures } from "./components/BentoFeatures"
import { Workflow } from "./components/Workflow"
import { ProblemSolution } from "./components/ProblemSolution"
import { Testimonials } from "./components/Testimonials"
import { StudioShowcase } from "./components/StudioShowcase"
import { FinalCTA } from "./components/FinalCTA"
import { Footer } from "./components/Footer"

function GradientSection({ children, gradient }: { children: React.ReactNode; gradient: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: gradient }} />
      <div className="relative">{children}</div>
    </div>
  )
}

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <LogoMarquee />

      <GradientSection gradient="radial-gradient(ellipse 80% 60% at 15% 40%, rgba(180,230,200,0.22) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 60%, rgba(220,210,255,0.18) 0%, transparent 55%)">
        <GettingStarted />
      </GradientSection>

      <GradientSection gradient="radial-gradient(ellipse 85% 60% at 75% 20%, rgba(180,215,255,0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 10% 75%, rgba(240,210,250,0.2) 0%, transparent 55%)">
        <BentoFeatures />
      </GradientSection>

      <GradientSection gradient="radial-gradient(ellipse 70% 55% at 25% 35%, rgba(180,230,200,0.25) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 80% 15%, rgba(195,170,255,0.15) 0%, transparent 55%)">
        <Workflow />
      </GradientSection>

      <GradientSection gradient="radial-gradient(ellipse 75% 55% at 65% 30%, rgba(240,210,250,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 15% 65%, rgba(180,215,255,0.25) 0%, transparent 55%)">
        <ProblemSolution />
      </GradientSection>

      <GradientSection gradient="radial-gradient(ellipse 85% 65% at 40% 25%, rgba(220,210,255,0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 55%, rgba(180,230,200,0.18) 0%, transparent 55%)">
        <Testimonials />
      </GradientSection>

      <GradientSection gradient="radial-gradient(ellipse 75% 55% at 55% 20%, rgba(180,215,255,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 15% 70%, rgba(240,210,250,0.2) 0%, transparent 55%)">
        <StudioShowcase />
      </GradientSection>

      <FinalCTA />
      <Footer />
    </>
  )
}
