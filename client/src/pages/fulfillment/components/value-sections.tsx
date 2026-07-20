import { Store, PackageCheck, Truck, BadgeCheck, Boxes, RotateCcw, MapPin, Check, Minus } from "lucide-react"
import { WAREHOUSE } from "../lib"

/* Honest value sections for the Fulfillment Overview. Positioning: USDrop
   fulfills from its own China warehouse on a branded fast line — real QC,
   branded packaging, real tracking, easy returns. No fabricated metrics.
   Layout references: Hims / HODINKEE "How it works", Hers comparison table. */

const STEPS = [
  { icon: Store, title: "Connect your store", body: "Link your Shopify store once. Your orders sync into USDrop automatically." },
  { icon: PackageCheck, title: "An order comes in", body: "Send it to us in one click. No inventory to buy upfront, no minimum quantity." },
  { icon: Boxes, title: "Our China team fulfills", body: "We source, quality-check and pack it — branded — at our own warehouse." },
  { icon: Truck, title: "Fast, tracked shipping", body: "It ships on our express line with real tracking your customer can follow." },
]

const COMPARE: { feature: string; diy: string; usdrop: string }[] = [
  { feature: "Sourcing & quality", diy: "Whatever the listing ships", usdrop: "Inspected before it ships" },
  { feature: "Packaging", diy: "Generic poly bag", usdrop: "Clean, brandable packaging" },
  { feature: "Tracking", diy: "Slow / unreliable updates", usdrop: "Real tracking, end to end" },
  { feature: "Order handling", diy: "You place every order by hand", usdrop: "Our team handles it for you" },
  { feature: "Returns & issues", diy: "Hard to resolve", usdrop: "Handled with you" },
]

export function FulfillmentValueSections() {
  return (
    <div className="space-y-10">
      {/* How it works */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">How USDrop fulfillment works</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            You focus on marketing. Our China-warehouse team handles sourcing, packing and shipping.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-5"
                data-testid={`fulfillment-step-${i + 1}`}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 mb-1">
                  Step {i + 1}
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">{step.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Warehouse identity */}
      <section
        className="rounded-2xl border border-slate-200 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
        data-testid="fulfillment-warehouse-card"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 px-6 py-6 md:px-8">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Boxes className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-white/90 mb-2">
              <BadgeCheck className="h-3.5 w-3.5" /> Fulfilled by USDrop
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">{WAREHOUSE.name}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[13px] text-white/70">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {WAREHOUSE.location}</span>
              <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> {WAREHOUSE.line}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Honest comparison */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Doing it yourself vs. USDrop fulfillment</h2>
          <p className="text-sm text-slate-500 mt-0.5">The same China supply chain — done for you, the right way.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-slate-50 border-b border-slate-200 px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
            <div>What matters</div>
            <div className="text-center">Doing it yourself</div>
            <div className="text-center text-blue-700">With USDrop</div>
          </div>
          <div className="divide-y divide-slate-100">
            {COMPARE.map((row) => (
              <div key={row.feature} className="grid grid-cols-[1.2fr_1fr_1fr] items-center px-5 py-3.5">
                <div className="text-[13px] font-medium text-slate-700">{row.feature}</div>
                <div className="flex items-center justify-center gap-2 text-center">
                  <Minus className="h-4 w-4 text-slate-300 shrink-0" />
                  <span className="text-[12.5px] text-slate-400">{row.diy}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-center">
                  <span className="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </span>
                  <span className="text-[12.5px] font-medium text-slate-700">{row.usdrop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="flex items-center gap-1.5 mt-3 text-[12px] text-slate-400">
          <RotateCcw className="h-3.5 w-3.5" />
          Ships from our China warehouse — honest origin, handled end to end by our team.
        </p>
      </section>
    </div>
  )
}
