import { Header } from "./(marketing)/components/Header"
import { Hero } from "./(marketing)/components/Hero"
import { LogoMarquee } from "./(marketing)/components/LogoMarquee"
import { VoiceAIFeatures } from "./(marketing)/components/VoiceAIFeatures"

export default function HomePage() {
  return (
    <div className="relative bg-[rgba(255,255,255,0.4)] overflow-hidden min-h-screen">
      {/* Hero section with background */}
      <Hero />
      
      {/* Header positioned absolutely over the hero - exact Figma position */}
      <div className="absolute top-[32px] left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Logo Marquee - Social Proof Section */}
      <LogoMarquee />
      
      {/* Voice AI Features Section */}
      <VoiceAIFeatures />
    </div>
  )
}

