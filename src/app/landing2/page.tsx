"use client"

import { Header } from '@/components/landing2/Header';
import { Hero } from '@/components/landing2/Hero';
import { BrandsMarquee } from '@/components/landing2/BrandsMarquee';
import { Features2 } from '@/components/landing2/Features2';
import { ContentSection } from '@/components/landing2/ContentSection';
import { Features11 } from '@/components/landing2/Features11';
import { Integrations } from '@/components/landing2/Integrations';
import { Projects } from '@/components/landing2/Projects';
import { Reviews } from '@/components/landing2/Reviews';
import { Banner } from '@/components/landing2/Banner';
import { Newsletter } from '@/components/landing2/Newsletter';
import { Footer } from '@/components/landing2/Footer';

export default function Landing2Page() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      
      <main>
        <Hero />
        <BrandsMarquee />
        <Features2 />
        <ContentSection 
          id="lnk-1"
          title="Find Winning Products Before They Go Viral"
          description="Discover high-margin products with real-time intelligence. We analyze millions of data points from top-performing stores to surface the next big thing before it becomes saturated."
          image="/landing/dashboard-preview.png"
          imagePosition="right"
          videoUrl="https://www.youtube.com/embed/SZEflIVnhH8"
          showVideoButton={true}
        />
        <Features11 />
        <ContentSection 
          id="lnk-2"
          title="Scale Your Dropshipping Business"
          description="From product research to automated fulfillment, we provide the complete stack to build a 7-figure dropshipping brand. No inventory needed. No warehouse. Just pure profit."
          image="/landing/product-discovery-banner.png"
          imagePosition="left"
        />
        <ContentSection 
          id="lnk-3"
          title="Automate Your Entire Workflow"
          description="Connect suppliers, push products to Shopify, and automate fulfillment—all in one platform. Stop juggling multiple tools and start scaling your business."
          image="/landing/ai-studio-model.png"
          imagePosition="right"
        />
        <Integrations />
        <Projects />
        <Reviews />
        <Banner />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

