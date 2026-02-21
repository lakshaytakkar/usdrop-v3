import { Link } from "wouter"
import { Header } from "@/pages/(marketing)/components/Header"
import { ArrowRight, Zap } from "lucide-react"

function ShopifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 292" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/>
      <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357" fill="#5E8E3E"/>
      <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/>
    </svg>
  )
}

const steps = [
  {
    number: "01",
    title: "One-Click Connect",
    description: "Authorize your Shopify store and you're in.",
    image: "/images/shopify/step-connect.png",
  },
  {
    number: "02",
    title: "Product Sync",
    description: "Products, images, and prices auto-import.",
    image: "/images/shopify/step-sync.png",
  },
  {
    number: "03",
    title: "Auto Fulfillment",
    description: "Orders ship and tracking updates automatically.",
    image: "/images/shopify/step-fulfill.png",
  },
  {
    number: "04",
    title: "Sales Dashboard",
    description: "Track revenue and margins in one place.",
    image: "/images/shopify/step-track.png",
  },
]

export default function ShopifyPage() {
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

      <section className="pt-[140px] pb-16 px-4 relative" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(195,170,255,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(180,215,255,0.18) 0%, transparent 55%)"
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 mb-8 shadow-sm">
            <ShopifyIcon className="w-5 h-5 text-[#96BF48]" />
            <span className="text-sm font-semibold text-[#323140]">Official Shopify Integration</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.1] tracking-tight mb-6">
            Connect USDrop to Your{" "}
            <span className="text-[#96BF48]">Shopify Store</span>{" "}
            in Minutes
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Seamlessly sync products, inventory, and orders. Let USDrop handle the backend while you focus on growing your store.
          </p>

          <Link href="/signup">
            <button
              data-testid="button-connect-store-hero"
              className="inline-flex items-center gap-2 bg-[#96BF48] hover:bg-[#85ab3f] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-[#96BF48]/20"
            >
              Connect Store Now
              <ArrowRight className="size-5" />
            </button>
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
                    app.usdrop.com/connect-store
                  </div>
                </div>
              </div>
              <img
                src="/images/shopify/browser-mockup.png"
                alt="USDrop Shopify connection interface"
                className="w-full"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative" style={{
        background: "radial-gradient(ellipse 70% 50% at 20% 40%, rgba(220,210,255,0.2) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 80% 60%, rgba(180,230,200,0.15) 0%, transparent 55%)"
      }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#323140] text-white rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-5">
              <Zap className="size-3.5" />
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              From Zero to Selling in 4 Steps
            </h2>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className="flex gap-5 overflow-x-auto pb-4 px-4 snap-x snap-mandatory max-w-fit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex-shrink-0 w-[260px] md:w-[290px] snap-center text-center"
                data-testid={`card-step-${step.number}`}
              >
                <div className="rounded-[20px] overflow-hidden border-2 border-white/80 shadow-sm hover-elevate transition-all duration-200 aspect-[3/4]">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    decoding="async"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-black mt-5">{step.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#323140] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, #96BF48 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E8E0FF 0%, transparent 50%)"
            }} />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShopifyIcon className="w-8 h-8 text-[#96BF48]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to automate your Shopify store?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Join thousands of merchants using USDrop to run their dropshipping business on autopilot.
              </p>
              <Link href="/signup">
                <button
                  data-testid="button-install-app-cta"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#323140] font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
                >
                  Install App for Free
                  <ArrowRight className="size-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
