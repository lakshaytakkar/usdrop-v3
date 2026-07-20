import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { GraduationCap, Compass, TrendingUp, Building2, Truck, ArrowRight, Play, Check } from "lucide-react"

/* First-time welcome / self-onboarding guide. Shows once per user after a fresh
   signup lands on Free Learning — introduces the USDrop journey + a basic guide,
   then sends them into the first lesson. Gated by a per-user localStorage flag. */

const JOURNEY = [
  { icon: GraduationCap, title: "Learn the fundamentals", desc: "Free lessons — product research, store setup, ads.", accent: "bg-blue-50 text-blue-600" },
  { icon: Compass, title: "Get 1:1 mentorship", desc: "Unlock your mentor + proven framework.", accent: "bg-indigo-50 text-indigo-600" },
  { icon: TrendingUp, title: "Find winning products", desc: "AI-validated products that actually sell.", accent: "bg-violet-50 text-violet-600" },
  { icon: Building2, title: "Get your US LLC + store", desc: "Form your company and build your Shopify store.", accent: "bg-emerald-50 text-emerald-600" },
  { icon: Truck, title: "We fulfill, you scale", desc: "Orders ship from our China warehouse.", accent: "bg-amber-50 text-amber-600" },
]

interface WelcomeOnboardingModalProps {
  firstLessonId?: string
  onStart: (lessonId?: string) => void
}

export function WelcomeOnboardingModal({ firstLessonId, onStart }: WelcomeOnboardingModalProps) {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)

  const storageKey = user ? `usdrop_welcomed_${user.id}` : null

  useEffect(() => {
    if (loading || !user || !storageKey) return
    try {
      if (!localStorage.getItem(storageKey)) setOpen(true)
    } catch { /* ignore */ }
  }, [loading, user, storageKey])

  function dismiss() {
    try { if (storageKey) localStorage.setItem(storageKey, "1") } catch { /* ignore */ }
    setOpen(false)
  }

  const firstName = user?.full_name?.split(" ")[0] || "there"

  return (
    <Dialog open={open} onOpenChange={(o) => !o && dismiss()}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden gap-0">
        {/* header */}
        <div className="relative overflow-hidden px-6 py-6 md:px-7" style={{ background: "linear-gradient(135deg, #0a1628 0%, #132a4a 55%, #1d4ed8 100%)" }}>
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.14]" style={{ background: "radial-gradient(circle,#3b82f6 0%,transparent 70%)" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-white mb-3">
              <GraduationCap className="h-3.5 w-3.5" /> Welcome to USDrop
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Welcome, {firstName} 👋</h2>
            <p className="text-white/65 text-[13.5px] mt-1">Here's your path to a real US dropshipping business — all in one place.</p>
          </div>
        </div>

        {/* journey */}
        <div className="px-6 py-5 md:px-7">
          <ol className="relative">
            {JOURNEY.map((s, i) => {
              const isLast = i === JOURNEY.length - 1
              return (
                <li key={s.title} className="relative flex gap-3.5 pb-4 last:pb-0">
                  {!isLast && <span className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200" />}
                  <div className={`relative z-[1] flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${s.accent}`}><s.icon className="h-5 w-5" /></div>
                  <div className="min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-bold text-slate-400">STEP {i + 1}</span>
                    </div>
                    <h3 className="text-[14.5px] font-semibold text-slate-900 leading-tight">{s.title}</h3>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="flex items-center gap-2.5 rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3 mt-4">
            <Check className="h-4 w-4 text-blue-600 shrink-0" />
            <p className="text-[12.5px] text-slate-600">Start by completing the free lessons below — it unlocks your mentorship.</p>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-3 px-6 py-4 md:px-7 border-t border-slate-100 bg-slate-50/50">
          <Button variant="ghost" className="text-slate-500" onClick={dismiss} data-testid="button-welcome-skip">Explore on my own</Button>
          <Button
            className="ml-auto"
            onClick={() => { dismiss(); onStart(firstLessonId) }}
            data-testid="button-welcome-start"
          >
            <Play className="h-4 w-4 mr-1.5" /> Start learning <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
