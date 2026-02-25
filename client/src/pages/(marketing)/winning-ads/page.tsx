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
      subtext="See exactly which ads drive sales. Analyze creatives, copy, and targeting from top performers."
      ctaText="Explore Winning Ads"
      heroImage="/images/marketing/winning-ads-hero.png"
      heroImageAlt="Winning ads intelligence dashboard"
      painPoints={{
        heading: "The struggle without intel",
        items: [
          {
            emoji: "🔥",
            label: "Burned Budget",
            title: "Creating ads that don't convert",
            description: "You design creatives from scratch, launch them, and watch your ad spend disappear.",
          },
          {
            emoji: "🙈",
            label: "Blind Spots",
            title: "No idea what competitors run",
            description: "Your competitors are scaling ads that work — and you can't see any of them.",
          },
          {
            emoji: "🎯",
            label: "No Direction",
            title: "Guessing angles and hooks",
            description: "Without data on what's performing, every creative decision is a coin flip.",
          },
        ],
      }}
      benefits={{
        heading: "Why sellers choose USDrop Ads",
        items: [
          {
            title: "See what ads are working right now",
            description: "Browse a live library of high-performing ads across niches. Filter by platform, engagement, and format to find ads that are actually driving revenue.",
            image: "/images/marketing/winning-ads-hero.png",
          },
          {
            title: "Break down winning creative patterns",
            description: "Study the hooks, copy angles, and visual formats that top brands use. Understand why an ad works — then apply those patterns to yours.",
            image: "/images/marketing/winning-ads-hero.png",
          },
          {
            title: "Launch proven ad formats faster",
            description: "Stop designing from zero. Use winning templates and proven structures to create high-converting creatives in minutes, not days.",
            image: "/images/marketing/winning-ads-hero.png",
          },
        ],
      }}
      steps={[
        { title: "Search ads by niche or platform", description: "Filter the ad library by product category, platform, engagement level, or ad format." },
        { title: "Study what makes them work", description: "Analyze the hook, copy structure, visual style, and call-to-action of each winning ad." },
        { title: "Launch your own version", description: "Use proven patterns to create your creatives and launch campaigns with confidence." },
      ]}
      ctaBanner={{
        title: "Stop guessing. Start winning.",
        subtitle: "Access the ad creatives that top stores are using right now.",
        buttonText: "Try It Free",
      }}
    />
  )
}
