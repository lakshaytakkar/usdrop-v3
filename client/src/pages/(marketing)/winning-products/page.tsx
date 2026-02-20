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
      subtext="Access real-time data on trending products, profit margins, and supplier details — so you pick winners, not guesses."
      ctaText="Start Finding Products"
      heroImage="/images/marketing/winning-products-hero.png"
      heroImageAlt="Winning products research dashboard"
      accentColor="#6366F1"
      sectionBadge="How It Works"
      sectionTitle="From Research to Revenue in 3 Steps"
      steps={[
        { title: "Browse Trends", description: "See what's selling right now.", image: "/images/marketing/winning-products-hero.png" },
        { title: "Analyze Margins", description: "Know your profit before you sell.", image: "/images/marketing/winning-products-hero.png" },
        { title: "Import & Sell", description: "Add to your store in one click.", image: "/images/marketing/winning-products-hero.png" },
      ]}
      ctaBanner={{
        title: "Ready to find your next winning product?",
        subtitle: "Join thousands of dropshippers who discover profitable products daily.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
