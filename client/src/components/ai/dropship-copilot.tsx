import { useState, useRef, useEffect } from "react"
import { apiFetch } from "@/lib/supabase"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Sparkles, Send, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

/* Dropship Copilot — a real Gemini-backed AI assistant (push-drawer), available
   across the portal. Calls /api/ai/chat. Mounted globally in AppLayout. */

interface Msg { role: "user" | "assistant"; text: string }

const SUGGESTIONS = [
  "Find me a winning product to sell",
  "How do I set up my Shopify store?",
  "What should I price my product at?",
  "How does USDrop fulfillment work?",
]

export function DropshipCopilot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, busy])

  async function send(text: string) {
    const q = text.trim()
    if (!q || busy) return
    const next = [...messages, { role: "user" as const, text: q }]
    setMessages(next)
    setInput("")
    setBusy(true)
    try {
      const res = await apiFetch("/api/ai/chat", { method: "POST", body: JSON.stringify({ messages: next }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessages([...next, { role: "assistant", text: data.error || "Something went wrong. Please try again." }])
      } else {
        setMessages([...next, { role: "assistant", text: data.reply || "…" }])
      }
    } catch {
      setMessages([...next, { role: "assistant", text: "Network error — please try again." }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 h-11 pl-3 pr-4 rounded-full text-white text-[13px] font-semibold shadow-lg hover:shadow-xl transition-all"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #2563eb 60%, #3b82f6 100%)" }}
        data-testid="button-open-copilot"
      >
        <Sparkles className="h-4 w-4" /> Ask AI
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="px-5 py-4 border-b border-slate-100">
            <SheetTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white"><Sparkles className="h-4 w-4" /></span>
              Dropship Copilot
            </SheetTitle>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.length === 0 ? (
              <div className="pt-2">
                <p className="text-[13.5px] text-slate-500 mb-4">Your AI dropshipping mentor. Ask anything about products, stores, ads, fulfillment or your US LLC.</p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="w-full text-left text-[13px] text-slate-700 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 hover:border-blue-300 hover:bg-blue-50/40 transition-colors" data-testid="copilot-suggestion">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap",
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800")}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {busy && (
              <div className="flex justify-start"><div className="bg-slate-100 rounded-2xl px-3.5 py-2.5"><Loader2 className="h-4 w-4 animate-spin text-slate-400" /></div></div>
            )}
          </div>

          <div className="border-t border-slate-100 p-3">
            <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the Copilot…"
                className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                data-testid="copilot-input"
              />
              <button type="submit" disabled={!input.trim() || busy} className={cn("flex items-center justify-center w-10 h-10 rounded-xl text-white transition-colors", input.trim() && !busy ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed")} data-testid="copilot-send">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
