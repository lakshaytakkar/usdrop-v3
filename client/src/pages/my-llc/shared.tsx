import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/supabase"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Building2, Check, ShieldCheck, BadgeCheck, ArrowRight, Landmark, CreditCard,
  FileText, MapPin, Clock, Lock, Download, Globe, Scale, TrendingUp, Star,
} from "lucide-react"
import {
  LLCApplication, LLC_PIPELINE, LLC_STAGE_META, llcStatusIndex, LLC_INCLUDES,
  FORMATION_STATES, fmtDate,
} from "./lib"

/* Phase A — guided in-portal LLC. Real routed subpages (green-themed sub-nav). */

export type LLCTab = "overview" | "documents" | "banking" | "payments" | "benefits"

export function useLLC() {
  const { data, isLoading } = useQuery<{ application: LLCApplication | null }>({
    queryKey: ["llc-me"],
    queryFn: () => apiFetch("/api/llc/me").then((r) => (r.ok ? r.json() : { application: null })),
  })
  return { app: data?.application ?? null, isLoading }
}

function stageReached(app: LLCApplication | null, stage: string): boolean {
  if (!app) return false
  if (app.status === "complete") return true
  return llcStatusIndex(app.status) >= LLC_PIPELINE.indexOf(stage as any)
}

const DOCUMENTS = [
  { name: "Articles of Organization", desc: "Your state-filed LLC charter", stage: "filed" },
  { name: "Operating Agreement", desc: "Ownership & operating rules", stage: "filed" },
  { name: "Registered Agent Letter", desc: "Your appointed US agent", stage: "filed" },
  { name: "EIN Confirmation (CP-575)", desc: "Federal tax ID from the IRS", stage: "ein_received" },
  { name: "BOI / FinCEN Confirmation", desc: "Beneficial-ownership filing", stage: "boi_filed" },
  { name: "Bank Welcome Kit", desc: "Your US business account details", stage: "bank_opened" },
]

const BENEFITS = [
  { icon: Globe, title: "Sell on US marketplaces", desc: "Unlock Amazon, Walmart, TikTok Shop & more that require a US entity." },
  { icon: CreditCard, title: "Accept Stripe & PayPal", desc: "Get paid in USD from customers worldwide, no restrictions." },
  { icon: Landmark, title: "US business bank account", desc: "A real US account for your store's revenue and expenses." },
  { icon: Scale, title: "Limited liability", desc: "Separate your personal assets from your business." },
  { icon: TrendingUp, title: "Build US business credit", desc: "Establish credit to scale faster with suppliers and lenders." },
  { icon: Star, title: "Brand credibility", desc: "A registered US company builds instant customer trust." },
]

export function PoweredByLegalNations() {
  return (
    <div className="flex items-center justify-center gap-2 text-[12px] text-slate-400 pt-2">
      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
      Filed by licensed US professionals · Powered by <span className="font-semibold text-slate-500">LegalNations</span>
    </div>
  )
}

function StartDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { showSuccess, showError } = useToast()
  const qc = useQueryClient()
  const [llcName, setLlcName] = useState("")
  const [state, setState] = useState(FORMATION_STATES[0])
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!llcName.trim()) return
    setBusy(true)
    try {
      const res = await apiFetch("/api/llc", { method: "POST", body: JSON.stringify({ llc_name: llcName.trim(), state }) })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      qc.setQueryData(["llc-me"], { application: data.application })
      showSuccess("Your LLC application has started! Our team is on it.")
      onClose()
    } catch {
      showError("Couldn't start your application. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-emerald-600" /> Start your Dropshipper LLC</DialogTitle>
          <DialogDescription>Tell us your preferred name and state — our team handles the rest.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="llc-name">Desired LLC name</Label>
            <Input id="llc-name" placeholder="e.g. Pawfect Finds LLC" value={llcName} onChange={(e) => setLlcName(e.target.value)} data-testid="input-llc-name" />
            <p className="text-[11.5px] text-slate-400">We'll check availability and suggest alternatives if needed.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Formation state</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger data-testid="select-llc-state"><SelectValue /></SelectTrigger>
              <SelectContent>{FORMATION_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={!llcName.trim() || busy} className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-submit-llc">
            {busy ? "Starting…" : "Start my LLC"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function KpiCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Building2 }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 shrink-0"><Icon className="h-5 w-5" /></div>
      <div className="min-w-0"><div className="text-[17px] font-bold text-slate-900 leading-none truncate">{value}</div><div className="text-[12px] text-slate-500 mt-1">{label}</div></div>
    </div>
  )
}

function PipelineTimeline({ app }: { app: LLCApplication }) {
  return (
    <ol className="relative">
      {LLC_PIPELINE.map((step, i) => {
        const done = i < llcStatusIndex(app.status) || app.status === "complete"
        const active = i === llcStatusIndex(app.status) && app.status !== "complete"
        const isLast = i === LLC_PIPELINE.length - 1
        const meta = LLC_STAGE_META[step]
        const date = meta.dateField ? (app[meta.dateField] as string | null) : app.created_at
        return (
          <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && <span className={cn("absolute left-[13px] top-7 bottom-0 w-px", done ? "bg-emerald-300" : "bg-slate-200")} />}
            <span className={cn("relative z-[1] shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2", done && "bg-emerald-500 border-emerald-500 text-white", active && "bg-emerald-600 border-emerald-600 text-white animate-pulse", !done && !active && "bg-white border-slate-300 text-transparent")}>
              {done ? <Check className="h-4 w-4" /> : null}
            </span>
            <div className="-mt-0.5 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className={cn("text-[14px] font-semibold", active ? "text-emerald-700" : done ? "text-slate-900" : "text-slate-400")}>{meta.label}</div>
                {(done || active) && date && <span className="text-[11.5px] text-slate-400">{fmtDate(date)}</span>}
              </div>
              <div className="text-[12.5px] text-slate-500">{meta.blurb}</div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function IncludesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
      <h2 className="text-[15px] font-semibold text-slate-900 mb-3">Everything included</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5">
        {LLC_INCLUDES.map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 shrink-0"><Check className="h-3 w-3 text-emerald-600" /></span>
            <span className="text-[13.5px] text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickLink({ href, icon: Icon, label, desc }: { href: string; icon: typeof Building2; label: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors group">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 shrink-0"><Icon className="h-4 w-4" /></div>
      <div className="min-w-0 flex-1"><div className="text-[13px] font-semibold text-slate-900">{label}</div><div className="text-[11.5px] text-slate-400">{desc}</div></div>
      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
    </Link>
  )
}

/* Realistic dashboard overview (no marketing hero). */
function OverviewDashboard({ app, onStart }: { app: LLCApplication | null; onStart: () => void }) {
  if (!app) {
    return (
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, #064e3b 0%, #047857 55%, #0d9e5f 100%)" }}>
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle,#34d399 0%,transparent 70%)" }} />
          <div className="relative flex flex-col md:flex-row md:items-center gap-4 px-6 py-5 md:px-8">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10.5px] font-semibold text-white mb-2"><BadgeCheck className="h-3 w-3" /> Dropshipper LLC</div>
              <h2 className="text-lg md:text-xl font-bold text-white">Form your US company — done for you</h2>
              <p className="text-white/70 text-[13px] mt-1">Sell on US marketplaces, accept Stripe &amp; PayPal, open a US bank. We handle filing, EIN, BOI &amp; banking.</p>
            </div>
            <Button className="bg-white text-emerald-700 hover:bg-white/90 shrink-0" onClick={onStart} data-testid="button-start-llc"><Building2 className="h-4 w-4 mr-2" /> Start my LLC <ArrowRight className="h-4 w-4 ml-2" /></Button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Steps handled for you" value="7" icon={TrendingUp} />
          <KpiCard label="Done for you" value="100%" icon={BadgeCheck} />
          <KpiCard label="Documents delivered" value="6" icon={FileText} />
          <KpiCard label="Payments" value="Stripe + PayPal" icon={CreditCard} />
        </div>
        <IncludesCard />
      </div>
    )
  }

  const idx = llcStatusIndex(app.status)
  const stageNo = Math.min(idx + 1, LLC_PIPELINE.length)
  const docsReady = DOCUMENTS.filter((d) => stageReached(app, d.stage)).length
  const nextStage = app.status !== "complete" ? LLC_PIPELINE[idx + 1] : null

  return (
    <div className="space-y-5">
      <StatusHeader app={app} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Progress" value={`Stage ${stageNo}/${LLC_PIPELINE.length}`} icon={TrendingUp} />
        <KpiCard label="Status" value={LLC_STAGE_META[app.status].label} icon={Building2} />
        <KpiCard label="Documents ready" value={`${docsReady}/${DOCUMENTS.length}`} icon={FileText} />
        <KpiCard label="Formation state" value={app.state || "—"} icon={MapPin} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white px-6 py-6">
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-slate-500 mb-4">Formation progress</h3>
          <PipelineTimeline app={app} />
        </div>
        <div className="space-y-3">
          {nextStage && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-5 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 mb-0.5">Up next</div>
              <div className="text-[14px] font-semibold text-slate-900">{LLC_STAGE_META[nextStage].label}</div>
              <div className="text-[12.5px] text-slate-500 mt-0.5">{LLC_STAGE_META[nextStage].blurb}</div>
            </div>
          )}
          <QuickLink href="/llc/documents" icon={FileText} label="Documents" desc={`${docsReady}/${DOCUMENTS.length} ready`} />
          <QuickLink href="/llc/banking" icon={Landmark} label="Banking" desc="US business account" />
          <QuickLink href="/llc/payments" icon={CreditCard} label="Payments" desc="Stripe & PayPal" />
        </div>
      </div>
    </div>
  )
}

function StatusHeader({ app }: { app: LLCApplication }) {
  const complete = app.status === "complete"
  return (
    <section className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, #052e1a 0%, #065f3b 55%, #0d9e5f 100%)" }}>
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle,#34d399 0%,transparent 70%)" }} />
      <div className="relative flex items-center gap-4 px-6 py-5 md:px-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10"><Building2 className="h-6 w-6 text-white" /></div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg md:text-xl font-bold text-white truncate">{app.llc_name || "Your LLC"}</h2>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize", complete ? "bg-emerald-400 text-emerald-950" : "bg-white/15 text-white")}>{LLC_STAGE_META[app.status]?.label || app.status}</span>
          </div>
          <div className="flex items-center gap-3 text-[12.5px] text-white/70 mt-1">
            {app.state && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {app.state}</span>}
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Started {fmtDate(app.created_at)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StartBanner({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <h3 className="text-[15px] font-semibold text-slate-900">Start your LLC to unlock this</h3>
        <p className="text-[12.5px] text-slate-500 mt-0.5">Form your US company in 60 seconds — we handle filing, EIN, BOI, banking and payments.</p>
      </div>
      <Button className="bg-emerald-600 hover:bg-emerald-700 shrink-0" onClick={onStart}><Building2 className="h-4 w-4 mr-2" /> Start my LLC</Button>
    </div>
  )
}

/* ---------------------------------------------------------------- panels */

function OverviewPanel({ app, onStart }: { app: LLCApplication | null; onStart: () => void }) {
  return (
    <div className="space-y-5">
      {app ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-slate-500 mb-4">Formation progress</h3>
          <ol className="relative">
            {LLC_PIPELINE.map((step, i) => {
              const done = i < llcStatusIndex(app.status) || app.status === "complete"
              const active = i === llcStatusIndex(app.status) && app.status !== "complete"
              const isLast = i === LLC_PIPELINE.length - 1
              const meta = LLC_STAGE_META[step]
              const date = meta.dateField ? (app[meta.dateField] as string | null) : app.created_at
              return (
                <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
                  {!isLast && <span className={cn("absolute left-[13px] top-7 bottom-0 w-px", done ? "bg-emerald-300" : "bg-slate-200")} />}
                  <span className={cn("relative z-[1] shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2", done && "bg-emerald-500 border-emerald-500 text-white", active && "bg-emerald-600 border-emerald-600 text-white animate-pulse", !done && !active && "bg-white border-slate-300 text-transparent")}>
                    {done ? <Check className="h-4 w-4" /> : null}
                  </span>
                  <div className="-mt-0.5 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className={cn("text-[14px] font-semibold", active ? "text-emerald-700" : done ? "text-slate-900" : "text-slate-400")}>{meta.label}</div>
                      {(done || active) && date && <span className="text-[11.5px] text-slate-400">{fmtDate(date)}</span>}
                    </div>
                    <div className="text-[12.5px] text-slate-500">{meta.blurb}</div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
        <h2 className="text-[15px] font-semibold text-slate-900 mb-3">Everything included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
          {LLC_INCLUDES.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 shrink-0"><Check className="h-3 w-3 text-emerald-600" /></span>
              <span className="text-[13.5px] text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DocumentsPanel({ app }: { app: LLCApplication | null }) {
  return (
    <div>
      <p className="text-[13px] text-slate-500 mb-4">Your company documents appear here as they're filed.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {DOCUMENTS.map((doc) => {
          const ready = stageReached(app, doc.stage)
          return (
            <div key={doc.name} className="rounded-xl border border-slate-200 bg-white overflow-hidden" data-testid={`llc-doc-${doc.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              <div className="relative h-28 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <FileText className={cn("h-10 w-10", ready ? "text-emerald-400" : "text-slate-300")} />
                <span className={cn("absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full", ready ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
                  {ready ? <><Check className="h-2.5 w-2.5" /> Ready</> : <><Lock className="h-2.5 w-2.5" /> Pending</>}
                </span>
              </div>
              <div className="p-3.5">
                <div className="text-[13px] font-semibold text-slate-900 leading-snug">{doc.name}</div>
                <div className="text-[11.5px] text-slate-400 mt-0.5">{doc.desc}</div>
                <button disabled={!ready} className={cn("mt-3 w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-semibold transition-colors", ready ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-50 text-slate-300 cursor-not-allowed")}>
                  <Download className="h-3.5 w-3.5" /> {ready ? "Download" : "Locked"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BankingPanel({ app }: { app: LLCApplication | null }) {
  const opened = stageReached(app, "bank_opened")
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      <div className="relative rounded-2xl p-6 text-white overflow-hidden aspect-[16/10] flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #0d9e5f 100%)" }}>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }} />
        <div className="relative flex items-center justify-between">
          <Landmark className="h-7 w-7" />
          <span className="text-[12px] font-semibold opacity-80">US Business</span>
        </div>
        <div className="relative">
          <div className="text-[15px] tracking-[0.2em] font-mono">•••• •••• •••• {opened ? "4921" : "••••"}</div>
          <div className="text-[12px] opacity-80 mt-2 truncate">{app?.llc_name || "Your LLC"}</div>
        </div>
      </div>
      <div>
        <h3 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">US business bank account {opened && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Open</span>}</h3>
        <p className="text-[13px] text-slate-500 mt-1 mb-4">A real US bank account in your company's name — for revenue, expenses and supplier payments.</p>
        <ul className="space-y-2">
          {["No US residency required", "USD account + routing number", "Virtual & physical debit cards", "Connects to Stripe & PayPal"].map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-[13.5px] text-slate-700"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 shrink-0"><Check className="h-3 w-3 text-emerald-600" /></span>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PaymentsPanel({ app }: { app: LLCApplication | null }) {
  const ready = stageReached(app, "stripe_connected")
  const providers = [
    { name: "Stripe", desc: "Accept cards globally in USD", color: "from-indigo-500 to-violet-600" },
    { name: "PayPal", desc: "Trusted checkout for US buyers", color: "from-sky-500 to-blue-600" },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {providers.map((p) => (
        <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-white mb-4", p.color)}><CreditCard className="h-6 w-6" /></div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-slate-900">{p.name}</h3>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", ready ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>{ready ? "Ready to connect" : "After formation"}</span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">{p.desc}</p>
        </div>
      ))}
      <div className="sm:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-5 py-4 text-[13px] text-slate-600">
        Once your LLC + EIN are ready, we help you connect Stripe and PayPal so you can accept payments worldwide.
      </div>
    </div>
  )
}

function BenefitsPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {BENEFITS.map((b) => (
        <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 mb-3"><b.icon className="h-5 w-5" /></div>
          <h3 className="text-[14.5px] font-semibold text-slate-900">{b.title}</h3>
          <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- page wrapper */

const TAB_DESC: Record<LLCTab, string> = {
  overview: "Form and manage your US company — done for you",
  documents: "Your company filings & legal documents",
  banking: "Your US business bank account",
  payments: "Accept Stripe & PayPal in USD",
  benefits: "What owning a US company unlocks",
}

export function LLCPage({ tab }: { tab: LLCTab }) {
  const { app, isLoading } = useLLC()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner title="Your LLC" description={TAB_DESC[tab]} iconSrc="/3d-ecom-icons-blue/Category_Grid.png" tutorialVideoUrl="" />

      {isLoading ? (
        <div className="flex justify-center py-20"><BlueSpinner size="lg" label="Loading…" /></div>
      ) : (
        <div className="space-y-5">
          {tab === "overview" ? (
            <OverviewDashboard app={app} onStart={() => setOpen(true)} />
          ) : (
            <>
              {app ? <StatusHeader app={app} /> : <StartBanner onStart={() => setOpen(true)} />}
              <div>
                {tab === "documents" && <DocumentsPanel app={app} />}
                {tab === "banking" && <BankingPanel app={app} />}
                {tab === "payments" && <PaymentsPanel app={app} />}
                {tab === "benefits" && <BenefitsPanel />}
              </div>
            </>
          )}
          <PoweredByLegalNations />
        </div>
      )}

      <StartDialog open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
