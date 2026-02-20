import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function RoadmapPage() {
  return (
    <FeaturePageTemplate
      badge="Your Journey"
      headline={
        <>
          Your Step-by-Step Path to{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Dropshipping Success
          </span>
        </>
      }
      subtext="Follow a guided roadmap from zero to your first sale. Every step is mapped out — just follow the path."
      ctaText="Start Your Journey"
      heroImage="/images/marketing/roadmap-hero.png"
      heroImageAlt="Roadmap dashboard showing your dropshipping journey"
      accentColor="#6366F1"
      sectionBadge="Your Path"
      sectionTitle="Built for Beginners, Designed for Growth"
      steps={[
        { title: "Set Your Goals", description: "Define your niche and target market.", image: "/images/marketing/roadmap-hero.png" },
        { title: "Follow the Steps", description: "Complete tasks at your own pace.", image: "/images/marketing/roadmap-hero.png" },
        { title: "Track Progress", description: "See how far you've come, always.", image: "/images/marketing/roadmap-hero.png" },
      ]}
      ctaBanner={{
        title: "No more wondering what to do next.",
        subtitle: "Your entire dropshipping journey — mapped, tracked, and guided.",
        buttonText: "Start Your Roadmap",
      }}
    />
  )
}
