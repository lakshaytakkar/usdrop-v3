import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function BlogPage() {
  return (
    <FeaturePageTemplate
      badge="Resources"
      headline={
        <>
          Tips, Guides &{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Industry Insights
          </span>
        </>
      }
      subtext="Stay ahead with the latest dropshipping strategies, case studies, and expert tips — all free."
      ctaText="Read the Blog"
      heroImage="/images/marketing/blogs-hero.png"
      heroImageAlt="Dropshipping blog and resources"
      accentColor="#6366F1"
      sectionBadge="Featured"
      sectionTitle="Fresh Content Every Week"
      steps={[
        { title: "Guides & Tutorials", description: "Step-by-step breakdowns.", image: "/images/marketing/blogs-hero.png" },
        { title: "Case Studies", description: "Real results from real stores.", image: "/images/marketing/blogs-hero.png" },
        { title: "Industry News", description: "Stay ahead of trends.", image: "/images/marketing/blogs-hero.png" },
      ]}
      ctaBanner={{
        title: "Knowledge is your competitive edge.",
        subtitle: "Free guides, tips, and strategies updated every week.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
