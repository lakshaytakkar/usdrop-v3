import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function WinningAdsMarketingPage() {
  return (
    <FeaturePageTemplate
      badge="Ad Intelligence"
      headline={
        <>
          Discover{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Winning Ads
          </span>{" "}
          That Actually Convert
        </>
      }
      subtext="See exactly which ads are driving sales. Analyze creatives, copy, and targeting from top-performing brands."
      ctaText="Explore Winning Ads"
      heroImage="/images/marketing/winning-ads-hero.png"
      heroImageAlt="Winning ads intelligence dashboard"
      accentColor="#6366F1"
      sectionBadge="How It Works"
      sectionTitle="Spy, Learn, and Launch in Minutes"
      steps={[
        { title: "Search Ads", description: "Filter by niche, platform, or engagement.", image: "/images/marketing/winning-ads-hero.png" },
        { title: "Study Creatives", description: "Break down what makes them work.", image: "/images/marketing/winning-ads-hero.png" },
        { title: "Launch Yours", description: "Use proven patterns for your campaigns.", image: "/images/marketing/winning-ads-hero.png" },
      ]}
      ctaBanner={{
        title: "Stop guessing. Start winning.",
        subtitle: "Access the ad creatives that top stores are using right now.",
        buttonText: "Try It Free",
      }}
    />
  )
}
