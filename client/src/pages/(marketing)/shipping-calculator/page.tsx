import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function ShippingCalculatorPage() {
  return (
    <FeaturePageTemplate
      badge="Logistics"
      headline={
        <>
          Estimate{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Shipping Costs
          </span>{" "}
          Worldwide
        </>
      }
      subtext="Compare carriers, delivery times, and costs to any country. Plan your margins with confidence."
      ctaText="Calculate Shipping"
      heroImage="/images/marketing/shipping-calc-hero.png"
      heroImageAlt="Shipping calculator"
      accentColor="#6366F1"
      sectionBadge="Features"
      sectionTitle="Global Shipping, Simplified"
      steps={[
        {
          title: "Select Destination",
          description: "Choose from 200+ countries.",
          image: "/images/marketing/shipping-calc-hero.png",
        },
        {
          title: "Compare Carriers",
          description: "See rates side by side.",
          image: "/images/marketing/shipping-calc-hero.png",
        },
        {
          title: "Estimate Delivery",
          description: "Know exact delivery windows.",
          image: "/images/marketing/shipping-calc-hero.png",
        },
      ]}
      ctaBanner={{
        title: "No more shipping surprises.",
        subtitle: "Know exactly what shipping costs before you list a product.",
        buttonText: "Try It Free",
      }}
    />
  )
}
