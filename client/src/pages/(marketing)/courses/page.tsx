import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function CoursesPage() {
  return (
    <FeaturePageTemplate
      badge="Full Courses"
      headline={
        <>
          Master Dropshipping with{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Complete Courses
          </span>
        </>
      }
      subtext="From beginner basics to advanced scaling — structured learning paths that take you from zero to pro."
      ctaText="Start Learning"
      heroImage="/images/marketing/mentorship-hero.png"
      heroImageAlt="Complete dropshipping courses"
      accentColor="#6366F1"
      sectionBadge="The Path"
      sectionTitle="Structured Learning, Real Results"
      steps={[
        { title: "Beginner Modules", description: "Start with the fundamentals.", image: "/images/marketing/mentorship-hero.png" },
        { title: "Advanced Strategy", description: "Scale with proven techniques.", image: "/images/marketing/mentorship-hero.png" },
        { title: "Get Certified", description: "Earn your completion certificate.", image: "/images/marketing/mentorship-hero.png" },
      ]}
      ctaBanner={{
        title: "Your shortcut to dropshipping mastery.",
        subtitle: "Everything you need to learn — organized, structured, and actionable.",
        buttonText: "Start Free",
      }}
    />
  )
}
