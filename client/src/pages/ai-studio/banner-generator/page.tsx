import { useState } from "react"
import { apiFetch } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Sparkles, Download, Wand2, ImageIcon, Monitor, Smartphone, LayoutPanelTop, Megaphone, Store } from "lucide-react"

/* AI Studio — Banner Generator. Full-AI banners (text baked in) at exact Shopify
   sizes, download as PNG. Powered by /api/ai/banner (Gemini image model). */

const PRESETS = [
  { key: "hero_desktop", label: "Desktop hero", w: 1920, h: 640, icon: Monitor },
  { key: "hero_mobile", label: "Mobile hero", w: 1080, h: 1350, icon: Smartphone },
  { key: "collection", label: "Collection", w: 1200, h: 400, icon: LayoutPanelTop },
  { key: "announcement", label: "Announce bar", w: 1200, h: 120, icon: Megaphone },
  { key: "about_us", label: "About-us", w: 1200, h: 800, icon: Store },
]

const STYLES = ["Clean & minimal", "Bold & vibrant", "Luxury / premium", "Playful & fun", "Natural / organic", "Tech / modern"]

interface Result {
  id: number
  preset: string
  label: string
  image: string
  width: number
  height: number
}

/* Draw the AI image into an exact-size canvas (cover-crop) and download as PNG. */
function downloadExact(r: Result) {
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.onload = () => {
    const canvas = document.createElement("canvas")
    canvas.width = r.width
    canvas.height = r.height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const scale = Math.max(r.width / img.width, r.height / img.height)
    const dw = img.width * scale
    const dh = img.height * scale
    ctx.drawImage(img, (r.width - dw) / 2, (r.height - dh) / 2, dw, dh)
    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = `usdrop-banner-${r.preset}-${r.width}x${r.height}.png`
    a.click()
  }
  img.src = r.image
}

let idCounter = 1

export default function BannerGeneratorPage() {
  const { showError } = useToast()
  const [preset, setPreset] = useState("hero_desktop")
  const [product, setProduct] = useState("")
  const [headline, setHeadline] = useState("")
  const [subheadline, setSubheadline] = useState("")
  const [cta, setCta] = useState("")
  const [promo, setPromo] = useState("")
  const [style, setStyle] = useState(STYLES[0])
  const [colors, setColors] = useState("")
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<Result[]>([])

  const activePreset = PRESETS.find((p) => p.key === preset)!

  async function generate() {
    if (!product.trim() && !headline.trim()) {
      showError("Add a product/niche or a headline first.")
      return
    }
    setBusy(true)
    try {
      const res = await apiFetch("/api/ai/banner", {
        method: "POST",
        body: JSON.stringify({ preset, product: product.trim(), headline: headline.trim(), subheadline: subheadline.trim(), cta: cta.trim(), promo: promo.trim(), style, colors: colors.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { showError(data.error || "Generation failed. Try again."); return }
      setResults((prev) => [{ id: idCounter++, preset, label: data.label, image: data.image, width: data.width, height: data.height }, ...prev])
    } catch {
      showError("Network error — please try again.")
    } finally {
      setBusy(false)
    }
  }

  const latest = results[0]

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-3">
      <FrameworkBanner title="Banner Generator" description="Generate on-brand Shopify banners at the exact sizes — in seconds" iconSrc="/3d-ecom-icons-blue/Toolbox_Wrench.png" tutorialVideoUrl="" />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* config */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div>
            <Label className="mb-2 block">Banner size</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPreset(p.key)}
                  className={cn("flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all", preset === p.key ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/40" : "border-slate-200 hover:border-slate-300")}
                  data-testid={`banner-preset-${p.key}`}
                >
                  <p.icon className={cn("h-4 w-4 shrink-0", preset === p.key ? "text-blue-600" : "text-slate-400")} />
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold text-slate-900 truncate">{p.label}</div>
                    <div className="text-[10.5px] text-slate-400">{p.w}×{p.h}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bg-product">Product / niche</Label>
            <Input id="bg-product" placeholder="e.g. minimalist gold jewelry" value={product} onChange={(e) => setProduct(e.target.value)} data-testid="banner-product" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bg-headline">Headline</Label>
            <Input id="bg-headline" placeholder="e.g. Timeless Elegance, Everyday" value={headline} onChange={(e) => setHeadline(e.target.value)} data-testid="banner-headline" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bg-sub">Subheadline (optional)</Label>
            <Input id="bg-sub" placeholder="e.g. Free US shipping over $50" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bg-cta">CTA button</Label>
              <Input id="bg-cta" placeholder="Shop Now" value={cta} onChange={(e) => setCta(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bg-promo">Promo badge</Label>
              <Input id="bg-promo" placeholder="50% OFF" value={promo} onChange={(e) => setPromo(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger data-testid="banner-style"><SelectValue /></SelectTrigger>
              <SelectContent>{STYLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bg-colors">Brand colors (optional)</Label>
            <Input id="bg-colors" placeholder="e.g. navy & gold" value={colors} onChange={(e) => setColors(e.target.value)} />
          </div>

          <Button onClick={generate} disabled={busy} className="w-full" data-testid="banner-generate">
            {busy ? <><Wand2 className="h-4 w-4 mr-2 animate-pulse" /> Generating…</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate banner</>}
          </Button>
          <p className="text-[11.5px] text-slate-400 text-center">Downloads as a PNG at exactly {activePreset.w}×{activePreset.h}px.</p>
        </div>

        {/* results */}
        <div className="space-y-5">
          {busy && !latest && (
            <div className="rounded-2xl border border-slate-200 bg-white flex items-center justify-center py-24"><BlueSpinner size="lg" label="Painting your banner…" /></div>
          )}

          {!busy && results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 flex flex-col items-center justify-center py-24 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 mb-4"><ImageIcon className="h-6 w-6" /></div>
              <h3 className="text-[15px] font-semibold text-slate-900">Your banners appear here</h3>
              <p className="text-[13px] text-slate-500 mt-1 max-w-xs">Pick a size, describe your product and message, then hit Generate. Regenerate for variations.</p>
            </div>
          )}

          {latest && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-slate-900">{latest.label} · {latest.width}×{latest.height}</span>
                <Button size="sm" variant="outline" onClick={() => downloadExact(latest)} data-testid="banner-download"><Download className="h-4 w-4 mr-1.5" /> Download PNG</Button>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                <img src={latest.image} alt={latest.label} className="w-full h-auto block" />
              </div>
            </div>
          )}

          {results.length > 1 && (
            <div>
              <h3 className="text-[12px] font-semibold uppercase tracking-wide text-slate-500 mb-3">Previous variations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {results.slice(1).map((r) => (
                  <div key={r.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white group relative">
                    <img src={r.image} alt={r.label} className="w-full h-auto block" />
                    <button onClick={() => downloadExact(r)} className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity" data-testid="banner-download-variation">
                      <Download className="h-4 w-4" />
                    </button>
                    <div className="px-2.5 py-1.5 text-[10.5px] text-slate-400">{r.width}×{r.height}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
