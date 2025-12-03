import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { ProductSwipe } from './components/ProductSwipe';
import { StepsOverview } from './components/StepsOverview';
import { FeaturesBento } from './components/FeaturesBento';
import { AIStudio } from './components/AIStudio';
import { DeepDiveFeatures } from './components/DeepDiveFeatures';
import { AdvancedToolsGrid } from './components/AdvancedToolsGrid';
import { AutomationFlow } from './components/AutomationFlow';
import { ProfitCalculator } from './components/ProfitCalculator';
import { BlueCTA } from './components/BlueCTA';
import { SupportSection } from './components/SupportSection';
import { Testimonials } from './components/Testimonials';
import { Perks } from './components/Perks';
import { Blog } from './components/Blog';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import { GeneratedImage } from './components/ui';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main>
        <Hero />
        <Marquee />
        
        {/* Engagement Hook: Interactive Swipe */}
        <ProductSwipe />
        
        {/* The Lifecycle Explanation */}
        <StepsOverview />
        
        {/* The Core Features Bento Grid */}
        <FeaturesBento />
        
        {/* Deep Dives */}
        <AIStudio />
        <AutomationFlow />
        <DeepDiveFeatures />
        
        {/* Tools & Utilities */}
        <AdvancedToolsGrid />
        <ProfitCalculator />
        
        {/* Conversion Block */}
        <BlueCTA />
        
        {/* Trust & Support */}
        <SupportSection />
        <Testimonials />
        <Perks />
        
        {/* World Map Section */}
        <section className="py-24 bg-white text-center">
           <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-slate-900 mb-12">Start selling in a rapidly <br/>growing industry</h2>
              <div className="aspect-[2/1] w-full relative">
                 <GeneratedImage 
                    prompt="minimalist clean world map illustration, light grey on white background, subtle blue dots for active users"
                    className="w-full h-full object-contain"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent h-24 bottom-0" />
              </div>
           </div>
        </section>

        <Blog />
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;