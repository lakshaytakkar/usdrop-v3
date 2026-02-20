import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function WinningStoresMarketingPage() {
  return (
    <FeaturePageTemplate
      badge="Store Research"
      headline={
        <>
          Analyze the{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Top Stores
          </span>{" "}
          in Any Niche
        </>
      }
      subtext="Reverse-engineer successful stores. See their products, traffic, and strategies — then build yours better."
      ctaText="Start Analyzing Stores"
      heroImage="/images/marketing/winning-stores-hero.png"
      heroImageAlt="Store research and competitive intelligence dashboard"
      accentColor="#6366F1"
      sectionBadge="How It Works"
      sectionTitle="Competitive Intelligence Made Simple"
      steps={[
        { title: "Find Stores", description: "Search by niche, revenue, or platform.", image: "/images/marketing/winning-stores-hero.png" },
        { title: "Deep Dive", description: "See their best sellers and traffic sources.", image: "/images/marketing/winning-stores-hero.png" },
        { title: "Apply Insights", description: "Build your store with proven strategies.", image: "/images/marketing/winning-stores-hero.png" },
      ]}
      ctaBanner={{
        title: "Know your competition inside out.",
        subtitle: "The most successful dropshippers study what works. So should you.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
