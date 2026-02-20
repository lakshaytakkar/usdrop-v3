import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function EmailTemplatesPage() {
  return (
    <FeaturePageTemplate
      badge="Email Marketing"
      headline={
        <>
          Ready-to-Send{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Email Templates
          </span>
        </>
      }
      subtext="Professional email templates for every stage — from welcome sequences to abandoned cart recovery."
      ctaText="Browse Templates"
      heroImage="/images/marketing/email-templates-hero.png"
      heroImageAlt="Email templates"
      accentColor="#6366F1"
      sectionBadge="Templates"
      sectionTitle="Emails for Every Occasion"
      steps={[
        {
          title: "Welcome Emails",
          description: "Make a great first impression.",
          image: "/images/marketing/email-templates-hero.png",
        },
        {
          title: "Cart Recovery",
          description: "Win back abandoned carts.",
          image: "/images/marketing/email-templates-hero.png",
        },
        {
          title: "Follow-Ups",
          description: "Keep customers coming back.",
          image: "/images/marketing/email-templates-hero.png",
        },
      ]}
      ctaBanner={{
        title: "Emails that drive revenue.",
        subtitle: "Proven templates used by successful stores. Just customize and send.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
