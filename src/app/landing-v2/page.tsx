import { LandingHeader } from "./components/LandingHeader"
import { LandingHero } from "./components/LandingHero"
import { TwoColumnSection } from "./components/TwoColumnSection"
import { DeveloperInfrastructure } from "./components/DeveloperInfrastructure"

export default function LandingV2Page() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <LandingHeader />
      <main className="w-full">
        <LandingHero />
        <TwoColumnSection />
        <DeveloperInfrastructure />
      </main>
    </div>
  )
}

