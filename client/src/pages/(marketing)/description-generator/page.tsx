import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function DescriptionGeneratorPage() {
  return (
    <FeaturePageTemplate
      badge="AI Writing"
      headline={
        <>
          Write Product Descriptions That{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Sell
          </span>
        </>
      }
      subtext="AI-powered descriptions that convert browsers into buyers. Just paste your product — we do the rest."
      ctaText="Generate Descriptions"
      heroImage="/images/marketing/description-gen-hero.png"
      heroImageAlt="AI description generator"
      accentColor="#6366F1"
      sectionBadge="How It Works"
      sectionTitle="From Product to Copy in Seconds"
      steps={[
        {
          title: "Paste Your Product",
          description: "Add a link or product details.",
          image: "/images/marketing/description-gen-hero.png",
        },
        {
          title: "AI Writes It",
          description: "Get SEO-optimized copy instantly.",
          image: "/images/marketing/description-gen-hero.png",
        },
        {
          title: "Copy & Publish",
          description: "Paste it straight into your store.",
          image: "/images/marketing/description-gen-hero.png",
        },
      ]}
      ctaBanner={{
        title: "Stop staring at blank pages.",
        subtitle: "Let AI write descriptions that actually convert.",
        buttonText: "Try It Free",
      }}
    />
  )
}
