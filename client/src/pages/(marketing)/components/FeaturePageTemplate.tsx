import { Link } from "wouter"
import { ArrowRight } from "lucide-react"
import { Header } from "./Header"
import { Footer } from "./Footer"

interface PainPoint {
  emoji: string
  label: string
  title: string
  description: string
}

interface Benefit {
  title: string
  description: string
  image: string
}

interface FeatureStep {
  title: string
  description: string
}

interface FeaturePageProps {
  badge: string
  headline: React.ReactNode
  subtext: string
  ctaText: string
  ctaHref?: string
  heroImage: string
  heroImageAlt: string
  painPoints?: {
    heading: string
    items: PainPoint[]
  }
  benefits?: {
    heading: string
    items: Benefit[]
  }
  steps: FeatureStep[]
  ctaBanner: {
    title: string
    subtitle: string
    buttonText: string
  }
}

export function FeaturePageTemplate({
  badge,
  headline,
  subtext,
  ctaText,
  ctaHref = "/signup",
  heroImage,
  heroImageAlt,
  painPoints,
  benefits,
  steps,
  ctaBanner,
}: FeaturePageProps) {
  return (
    <div className="relative min-h-screen bg-white">
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
          className="pt-[160px] pb-20 px-4 relative"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(195,170,255,0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(180,215,255,0.10) 0%, transparent 55%)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 mb-8 shadow-sm" data-testid="badge-feature">
              <span className="text-[13px] font-semibold text-[#323140] uppercase tracking-[0.06em]">{badge}</span>
            </div>

            <h1 className="text-[40px] md:text-[52px] lg:text-[64px] font-bold text-black leading-[1.08] tracking-[-1.5px] md:tracking-[-2px] mb-6">
              {headline}
            </h1>

            <p className="text-[17px] md:text-[19px] text-[#666] max-w-xl mx-auto mb-10 leading-[1.5]">
              {subtext}
            </p>

            <Link
              href={ctaHref}
              data-testid="button-hero-cta"
              className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
            >
              {ctaText}
              <ArrowRight className="size-4" />
            </Link>

            <p className="mt-4 text-[13px] text-[#999]" data-testid="text-trust-line">No credit card required</p>

            <div className="mt-14 relative mx-auto max-w-3xl">
              <div className="rounded-[20px] overflow-hidden shadow-2xl shadow-black/10 border border-black/[0.04]">
                <img
                  src={heroImage}
                  alt={heroImageAlt}
                  className="w-full"
                  decoding="async"
                  data-testid="img-hero"
                />
              </div>
            </div>
          </div>
        </section>

        {painPoints && painPoints.items.length > 0 && (
          <section className="py-24 lg:py-32 px-4" data-testid="section-pain-points">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
                  {painPoints.heading}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {painPoints.items.map((point, i) => (
                  <div
                    key={i}
                    className="bg-[#FAFAFA] border border-black/[0.04] rounded-[16px] p-8"
                    data-testid={`card-pain-${i}`}
                  >
                    <div className="text-[32px] mb-4">{point.emoji}</div>
                    <p className="text-[11px] font-bold text-[#999] uppercase tracking-[0.12em] mb-3">
                      {point.label}
                    </p>
                    <h3 className="text-[20px] md:text-[22px] font-bold text-black tracking-[-0.4px] leading-[1.2] mb-3">
                      {point.title}
                    </h3>
                    <p className="text-[15px] text-[#666] leading-[1.5]">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {benefits && benefits.items.length > 0 && (
          <section className="py-24 lg:py-32 px-4" data-testid="section-benefits">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
                  {benefits.heading}
                </h2>
              </div>

              <div className="space-y-24 lg:space-y-32">
                {benefits.items.map((benefit, i) => {
                  const isReversed = i % 2 === 1
                  return (
                    <div
                      key={i}
                      className={`flex flex-col gap-10 lg:gap-16 items-center ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
                      data-testid={`card-benefit-${i}`}
                    >
                      <div className="w-full lg:w-[55%] flex-shrink-0">
                        <div className="rounded-[20px] overflow-hidden bg-[#F8F8FA] border border-black/[0.04] aspect-[4/3]">
                          <img
                            src={benefit.image}
                            alt={benefit.title}
                            className="w-full h-full object-cover"
                            decoding="async"
                            data-testid={`img-benefit-${i}`}
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-[45%]">
                        <h3 className="text-[28px] lg:text-[36px] font-bold text-black tracking-[-0.8px] lg:tracking-[-1.2px] leading-[1.15] mb-5">
                          {benefit.title}
                        </h3>
                        <p className="text-[16px] lg:text-[17px] text-[#555] leading-[1.6]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {steps.length > 0 && (
          <section
            className="py-24 lg:py-32 px-4 relative"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 20% 40%, rgba(220,210,255,0.12) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 80% 60%, rgba(180,230,200,0.08) 0%, transparent 55%)",
            }}
            data-testid="section-how-it-works"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-[12px] font-bold text-[#6366F1] uppercase tracking-[0.12em] mb-4">
                  How It Works
                </p>
                <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-black tracking-[-1.2px] leading-[1.1]">
                  Minutes, not weeks
                </h2>
              </div>

              <div className="space-y-12">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-6 items-start"
                    data-testid={`card-step-${i + 1}`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[14px] font-bold">
                      {i + 1}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-[20px] md:text-[24px] font-bold text-black tracking-[-0.4px] leading-[1.2] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-[15px] md:text-[16px] text-[#666] leading-[1.5]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pb-28 pt-4 px-4" data-testid="section-final-cta">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#0A0A0A] rounded-[24px] p-12 md:p-20 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, #6366F1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #818CF8 0%, transparent 50%)`,
                }}
              />
              <div className="relative z-10">
                <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-bold text-white tracking-[-1px] leading-[1.1] mb-4">
                  {ctaBanner.title}
                </h2>
                <p className="text-[16px] text-[#888] mb-10 max-w-lg mx-auto leading-[1.5]">
                  {ctaBanner.subtitle}
                </p>
                <Link
                  href={ctaHref}
                  data-testid="button-bottom-cta"
                  className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-100 text-black font-bold px-8 py-4 rounded-[10px] text-[15px] uppercase tracking-[0.04em] transition-colors"
                >
                  {ctaBanner.buttonText}
                  <ArrowRight className="size-4" />
                </Link>
                <p className="mt-4 text-[13px] text-[#666]">No credit card required</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
