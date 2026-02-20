import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function LiveDashboardPage() {
  return (
    <FeaturePageTemplate
      badge="Live Analytics"
      headline={
        <>
          Your{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Live Dashboard
          </span>{" "}
          for Real-Time Sales
        </>
      }
      subtext="Track orders, revenue, and profit margins as they happen. Everything you need to know — in one place."
      ctaText="See Your Dashboard"
      heroImage="/images/marketing/dashboard-hero.png"
      heroImageAlt="Live dashboard showing real-time sales analytics"
      accentColor="#6366F1"
      sectionBadge="Features"
      sectionTitle="Everything at a Glance"
      steps={[
        { title: "Real-Time Orders", description: "See new orders the moment they arrive.", image: "/images/marketing/dashboard-hero.png" },
        { title: "Revenue Tracking", description: "Daily, weekly, and monthly breakdowns.", image: "/images/marketing/dashboard-hero.png" },
        { title: "Profit Margins", description: "Know your actual profit on every sale.", image: "/images/marketing/dashboard-hero.png" },
      ]}
      ctaBanner={{
        title: "Run your store with confidence.",
        subtitle: "Real-time data means real-time decisions. See everything that matters.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
