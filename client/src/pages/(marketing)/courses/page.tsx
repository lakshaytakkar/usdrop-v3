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
      subtext="Structured learning paths that take you from zero to profitable — no fluff, just results."
      ctaText="Start Learning"
      heroImage="/images/marketing/mentorship-hero.png"
      heroImageAlt="Complete dropshipping courses"
      painPoints={{
        heading: "The struggle without guidance",
        items: [
          {
            emoji: "📺",
            label: "Information Overload",
            title: "Watching random YouTube videos",
            description: "You've binged hours of content but still don't know what to do first, second, or third.",
          },
          {
            emoji: "🗺️",
            label: "No Structure",
            title: "No clear learning path",
            description: "Bits and pieces from different sources that don't connect into an actionable plan.",
          },
          {
            emoji: "📅",
            label: "Outdated",
            title: "Advice from 2 years ago",
            description: "Strategies that worked in 2023 don't work now. Most free content is dangerously outdated.",
          },
        ],
      }}
      benefits={{
        heading: "Why sellers choose USDrop Courses",
        items: [
          {
            title: "Complete A-to-Z courses",
            description: "From choosing your first niche to scaling past $10K/month — every step is covered in order. No guessing what comes next.",
            image: "/images/marketing/mentorship-hero.png",
          },
          {
            title: "Updated strategies that work now",
            description: "Our courses are updated regularly with current tactics, platform changes, and winning strategies. What you learn today, you can apply today.",
            image: "/images/marketing/mentorship-hero.png",
          },
          {
            title: "Learn at your own pace",
            description: "Watch lessons on your schedule. Replay complex topics. Track your progress across modules. No pressure, no deadlines.",
            image: "/images/marketing/mentorship-hero.png",
          },
        ],
      }}
      steps={[
        { title: "Pick your course", description: "Choose from beginner fundamentals, advanced scaling, or niche-specific strategies." },
        { title: "Learn step by step", description: "Follow structured modules with video lessons, actionable checklists, and real examples." },
        { title: "Apply and grow", description: "Put what you learn into practice immediately. Track your progress as you build your store." },
      ]}
      ctaBanner={{
        title: "Your shortcut to dropshipping mastery.",
        subtitle: "Everything you need to learn — organized, structured, and actionable.",
        buttonText: "Start Free",
      }}
    />
  )
}
