import { Link } from "wouter"
import { ArrowRight } from "lucide-react"
import { Header } from "./Header"

interface FeatureStep {
  title: string
  description: string
  image: string
}

interface FeaturePageProps {
  badge: string
  badgeIcon?: React.ReactNode
  headline: React.ReactNode
  subtext: string
  ctaText: string
  ctaHref?: string
  heroImage: string
  heroImageAlt: string
  accentColor?: string
  sectionTitle?: string
  sectionBadge?: string
  steps: FeatureStep[]
  ctaBanner: {
    title: string
    subtitle: string
    buttonText: string
  }
}

export function FeaturePageTemplate({
  badge,
  badgeIcon,
  headline,
  subtext,
  ctaText,
  ctaHref = "/signup",
  heroImage,
  heroImageAlt,
  accentColor = "#6366F1",
  sectionTitle,
  sectionBadge,
  steps,
  ctaBanner,
}: FeaturePageProps) {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#F5F3F2" }}>
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
      <div className="absolute top-[32px] left-0 right-0 z-50">
        <Header />
      </div>

      <main className="relative z-[2]">
        <section
          className="pt-[140px] pb-16 px-4 relative"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(195,170,255,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(180,215,255,0.15) 0%, transparent 55%)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 mb-8 shadow-sm">
              {badgeIcon}
              <span className="text-sm font-semibold text-[#323140]">{badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-black leading-[1.1] tracking-tight mb-6">
              {headline}
            </h1>

            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              {subtext}
            </p>

            <Link
              href={ctaHref}
              data-testid="button-hero-cta"
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              style={{ backgroundColor: accentColor }}
            >
              {ctaText}
              <ArrowRight className="size-5" />
            </Link>

            <div className="mt-14 relative mx-auto max-w-3xl">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-gray-100 rounded-md px-4 py-1 text-xs text-gray-400 font-mono">
                      app.usdrop.com
                    </div>
                  </div>
                </div>
                <img
                  src={heroImage}
                  alt={heroImageAlt}
                  className="w-full"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {steps.length > 0 && (
          <section
            className="py-20 relative"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 20% 40%, rgba(220,210,255,0.18) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 80% 60%, rgba(180,230,200,0.12) 0%, transparent 55%)",
            }}
          >
            <div className="max-w-6xl mx-auto px-4">
              {(sectionTitle || sectionBadge) && (
                <div className="text-center mb-12">
                  {sectionBadge && (
                    <div className="inline-flex items-center gap-2 bg-[#323140] text-white rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-5">
                      {sectionBadge}
                    </div>
                  )}
                  {sectionTitle && (
                    <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                      {sectionTitle}
                    </h2>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <div
                className="flex gap-5 overflow-x-auto pb-4 px-4 snap-x snap-mandatory max-w-fit"
                style={{ scrollbarWidth: "none" }}
              >
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[260px] md:w-[290px] snap-center text-center"
                    data-testid={`card-step-${i + 1}`}
                  >
                    <div className="rounded-[20px] overflow-hidden border-2 border-white/80 shadow-sm hover:shadow-md transition-all duration-200 aspect-[3/4]">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-black mt-5">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#323140] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, ${accentColor} 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E8E0FF 0%, transparent 50%)`,
                }}
              />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {ctaBanner.title}
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {ctaBanner.subtitle}
                </p>
                <Link
                  href={ctaHref}
                  data-testid="button-bottom-cta"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#323140] font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
                >
                  {ctaBanner.buttonText}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
