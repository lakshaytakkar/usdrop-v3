import { useState, useEffect, useCallback, Suspense } from "react"
import { apiFetch } from "@/lib/supabase"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import { useToast } from "@/hooks/use-toast"
import { useUserPlan } from "@/hooks/use-user-plan"
import { cn } from "@/lib/utils"
import {
  Sparkles, Check, ArrowRight, ArrowLeft, Store, Wand2, Rocket, Crown,
  Building2, Truck, ExternalLink, Loader2, PartyPopper,
} from "lucide-react"
import {
  NICHES, BRAND_COLORS, BUILD_INCLUDES, nicheLabel,
  StoreBuildRequest, BuildStatus, BUILD_PIPELINE, BUILD_STATUS_META, buildStatusIndex,
} from "./lib"

type Step = "intro" | "niche" | "brand" | "review"

/* ----------------------------------------------------------------- status */

function StatusView({ request, onAnother }: { request: StoreBuildRequest; onAnother: () => void }) {
  const cancelled = request.status === "cancelled"
  const currentIdx = buildStatusIndex(request.status)
  const ready = request.status === "ready" || request.status === "delivered"

  return (
    <div className="max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="relative overflow-hidden px-6 py-6 md:px-8" style={{ background: "linear-gradient(135deg, #0a1628 0%, #132a4a 60%, #1d4ed8 100%)" }}>
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle,#3b82f6 0%,transparent 70%)" }} />
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10">
              {ready ? <PartyPopper className="h-6 w-6 text-white" /> : <Loader2 className="h-6 w-6 text-white animate-spin" />}
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-blue-300">{nicheLabel(request.niche)} store</div>
              <h2 className="text-lg md:text-xl font-bold text-white">{request.store_name || "Your USDrop store"}</h2>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8">
          {cancelled ? (
            <p className="text-sm text-rose-600 font-medium">This build was cancelled.</p>
          ) : (
            <ol className="relative">
              {BUILD_PIPELINE.map((step, i) => {
                const done = i < currentIdx
                const active = i === currentIdx
                const isLast = i === BUILD_PIPELINE.length - 1
                return (
                  <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
                    {!isLast && <span className={cn("absolute left-[13px] top-7 bottom-0 w-px", done ? "bg-emerald-300" : "bg-slate-200")} />}
                    <span className={cn("relative z-[1] shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2",
                      done && "bg-emerald-500 border-emerald-500 text-white",
                      active && "bg-blue-600 border-blue-600 text-white",
                      !done && !active && "bg-white border-slate-300 text-transparent")}>
                      {done ? <Check className="h-4 w-4" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    </span>
                    <div className="-mt-0.5">
                      <div className={cn("text-[14px] font-semibold", active ? "text-blue-700" : done ? "text-slate-900" : "text-slate-400")}>{BUILD_STATUS_META[step].label}</div>
                      <div className="text-[12.5px] text-slate-500">{BUILD_STATUS_META[step].blurb}</div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          {ready && request.store_url && (
            <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 mb-1">Your store is live</div>
              <a href={request.store_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-800 hover:underline">
                {request.store_url} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {request.store_login && <p className="text-[12.5px] text-emerald-700/80 mt-1">Login: {request.store_login}</p>}
            </div>
          )}

          {!ready && !cancelled && (
            <p className="text-[12.5px] text-slate-400 mt-1">Our team is building your store. You'll be notified the moment it's ready — typically within 1–2 business days.</p>
          )}

          <div className="mt-5 flex items-center gap-2">
            <Link href="/fulfillment"><Button variant="outline" size="sm"><Truck className="h-4 w-4 mr-1.5" /> Set up fulfillment</Button></Link>
            <Link href="/llc"><Button variant="outline" size="sm"><Building2 className="h-4 w-4 mr-1.5" /> Your LLC</Button></Link>
            <button onClick={onAnother} className="ml-auto text-[13px] font-medium text-blue-600 hover:text-blue-700">Start another build</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- wizard */

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "niche", label: "Niche" },
    { key: "brand", label: "Brand" },
    { key: "review", label: "Review" },
  ]
  const idx = steps.findIndex((s) => s.key === step)
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-[12.5px] font-semibold",
            i === idx ? "bg-blue-600 text-white" : i < idx ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-400")}>
            <span className={cn("flex items-center justify-center w-5 h-5 rounded-full text-[11px]", i === idx ? "bg-white/20" : i < idx ? "bg-blue-200" : "bg-slate-200")}>
              {i < idx ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {s.label}
          </div>
          {i < steps.length - 1 && <span className={cn("w-6 h-px", i < idx ? "bg-blue-300" : "bg-slate-200")} />}
        </div>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------- main */

function BuildStoreContent() {
  const { isPro, isFree, isLoading: planLoading } = useUserPlan()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<StoreBuildRequest | null>(null)
  const [step, setStep] = useState<Step>("intro")
  const [busy, setBusy] = useState(false)

  // wizard fields
  const [niche, setNiche] = useState<string>("")
  const [storeName, setStoreName] = useState("")
  const [tagline, setTagline] = useState("")
  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/store-builder/requests")
      const list: StoreBuildRequest[] = res.ok ? ((await res.json()).requests || []) : []
      const live = list.find((r) => r.status !== "cancelled")
      setActive(live || null)
    } catch {
      setActive(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (!planLoading) load() }, [planLoading, load])

  async function submit() {
    setBusy(true)
    try {
      const res = await apiFetch("/api/store-builder/requests", {
        method: "POST",
        body: JSON.stringify({ niche, store_name: storeName.trim() || null, tagline: tagline.trim() || null, brand_color: brandColor }),
      })
      if (res.status === 403) { showError("Build Your Store is an Elite feature. Upgrade to start your build."); return }
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setActive(data.request)
      setStep("intro")
      showSuccess("Your store build has started! Our team is on it.")
    } catch {
      showError("Couldn't start your build. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  if (planLoading || loading) {
    return <div className="flex justify-center py-20"><BlueSpinner size="lg" label="Loading…" /></div>
  }

  // Existing active build → status view
  if (active) {
    return <StatusView request={active} onAnother={() => { setActive(null); setStep("niche"); setNiche(""); setStoreName(""); setTagline("") }} />
  }

  // INTRO
  if (step === "intro") {
    return (
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1f3d 40%, #132a4a 70%, #1d4ed8 100%)" }} data-testid="build-store-hero">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(circle,#3b82f6 0%,transparent 70%)" }} />
          <div className="relative px-6 py-8 md:px-10 md:py-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/90 text-[11px] font-bold text-black uppercase tracking-wide mb-4">
              <Crown className="h-3.5 w-3.5" /> Elite inclusion
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-[1.1]">
              Your Shopify store,<br />built for you.
            </h1>
            <p className="text-white/60 text-sm md:text-base mt-3">
              Pick a niche and our team builds you a complete, conversion-ready Shopify store — theme, winning products and pages — bundled with your Dropshipper LLC and China-warehouse fulfillment.
            </p>
            {isFree ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/llc">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90"><Crown className="h-4 w-4 mr-2 text-amber-500" /> Unlock with Elite</Button>
                </Link>
                <span className="text-white/50 text-sm">Includes LLC + fulfillment</span>
              </div>
            ) : (
              <Button size="lg" className="mt-6 bg-white text-slate-900 hover:bg-white/90" onClick={() => setStep("niche")} data-testid="button-start-build">
                <Wand2 className="h-4 w-4 mr-2 text-blue-600" /> Build my store <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 rounded-2xl border border-slate-200 bg-white px-6 py-6">
          <h2 className="md:col-span-2 text-[15px] font-semibold text-slate-900 mb-1">What's included</h2>
          {BUILD_INCLUDES.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 shrink-0"><Check className="h-3 w-3 text-emerald-600" /></span>
              <span className="text-[13.5px] text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // WIZARD
  return (
    <div className="max-w-5xl">
      <Stepper step={step} />

      {step === "niche" && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Choose your niche</h2>
          <p className="text-sm text-slate-500 mt-0.5 mb-5">We'll stock your store with proven winning products for this niche.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {NICHES.map((n) => {
              const Icon = n.icon
              const selected = niche === n.key
              return (
                <button
                  key={n.key}
                  onClick={() => setNiche(n.key)}
                  className={cn("text-left rounded-2xl border p-4 transition-all", selected ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/40" : "border-slate-200 bg-white hover:border-slate-300")}
                  data-testid={`niche-${n.key}`}
                >
                  <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br text-white mb-3", n.gradient)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14.5px] font-semibold text-slate-900">{n.label}</h3>
                    {selected && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                  <p className="text-[12.5px] text-slate-500 mt-0.5">{n.blurb}</p>
                  <div className="text-[11px] text-emerald-600 font-medium mt-2">{n.popularity}% success rate</div>
                </button>
              )
            })}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep("intro")}><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Button>
            <Button onClick={() => setStep("brand")} disabled={!niche} data-testid="button-niche-next">Continue <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
          </div>
        </div>
      )}

      {step === "brand" && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Brand basics</h2>
          <p className="text-sm text-slate-500 mt-0.5 mb-5">A few details so your store feels like yours. You can change these later.</p>
          <div className="space-y-5 max-w-lg">
            <div className="space-y-1.5">
              <Label htmlFor="bs-name">Store name</Label>
              <Input id="bs-name" placeholder="e.g. Pawfect Finds" value={storeName} onChange={(e) => setStoreName(e.target.value)} data-testid="input-store-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bs-tag">Tagline (optional)</Label>
              <Input id="bs-tag" placeholder="e.g. Everything your pet loves" value={tagline} onChange={(e) => setTagline(e.target.value)} data-testid="input-store-tagline" />
            </div>
            <div className="space-y-2">
              <Label>Brand color</Label>
              <div className="flex items-center gap-2.5">
                {BRAND_COLORS.map((c) => (
                  <button key={c} onClick={() => setBrandColor(c)} className={cn("w-8 h-8 rounded-full border-2 transition-all", brandColor === c ? "border-slate-900 scale-110" : "border-white shadow-sm")} style={{ background: c }} data-testid={`color-${c}`} aria-label={c} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep("niche")}><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Button>
            <Button onClick={() => setStep("review")} data-testid="button-brand-next">Review <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Review &amp; build</h2>
          <p className="text-sm text-slate-500 mt-0.5 mb-5">Confirm your brief — our team starts building right away.</p>
          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
            {[
              { label: "Niche", value: nicheLabel(niche) },
              { label: "Store name", value: storeName || "USDrop store (we'll suggest one)" },
              { label: "Tagline", value: tagline || "—" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[12.5px] text-slate-500">{r.label}</span>
                <span className="text-[13.5px] font-medium text-slate-900 flex items-center gap-2">
                  {r.label === "Niche" && <span className="w-3 h-3 rounded-full" style={{ background: brandColor }} />}
                  {r.value}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-4 mt-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-2"><Rocket className="h-4 w-4 text-blue-600" /> What happens next</div>
            <ul className="space-y-1.5">
              {["We build your themed store + load 10 winning products", "We set up your ready-to-sell pages", "You get the live store + login to start selling"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep("brand")} disabled={busy}><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Button>
            <Button onClick={submit} disabled={busy} data-testid="button-submit-build">
              {busy ? "Starting…" : <><Wand2 className="h-4 w-4 mr-1.5" /> Build my store</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner title="Build Your Store" description="A done-for-you Shopify store, built by USDrop" iconSrc="/3d-ecom-icons-blue/Category_Grid.png" tutorialVideoUrl="" />
      {children}
    </div>
  )
}

export default function BuildStorePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-8">
        <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 300px)" }}><BlueSpinner size="lg" label="Loading…" /></div>
      </div>
    }>
      <Shell><BuildStoreContent /></Shell>
    </Suspense>
  )
}
