import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import {
  Check, Crown, GraduationCap, Building2, Sparkles, ArrowRight, PhoneCall, ShieldCheck, Star,
} from "lucide-react"

/* GTM — Program offer page. Presents the 2-step + Elite offer; primary CTA is
   "Book a demo" (₹1L+ closes on a call). Demo request -> /api/demo-request ->
   sales/POC closes and sends a Razorpay payment link. */

const PLANS = [
  {
    key: "Mentorship", name: "Suprans Mentorship", price: "₹39,000", period: "3-month guided program",
    icon: GraduationCap, highlight: false, tagline: "Start here",
    features: [
      "Full guided curriculum, unlocked on schedule",
      "Winning-product curation & research",
      "AI Studio — banners, brand kit, ad creatives",
      "Shopify integration (skip the learning curve)",
      "Cheatsheets, templates & tools",
      "A dedicated success POC",
    ],
  },
  {
    key: "Elite", name: "Elite — Launch Done-For-You", price: "₹1,49,000", period: "everything, done with you",
    icon: Crown, highlight: true, tagline: "Most popular",
    features: [
      "Everything in Suprans Mentorship",
      "Dropshipper LLC included (US company)",
      "Done-for-you Shopify store, built by our team",
      "Priority design & development",
      "China-warehouse fulfillment set up for you",
      "Priority POC & support",
    ],
  },
  {
    key: "Dropshipper LLC", name: "Dropshipper LLC", price: "₹70,000", period: "+ GST · add-on",
    icon: Building2, highlight: false, tagline: "Unlock US payments",
    features: [
      "US LLC formation + EIN",
      "BOI / FinCEN compliance filing",
      "US business bank account",
      "Stripe & PayPal ready",
      "Registered agent (1 year)",
      "Powered by LegalNations",
    ],
  },
]

function DemoDialog({ open, onClose, plan }: { open: boolean; onClose: () => void; plan: string }) {
  const { showSuccess, showError } = useToast()
  const [phone, setPhone] = useState("")
  const [when, setWhen] = useState("Anytime")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      const res = await apiFetch("/api/demo-request", {
        method: "POST",
        body: JSON.stringify({ plan_interest: plan, preferred_time: when, phone: phone.trim(), note: note.trim() }),
      })
      if (!res.ok) throw new Error("failed")
      setDone(true)
      showSuccess("Request received — our team will call you shortly.")
      setTimeout(() => { onClose(); setDone(false); setPhone(""); setNote("") }, 1600)
    } catch {
      showError("Couldn't submit — please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><PhoneCall className="h-5 w-5 text-blue-600" /> Book your free demo</DialogTitle>
          <DialogDescription>See exactly how USDrop builds your US business — then we'll tailor a plan for you.</DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="py-8 text-center text-emerald-600 font-semibold">✓ Thanks! Our team will reach out shortly.</div>
        ) : (
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="dm-phone">WhatsApp / phone</Label>
              <Input id="dm-phone" placeholder="+91 …" value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="demo-phone" />
            </div>
            <div className="space-y-1.5">
              <Label>Best time to call</Label>
              <Select value={when} onValueChange={setWhen}>
                <SelectTrigger data-testid="demo-time"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Anytime", "Morning (9–12)", "Afternoon (12–5)", "Evening (5–9)"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dm-note">Anything we should know? (optional)</Label>
              <Textarea id="dm-note" rows={2} placeholder="Your budget, goals, questions…" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
        )}
        {!done && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
            <Button onClick={submit} disabled={busy || !phone.trim()} data-testid="demo-submit">{busy ? "Sending…" : "Book my demo"}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function ProgramPage() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(" ")[0] || "there"
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoPlan, setDemoPlan] = useState("Program")

  function bookDemo(plan: string) { setDemoPlan(plan); setDemoOpen(true) }

  return (
    <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-3">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1f3d 40%, #132a4a 70%, #1d4ed8 100%)" }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(circle,#3b82f6 0%,transparent 70%)" }} />
        <div className="relative px-6 py-8 md:px-10 md:py-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-white mb-4"><Star className="h-3.5 w-3.5" /> The USDrop Program</div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-[1.1]">Turn what you're learning into a real US business, {firstName}.</h1>
          <p className="text-white/65 text-sm md:text-base mt-3">
            Done-with-you US dropshipping: our team + AI handle your store, US LLC, payments and China-warehouse fulfillment — guided by Mr. Suprans. You focus on selling.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90" onClick={() => bookDemo("Program")} data-testid="hero-book-demo">
              <PhoneCall className="h-4 w-4 mr-2 text-blue-600" /> Book a free demo <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <span className="text-white/50 text-sm">No pressure — see the plan, then decide.</span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {PLANS.map((p) => (
          <div key={p.key} className={cn("relative rounded-2xl border bg-white p-6 flex flex-col", p.highlight ? "border-blue-500 ring-2 ring-blue-100 shadow-lg" : "border-slate-200")}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-semibold">{p.tagline}</span>}
            <div className="flex items-center gap-2.5 mb-3">
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl", p.highlight ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600")}><p.icon className="h-5 w-5" /></div>
              <div>
                <div className="text-[15px] font-semibold text-slate-900">{p.name}</div>
                {!p.highlight && <div className="text-[11px] text-slate-400">{p.tagline}</div>}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-[28px] font-bold text-slate-900">{p.price}</span>
              <span className="text-[12.5px] text-slate-400 ml-1.5">{p.period}</span>
            </div>
            <ul className="space-y-2 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-700">
                  <span className="mt-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 shrink-0"><Check className="h-2.5 w-2.5 text-emerald-600" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Button className="mt-5 w-full" variant={p.highlight ? "default" : "outline"} onClick={() => bookDemo(p.key)} data-testid={`plan-cta-${p.key.toLowerCase().replace(/\s+/g, "-")}`}>
              Book a demo
            </Button>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 bg-white shrink-0">
            <img src="/images/mentor-suprans.png" alt="Mr. Suprans" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Guided by</span></div>
            <div className="text-[15px] font-semibold text-slate-900">Mr. Suprans — USA Dropshipping Expert</div>
            <div className="text-[12.5px] text-slate-500">100+ students mentored · proven framework · done-with-you support</div>
          </div>
        </div>
        <Button variant="outline" onClick={() => bookDemo("Program")} className="shrink-0"><PhoneCall className="h-4 w-4 mr-2" /> Talk to our team</Button>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
        <h2 className="text-[15px] font-semibold text-slate-900 mb-4">Common questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {[
            ["Do I need experience?", "No. The program is built for beginners — the free lessons and your POC guide you step by step."],
            ["Do you guarantee sales?", "No one honestly can. We do everything in our control — store, LLC, fulfillment, tools and guidance — you run the ads and sell."],
            ["What about the product & shipping?", "Our China-warehouse team can source, pack and ship your orders — a done-for-you value-add, not something you manage."],
            ["Is the LLC included?", "It's included in Elite. On Mentorship it's an add-on (₹70,000 + GST) that unlocks US payments, banking and marketplaces."],
          ].map(([q, a]) => (
            <div key={q}>
              <div className="text-[13.5px] font-semibold text-slate-900">{q}</div>
              <div className="text-[12.5px] text-slate-500 mt-0.5 leading-relaxed">{a}</div>
            </div>
          ))}
        </div>
      </div>

      <DemoDialog open={demoOpen} onClose={() => setDemoOpen(false)} plan={demoPlan} />
    </div>
  )
}
