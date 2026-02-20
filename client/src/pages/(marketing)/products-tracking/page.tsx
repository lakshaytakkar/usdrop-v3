import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function ProductsTrackingPage() {
  return (
    <FeaturePageTemplate
      badge="Product Management"
      headline={
        <>
          Track Every Product in{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            One Place
          </span>
        </>
      }
      subtext="Monitor saved products, track prices, and manage inventory — all from a single dashboard."
      ctaText="Start Tracking Products"
      heroImage="/images/marketing/products-hero.png"
      heroImageAlt="Product tracking dashboard for managing inventory"
      accentColor="#6366F1"
      sectionBadge="Features"
      sectionTitle="Smart Product Management"
      steps={[
        { title: "Save Products", description: "Bookmark winners from any source.", image: "/images/marketing/products-hero.png" },
        { title: "Monitor Prices", description: "Get alerts when prices change.", image: "/images/marketing/products-hero.png" },
        { title: "Manage Inventory", description: "Track stock across all suppliers.", image: "/images/marketing/products-hero.png" },
      ]}
      ctaBanner={{
        title: "Never lose track of a winning product.",
        subtitle: "Organize, monitor, and manage your entire product portfolio.",
        buttonText: "Try It Free",
      }}
    />
  )
}
