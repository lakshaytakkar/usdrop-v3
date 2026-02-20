import { FeaturePageTemplate } from "@/pages/(marketing)/components/FeaturePageTemplate"

export default function LiveSessionsPage() {
  return (
    <FeaturePageTemplate
      badge="Live Learning"
      headline={
        <>
          Learn Live from{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Expert Mentors
          </span>
        </>
      }
      subtext="Join weekly live sessions with experienced dropshippers. Ask questions, get answers, grow faster."
      ctaText="Join Next Session"
      heroImage="/images/marketing/live-sessions-hero.png"
      heroImageAlt="Live sessions with expert mentors"
      accentColor="#6366F1"
      sectionBadge="What You Get"
      sectionTitle="Interactive Learning That Works"
      steps={[
        { title: "Live Q&A", description: "Ask anything and get real answers.", image: "/images/marketing/live-sessions-hero.png" },
        { title: "Screen Sharing", description: "Watch experts build stores live.", image: "/images/marketing/live-sessions-hero.png" },
        { title: "Replays", description: "Missed a session? Watch it anytime.", image: "/images/marketing/live-sessions-hero.png" },
      ]}
      ctaBanner={{
        title: "Learning alone is hard. Learning live isn't.",
        subtitle: "Get direct access to mentors who've built profitable stores.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
