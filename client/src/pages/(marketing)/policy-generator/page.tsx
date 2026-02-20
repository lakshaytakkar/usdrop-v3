import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function PolicyGeneratorPage() {
  return (
    <FeaturePageTemplate
      badge="Legal Tools"
      headline={
        <>
          Generate Store Policies in{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            One Click
          </span>
        </>
      }
      subtext="Privacy policy, terms of service, return policy — all generated and ready to publish."
      ctaText="Generate Policies"
      heroImage="/images/marketing/policy-gen-hero.png"
      heroImageAlt="Policy generator"
      accentColor="#6366F1"
      sectionBadge="Policies"
      sectionTitle="Every Policy Your Store Needs"
      steps={[
        {
          title: "Privacy Policy",
          description: "GDPR & CCPA compliant.",
          image: "/images/marketing/policy-gen-hero.png",
        },
        {
          title: "Terms of Service",
          description: "Protect your business legally.",
          image: "/images/marketing/policy-gen-hero.png",
        },
        {
          title: "Return Policy",
          description: "Clear returns build trust.",
          image: "/images/marketing/policy-gen-hero.png",
        },
      ]}
      ctaBanner={{
        title: "Don't risk running without policies.",
        subtitle: "Professional, compliant store policies generated in seconds.",
        buttonText: "Generate Now",
      }}
    />
  )
}
