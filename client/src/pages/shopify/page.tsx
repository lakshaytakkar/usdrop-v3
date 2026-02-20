import { Link } from "wouter"
import { Header } from "@/pages/(marketing)/components/Header"
import { ArrowRight, Zap } from "lucide-react"

function ShopifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.337 3.415c-.048-.16-.192-.247-.32-.263s-.256 0-.256 0-.544-.048-1.089-.096c-.544-.048-.768-.544-.768-.544s-.032-.064-.096-.16c-.192-.32-.48-.48-.816-.48h-.032c-.064-.064-.128-.128-.192-.16-.416-.352-.928-.32-1.344.128-.128.128-.256.32-.352.512-.24.48-.448 1.088-.544 1.568-.384.112-.656.192-.672.192-.208.064-.224.08-.24.272-.016.144-.544 4.193-.544 4.193l4.081.768.016-5.93zM12.658 3.91c0-.016 0-.048.016-.064.128-.416.352-.768.592-.992-.24.48-.4 1.12-.464 1.792.272-.08.56-.176.832-.256-.064-.192-.16-.336-.272-.48h.016c-.208-.016-.464.016-.72 0zM13.33 2.71c.192.192.32.48.384.832-.336.096-.704.208-1.056.32.192-.736.544-1.12.672-1.152zM12.53 2.455s-.064.032-.128.08c-.016 0-.032.016-.048.032-.016.016-.048.048-.08.08-.32.32-.56.816-.72 1.408-.24.08-.48.144-.72.224.208-.816.64-1.504 1.216-1.808.16-.08.32-.08.48-.016z"/>
      <path d="M14.977 3.199s-.128-.016-.256 0c-.128.016-.272.096-.32.256-.016.064-.016.128-.032.208l-.016 5.929 2.993.56s-.128-.96-.256-1.84c-.128-.88-.32-1.792-.32-1.792s.176.048.4.128c.224.08.512.208.512.208s-.064-.656-.24-1.296c-.176-.64-.432-1.232-.432-1.232s.16.032.352.112c.192.08.416.208.416.208s-.176-.72-.528-1.216c-.352-.496-.832-.8-.832-.8s.096 0 .256.032c.16.032.384.112.384.112s-.288-.464-.768-.736c-.256-.128-.288-.224-.288-.224l-.016-.016s-.016-.368-.016-.576l.016.016-.032-.016s.064-.032.064-.048z"/>
      <path d="M10.722 9.502l-.48 1.792s-.432-.208-1.008-.208c-1.568 0-1.648 1.008-1.648 1.248 0 1.376 3.537 1.904 3.537 5.137 0 2.545-1.601 4.177-3.761 4.177-2.593 0-3.921-1.632-3.921-1.632l.688-2.32s1.376 1.2 2.529 1.2c.752 0 1.072-.608 1.072-1.04 0-1.808-2.897-1.888-2.897-4.833 0-2.481 1.76-4.897 5.329-4.897.688 0 .56.376.56.376z"/>
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
    <div className="relative min-h-screen bg-[#F4F2F1]">
      <div className="absolute top-[32px] left-0 right-0 z-50">
        <Header />
      </div>

      <section className="pt-[140px] pb-16 px-4">
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
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
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
                    loading="lazy"
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
