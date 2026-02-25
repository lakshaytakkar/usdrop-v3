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
      subtext="Track orders, revenue, and profit margins as they happen. Everything in one place."
      ctaText="See Your Dashboard"
      heroImage="/images/marketing/dashboard-hero.png"
      heroImageAlt="Live dashboard showing real-time sales analytics"
      painPoints={{
        heading: "The struggle without visibility",
        items: [
          {
            emoji: "📊",
            label: "Scattered Data",
            title: "Logging into 5 different tools",
            description: "Shopify, ad platforms, supplier portals, spreadsheets — your data lives everywhere except one place.",
          },
          {
            emoji: "⏰",
            label: "Delays",
            title: "No real-time visibility",
            description: "By the time you check yesterday's numbers, you've already missed today's opportunity.",
          },
          {
            emoji: "📋",
            label: "Manual Work",
            title: "Spreadsheets everywhere",
            description: "You're copying data between tabs, building formulas, and still not sure if the numbers are right.",
          },
        ],
      }}
      benefits={{
        heading: "Why sellers choose USDrop Dashboard",
        items: [
          {
            title: "Everything in one dashboard",
            description: "Orders, revenue, profit margins, ad spend, and fulfillment status — all updated in real time on a single screen. No more tab-switching.",
            image: "/images/marketing/dashboard-hero.png",
          },
          {
            title: "Real-time profit tracking",
            description: "See your actual profit on every order as it happens. Factor in product cost, shipping, ad spend, and fees automatically — no manual calculations.",
            image: "/images/marketing/dashboard-hero.png",
          },
          {
            title: "Data-driven decisions, instantly",
            description: "Spot winning products, kill losers, and double down on what works — all based on live data, not gut feeling.",
            image: "/images/marketing/dashboard-hero.png",
          },
        ],
      }}
      steps={[
        { title: "Connect your store", description: "Link your Shopify store and ad accounts. Data starts flowing in immediately." },
        { title: "Watch your numbers update live", description: "See orders, revenue, and profit margins update in real time as sales come in." },
        { title: "Make smarter decisions", description: "Use daily breakdowns, product-level analytics, and trend charts to optimize your business." },
      ]}
      ctaBanner={{
        title: "Run your store with confidence.",
        subtitle: "Real-time data means real-time decisions. See everything that matters.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
