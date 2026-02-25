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
      subtext="Reverse-engineer successful stores. See their products, traffic, and strategies."
      ctaText="Start Analyzing Stores"
      heroImage="/images/marketing/winning-stores-hero.png"
      heroImageAlt="Store research and competitive intelligence dashboard"
      painPoints={{
        heading: "The struggle without intelligence",
        items: [
          {
            emoji: "🏗️",
            label: "Building Blind",
            title: "No idea what top stores look like",
            description: "You're designing your store from scratch with zero reference points for what actually converts.",
          },
          {
            emoji: "🔍",
            label: "No Visibility",
            title: "Can't see what competitors sell",
            description: "Their best-selling products, pricing strategy, and supplier sources are invisible to you.",
          },
          {
            emoji: "📉",
            label: "Wasted Effort",
            title: "Copying stores that don't work",
            description: "Without revenue data, you might be imitating stores that are barely breaking even.",
          },
        ],
      }}
      benefits={{
        heading: "Why sellers choose USDrop Stores",
        items: [
          {
            title: "See top stores in any niche",
            description: "Browse a curated database of successful Shopify stores. Filter by niche, estimated revenue, product count, and traffic source to find stores worth studying.",
            image: "/images/marketing/winning-stores-hero.png",
          },
          {
            title: "Reverse-engineer their best sellers",
            description: "See exactly which products each store is selling, their pricing strategy, and how many units they move. Learn what works before you build.",
            image: "/images/marketing/winning-stores-hero.png",
          },
          {
            title: "Apply proven strategies to yours",
            description: "Take the product selection, pricing, and store structure that's already working — and adapt it for your own brand. Build on success, not assumptions.",
            image: "/images/marketing/winning-stores-hero.png",
          },
        ],
      }}
      steps={[
        { title: "Search stores by niche or revenue", description: "Filter by product category, estimated monthly revenue, platform, or traffic volume." },
        { title: "Deep dive into their catalog", description: "See their best-selling products, pricing, new arrivals, and which items drive the most traffic." },
        { title: "Apply insights to your store", description: "Use what you learn to choose products, set prices, and structure your store for conversions." },
      ]}
      ctaBanner={{
        title: "Know your competition inside out.",
        subtitle: "The most successful sellers study what works. So should you.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
