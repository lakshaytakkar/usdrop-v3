import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function WinningProductsMarketingPage() {
  return (
    <FeaturePageTemplate
      badge="Product Research"
      headline={
        <>
          Find{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Winning Products
          </span>{" "}
          Before Everyone Else
        </>
      }
      subtext="AI scans thousands of products daily so you pick winners, not guesses."
      ctaText="Start Finding Products"
      heroImage="/images/marketing/winning-products-hero.png"
      heroImageAlt="Winning products research dashboard"
      painPoints={{
        heading: "The struggle without data",
        items: [
          {
            emoji: "😩",
            label: "Time Sink",
            title: "Endless scrolling through AliExpress",
            description: "Hours wasted browsing suppliers with no way to tell what actually sells.",
          },
          {
            emoji: "🎲",
            label: "Guesswork",
            title: "No idea what margins look like",
            description: "You list a product, run ads, and pray the math works out.",
          },
          {
            emoji: "💸",
            label: "Wasted Budget",
            title: "Testing products that flop",
            description: "Every failed test costs money. Without data, most products never sell.",
          },
        ],
      }}
      benefits={{
        heading: "Why sellers choose USDrop",
        items: [
          {
            title: "AI finds winners for you",
            description: "Our algorithm scans thousands of products daily and surfaces the ones with real sales velocity, rising trends, and proven demand — so you skip the guesswork.",
            image: "/images/marketing/winning-products-hero.png",
          },
          {
            title: "See real margins instantly",
            description: "Every product shows supplier cost, recommended price, shipping fees, and estimated profit margin — before you commit a single dollar.",
            image: "/images/marketing/winning-products-hero.png",
          },
          {
            title: "One-click import to your store",
            description: "Found a winner? Import it directly to Shopify with optimized descriptions, images, and pricing. Ready to sell in seconds.",
            image: "/images/marketing/winning-products-hero.png",
          },
        ],
      }}
      steps={[
        { title: "Search or browse trending products", description: "Filter by niche, category, or engagement metrics to find products with real demand." },
        { title: "Analyze margins and competition", description: "See supplier costs, recommended pricing, competitor count, and estimated profit per sale." },
        { title: "Import and start selling", description: "Push products to your Shopify store in one click with AI-written descriptions and optimized images." },
      ]}
      ctaBanner={{
        title: "Ready to find your next winner?",
        subtitle: "Join thousands of sellers who discover profitable products every day.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
