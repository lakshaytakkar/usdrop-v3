import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function ProfitCalculatorPage() {
  return (
    <FeaturePageTemplate
      badge="Financial Tools"
      headline={
        <>
          Know Your{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Profit
          </span>{" "}
          Before You Sell
        </>
      }
      subtext="Calculate margins, break-even points, and ROI before listing a product. No surprises."
      ctaText="Calculate Profits"
      heroImage="/images/marketing/profit-calc-hero.png"
      heroImageAlt="Profit calculator"
      accentColor="#6366F1"
      sectionBadge="Features"
      sectionTitle="Every Number You Need"
      steps={[
        {
          title: "Input Costs",
          description: "Product, shipping, and ad spend.",
          image: "/images/marketing/profit-calc-hero.png",
        },
        {
          title: "Set Your Price",
          description: "See margins in real time.",
          image: "/images/marketing/profit-calc-hero.png",
        },
        {
          title: "Know Your ROI",
          description: "Make data-driven decisions.",
          image: "/images/marketing/profit-calc-hero.png",
        },
      ]}
      ctaBanner={{
        title: "Stop selling products at a loss.",
        subtitle: "Every successful dropshipper knows their numbers. Now you can too.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
