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
      subtext="Weekly live sessions with experienced dropshippers. Ask questions, get answers, grow faster."
      ctaText="Join Next Session"
      heroImage="/images/marketing/live-sessions-hero.png"
      heroImageAlt="Live sessions with expert mentors"
      painPoints={{
        heading: "The struggle of learning alone",
        items: [
          {
            emoji: "🤷",
            label: "Stuck",
            title: "No one to ask when you're stuck",
            description: "You hit a wall and have no mentor, no community, and no way to get unstuck quickly.",
          },
          {
            emoji: "📖",
            label: "Theory Only",
            title: "Learning without seeing it done",
            description: "Reading about strategies is different from watching an expert execute them in real time.",
          },
          {
            emoji: "🔄",
            label: "Slow Progress",
            title: "Making the same mistakes twice",
            description: "Without feedback, you repeat costly errors that a mentor would catch in seconds.",
          },
        ],
      }}
      benefits={{
        heading: "Why sellers choose USDrop Sessions",
        items: [
          {
            title: "Live Q&A with real experts",
            description: "Ask your specific questions and get answers from mentors who've built profitable stores. No generic advice — real answers for your real situation.",
            image: "/images/marketing/live-sessions-hero.png",
          },
          {
            title: "Watch experts build stores live",
            description: "Screen-sharing sessions where mentors walk through product research, store setup, ad creation, and scaling — step by step, in real time.",
            image: "/images/marketing/live-sessions-hero.png",
          },
          {
            title: "Replays available anytime",
            description: "Missed a session? Every live session is recorded and available in your dashboard. Rewatch the parts that matter most to you.",
            image: "/images/marketing/live-sessions-hero.png",
          },
        ],
      }}
      steps={[
        { title: "Join a scheduled session", description: "Browse upcoming live sessions and register for topics that match where you are in your journey." },
        { title: "Learn interactively", description: "Watch the mentor's screen, ask questions in real time, and get personalized guidance." },
        { title: "Rewatch and apply", description: "Access recordings anytime. Replay key moments and apply what you learned to your store." },
      ]}
      ctaBanner={{
        title: "Learning alone is hard. Learning live isn't.",
        subtitle: "Get direct access to mentors who've built profitable stores.",
        buttonText: "Get Started Free",
      }}
    />
  )
}
