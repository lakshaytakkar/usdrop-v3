import { useState } from "react"
import { apiFetch } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Sparkles, Wand2, Download, RefreshCw, ArrowRight, ArrowLeft, Copy, Check, Palette } from "lucide-react"

/* AI Studio — Brand Kit + Logo generator. Multi-step: brief -> AI brand board
   (logo variations + palette + fonts + taglines + voice). Gemini image + JSON. */

const VIBES = ["Minimal & clean", "Bold & vibrant", "Luxury / premium", "Playful & fun", "Natural / organic", "Modern / tech", "Vintage / retro"]

interface Kit {
  palette: { name: string; hex: string }[]
  fonts: { heading: string; body: string }
  taglines: string[]
  voice: string
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a); a.click(); a.remove()
}

export default function BrandKitPage() {
  const { showError, showSuccess } = useToast()
  const [step, setStep] = useState<"brief" | "board">("brief")
  const [name, setName] = useState("")
  const [niche, setNiche] = useState("")
  const [vibe, setVibe] = useState(VIBES[0])
  const [colors, setColors] = useState("")

  const [logos, setLogos] = useState<string[]>([])
  const [activeLogo, setActiveLogo] = useState(0)
  const [busyLogo, setBusyLogo] = useState(false)
  const [kit, setKit] = useState<Kit | null>(null)
  const [busyKit, setBusyKit] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function genLogo(): Promise<string | null> {
    const res = await apiFetch("/api/ai/logo", { method: "POST", body: JSON.stringify({ name: name.trim(), niche: niche.trim(), style: vibe, colors: colors.trim() }) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) { showError(data.error || "Logo failed."); return null }
    return data.image as string
  }
  async function genKit(): Promise<Kit | null> {
    const res = await apiFetch("/api/ai/brand-kit", { method: "POST", body: JSON.stringify({ name: name.trim(), niche: niche.trim(), vibe }) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) { showError(data.error || "Brand kit failed."); return null }
    return data.kit as Kit
  }

  async function start() {
    if (!name.trim()) { showError("Enter a brand name first."); return }
    setStep("board"); setBusyLogo(true); setBusyKit(true); setLogos([]); setKit(null)
    const [logo, k] = await Promise.all([genLogo().finally(() => setBusyLogo(false)), genKit().finally(() => setBusyKit(false))])
    if (logo) { setLogos([logo]); setActiveLogo(0) }
    if (k) setKit(k)
  }

  async function regenLogo() {
    setBusyLogo(true)
    const logo = await genLogo().finally(() => setBusyLogo(false))
    if (logo) { setLogos((p) => [logo, ...p]); setActiveLogo(0) }
  }
  async function regenKit() {
    setBusyKit(true)
    const k = await genKit().finally(() => setBusyKit(false))
    if (k) setKit(k)
  }

  function copyHex(hex: string) {
    navigator.clipboard?.writeText(hex).then(() => { setCopied(hex); showSuccess(`Copied ${hex}`); setTimeout(() => setCopied(null), 1200) }).catch(() => {})
  }

  const logo = logos[activeLogo]

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner title="Brand Kit + Logo" description="Generate a logo, colors, fonts and voice for your brand in seconds" iconSrc="/3d-ecom-icons-blue/Toolbox_Wrench.png" tutorialVideoUrl="" />

      {step === "brief" ? (
        <div className="max-w-xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white"><Palette className="h-4.5 w-4.5" /></div>
              <h2 className="text-[16px] font-semibold text-slate-900">Tell us about your brand</h2>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-name">Brand name</Label>
              <Input id="bk-name" placeholder="e.g. Lumo" value={name} onChange={(e) => setName(e.target.value)} data-testid="bk-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-niche">Niche / what you sell</Label>
              <Input id="bk-niche" placeholder="e.g. minimalist home lighting" value={niche} onChange={(e) => setNiche(e.target.value)} data-testid="bk-niche" />
            </div>
            <div className="space-y-1.5">
              <Label>Vibe</Label>
              <Select value={vibe} onValueChange={setVibe}>
                <SelectTrigger data-testid="bk-vibe"><SelectValue /></SelectTrigger>
                <SelectContent>{VIBES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-colors">Color preference (optional)</Label>
              <Input id="bk-colors" placeholder="e.g. warm neutrals & sage green" value={colors} onChange={(e) => setColors(e.target.value)} />
            </div>
            <Button onClick={start} className="w-full" data-testid="bk-generate"><Sparkles className="h-4 w-4 mr-2" /> Generate my brand</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
          {/* Logo */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-slate-900">Logo</h3>
              <button onClick={() => setStep("brief")} className="text-[12px] text-slate-400 hover:text-slate-700 inline-flex items-center gap-1"><ArrowLeft className="h-3.5 w-3.5" /> Edit brief</button>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 aspect-square flex items-center justify-center overflow-hidden mb-3">
              {busyLogo && !logo ? <BlueSpinner size="lg" label="Designing…" /> : logo ? <img src={logo} alt="logo" className="w-full h-full object-contain" /> : <span className="text-sm text-slate-400">No logo</span>}
            </div>
            {logos.length > 1 && (
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {logos.map((l, i) => (
                  <button key={i} onClick={() => setActiveLogo(i)} className={cn("w-12 h-12 rounded-lg border-2 shrink-0 overflow-hidden bg-white", i === activeLogo ? "border-blue-500" : "border-slate-200")}>
                    <img src={l} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={regenLogo} disabled={busyLogo} className="flex-1" data-testid="bk-regen-logo"><RefreshCw className={cn("h-4 w-4 mr-1.5", busyLogo && "animate-spin")} /> Variation</Button>
              <Button size="sm" onClick={() => logo && downloadDataUrl(logo, `${name || "logo"}-logo.png`)} disabled={!logo} className="flex-1" data-testid="bk-download-logo"><Download className="h-4 w-4 mr-1.5" /> Download</Button>
            </div>
          </div>

          {/* Brand kit */}
          <div className="space-y-5">
            {busyKit && !kit ? (
              <div className="rounded-2xl border border-slate-200 bg-white flex items-center justify-center py-20"><BlueSpinner size="lg" label="Building your brand kit…" /></div>
            ) : kit ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[14px] font-semibold text-slate-900">Color palette</h3>
                    <button onClick={regenKit} disabled={busyKit} className="text-[12px] text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"><RefreshCw className={cn("h-3.5 w-3.5", busyKit && "animate-spin")} /> Regenerate</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(kit.palette || []).map((c) => (
                      <button key={c.hex + c.name} onClick={() => copyHex(c.hex)} className="text-left group" data-testid="bk-swatch">
                        <div className="h-16 rounded-xl border border-black/5 relative" style={{ background: c.hex }}>
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {copied === c.hex ? <Check className="h-4 w-4 text-white drop-shadow" /> : <Copy className="h-4 w-4 text-white drop-shadow" />}
                          </span>
                        </div>
                        <div className="text-[11.5px] font-medium text-slate-700 mt-1.5">{c.name}</div>
                        <div className="text-[10.5px] text-slate-400 uppercase">{c.hex}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Fonts</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Heading</div>
                        <div className="text-[22px] font-bold text-slate-900" style={{ fontFamily: kit.fonts?.heading }}>{kit.fonts?.heading}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Body</div>
                        <div className="text-[15px] text-slate-700" style={{ fontFamily: kit.fonts?.body }}>{kit.fonts?.body} — the quick brown fox.</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Taglines</h3>
                    <ul className="space-y-2">
                      {(kit.taglines || []).map((t) => (
                        <li key={t} className="flex items-start gap-2 text-[13.5px] text-slate-700"><span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-[14px] font-semibold text-slate-900 mb-2">Brand voice</h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed">{kit.voice}</p>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-400">Couldn't build the brand kit. <button onClick={regenKit} className="text-blue-600">Try again</button></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
