import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function FulfilmentMarketingPage() {
  return (
    <FeaturePageTemplate
      badge="Fulfilment"
      headline={
        <>
          We Pack & Ship{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            For You
          </span>
        </>
      }
      subtext="From our warehouse to your customer's door. Fast, reliable fulfilment in under 7 days."
      ctaText="Start Fulfilling Orders"
      heroImage="/images/marketing/fulfilment-hero.png"
      heroImageAlt="Order fulfilment dashboard"
      accentColor="#6366F1"
      sectionBadge="How It Works"
      sectionTitle="Fulfilment on Autopilot"
      steps={[
        {
          title: "Connect Your Store",
          description: "Orders sync automatically.",
          image: "/images/marketing/fulfilment-hero.png",
        },
        {
          title: "We Pack & Label",
          description: "Professional packaging, every time.",
          image: "/images/marketing/fulfilment-hero.png",
        },
        {
          title: "Fast Delivery",
          description: "Delivered in under 7 days.",
          image: "/images/marketing/fulfilment-hero.png",
        },
        {
          title: "Auto Tracking",
          description: "Customers get live updates.",
          image: "/images/marketing/fulfilment-hero.png",
        },
      ]}
      ctaBanner={{
        title: "Stop handling shipments yourself.",
        subtitle:
          "Let us handle packing, shipping, and tracking — so you can focus on selling.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
