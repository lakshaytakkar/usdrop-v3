import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/layout/logo"
import { Loader2, Check, PhoneCall, Sparkles } from "lucide-react"

/* Public magic-link page — user with no phone adds it in one tap (token in ?t=).
   No login required. Reachable at /add-number?t=<jwt>. */

const API = (import.meta as any).env?.VITE_API_URL || ""

export default function AddNumberPage() {
  const token = new URLSearchParams(window.location.search).get("t") || ""
  const [state, setState] = useState<"loading" | "form" | "done" | "invalid">("loading")
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")

  useEffect(() => {
    if (!token) { setState("invalid"); return }
    fetch(`${API}/api/add-number?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.valid) { setState("invalid"); return }
        setName(d.name)
        setState(d.hasNumber ? "done" : "form")
      })
      .catch(() => setState("invalid"))
  }, [token])

  async function submit() {
    setErr("")
    setBusy(true)
    try {
      const r = await fetch(`${API}/api/add-number`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, phone }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setErr(d.error || "Couldn't save — please try again."); return }
      setState("done")
    } catch {
      setErr("Network error — please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #e8f4fd 0%, #dbeef9 40%, #c8e6f5 100%)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-white p-7">
        <div className="flex justify-center mb-5"><Logo /></div>

        {state === "loading" && (
          <div className="py-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        )}

        {state === "invalid" && (
          <div className="text-center py-4">
            <h1 className="text-lg font-bold text-slate-900 mb-1">Link expired</h1>
            <p className="text-sm text-slate-500 mb-5">Please log in and add your number in your profile.</p>
            <a href="/login"><Button>Log in to USDrop</Button></a>
          </div>
        )}

        {state === "form" && (
          <div>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-4"><PhoneCall className="h-6 w-6" /></div>
            <h1 className="text-xl font-bold text-slate-900 text-center">{name ? `Almost there, ${name.split(" ")[0]}!` : "Add your number"}</h1>
            <p className="text-[13.5px] text-slate-500 text-center mt-1.5 mb-5">
              Add your WhatsApp / phone so our team can guide you to your first US sale — free strategy call, no obligation.
            </p>
            <Input
              autoFocus
              placeholder="+91 …"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && phone.trim()) submit() }}
              className="h-11 text-center text-[15px]"
              data-testid="add-number-input"
            />
            {err && <p className="text-[12.5px] text-rose-600 mt-2 text-center">{err}</p>}
            <Button onClick={submit} disabled={busy || !phone.trim()} className="w-full mt-4 h-11" data-testid="add-number-submit">
              {busy ? "Saving…" : "Save my number"}
            </Button>
            <p className="text-[11px] text-slate-400 text-center mt-3">We'll never spam you. Used only to help you succeed.</p>
          </div>
        )}

        {state === "done" && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mx-auto mb-4"><Check className="h-7 w-7 text-emerald-600" /></div>
            <h1 className="text-xl font-bold text-slate-900">You're all set 🎉</h1>
            <p className="text-[13.5px] text-slate-500 mt-1.5 mb-5">Our team will reach out. Meanwhile, keep learning — your US business starts here.</p>
            <a href="/free-learning"><Button className="w-full"><Sparkles className="h-4 w-4 mr-2" /> Continue learning</Button></a>
          </div>
        )}
      </div>
    </div>
  )
}
