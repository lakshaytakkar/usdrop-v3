

import { Header } from '@/components/landing-deprecated/Header';
import { Hero } from '@/components/landing-deprecated/Hero';
import { Marquee } from '@/components/landing-deprecated/Marquee';
import { ProblemSolution } from '@/components/landing-deprecated/ProblemSolution';
import { StepsOverview } from '@/components/landing-deprecated/StepsOverview';
import { FeaturesBento } from '@/components/landing-deprecated/FeaturesBento';
import { DeepDiveFeatures } from '@/components/landing-deprecated/DeepDiveFeatures';
import { AIStudio } from '@/components/landing-deprecated/AIStudio';
import { AutomationFlow } from '@/components/landing-deprecated/AutomationFlow';
import { AdvancedToolsGrid } from '@/components/landing-deprecated/AdvancedToolsGrid';
import { WhyUSDropAI } from '@/components/landing-deprecated/WhyUSDropAI';
import { Testimonials } from '@/components/landing-deprecated/Testimonials';
import { SupportSection } from '@/components/landing-deprecated/SupportSection';
import { Perks } from '@/components/landing-deprecated/Perks';
import { BlueCTA } from '@/components/landing-deprecated/BlueCTA';
import { GrowBusinessCTA } from '@/components/landing-deprecated/GrowBusinessCTA';
import { Blog } from '@/components/landing-deprecated/Blog';
import { Footer } from '@/components/landing-deprecated/Footer';
import { ChatBot } from '@/components/landing-deprecated/ChatBot';
import { GeneratedImage } from '@/components/landing-deprecated/ui';

/**
 * Landing Page - Optimized Conversion Sequence
 * 
 * SECTION FLOW:
 * 1. Hero - Hook & value proposition
 * 2. Marquee - Social proof (brands/logos)
 * 3. Problem/Solution - Pain point identification
 * 4. Steps Overview - How it works (3-step process)
 * 5. Features Bento - Core value propositions
 * 6. Product Research Tools - Discover section (DeepDiveFeatures)
 * 7. AI Studio - Create section
 * 8. Automation Flow - Fulfillment/Scale section
 * 9. Advanced Tools Grid - Power user tools
 * 10. Why USDrop AI - Comparison/competitive advantage
 * 11. Testimonials - Social proof
 * 12. Support & Perks - Trust builders
 * 13. CTA - Conversion block
 * 14. Blog - Content marketing
 * 15. Footer - Navigation & links
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main>
        {/* 1. HERO - Hook & Value Proposition */}
        <Hero />
        
        {/* 2. MARQUEE - Social Proof (Brands/Logos) */}
        <Marquee />
        
        {/* 3. PROBLEM/SOLUTION - Pain Point Identification */}
        <ProblemSolution />
        
        {/* 4. STEPS OVERVIEW - How It Works (3-Step Process) */}
        <StepsOverview />
        
        {/* 5. FEATURES BENTO - Core Value Propositions */}
        <FeaturesBento />
        
        {/* 6. PRODUCT RESEARCH TOOLS - Discover Section */}
        <DeepDiveFeatures />
        
        {/* 7. AI STUDIO - Create Section */}
        <AIStudio />
        
        {/* 8. AUTOMATION FLOW - Fulfillment/Scale Section */}
        <AutomationFlow />
        
        {/* 9. ADVANCED TOOLS GRID - Power User Tools */}
        <AdvancedToolsGrid />
        
        {/* 10. WHY USDROP AI - Comparison/Competitive Advantage */}
        <WhyUSDropAI />
        
        {/* 11. TESTIMONIALS - Social Proof */}
        <Testimonials />
        
        {/* 12. SUPPORT & PERKS - Trust Builders */}
        <SupportSection />
        <Perks />
        
        {/* 13. CTA - Conversion Block */}
        <BlueCTA />
        
        {/* 13b. Grow Business CTA - New Design from Figma */}
        <GrowBusinessCTA />
        
        {/* 14. BLOG - Content Marketing */}
        <Blog />
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
