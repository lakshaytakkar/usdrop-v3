import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Trash2,
  Target,
  Layers,
  Image as ImageIcon,
  BarChart3,
  CheckCircle2,
} from "lucide-react"
import { FrameworkBanner } from "@/components/framework-banner"
import { ProPageWrapper } from "@/components/ui/pro-page-wrapper"
import { cn } from "@/lib/utils"

type AdTab = "audiences" | "adsets" | "creatives" | "results"

interface Audience {
  id: string
  product: string
  audience_name: string
  age_group: string
  demographic: string
  behaviour: string
  interest: string
}

interface AdSet {
  id: string
  ad_set_name: string
  audience_name: string
  budget: string
  testing_48h: string
  testing_72h: string
  testing_7d: string
  status: string
}

interface AdCreative {
  id: string
  ad_type: string
  ad_name: string
  headline: string
  media: string
  description: string
  cta: string
}

interface TestResult {
  id: string
  ad_set_name: string
  spend: string
  impressions: string
  clicks: string
  ctr: string
  cpc: string
  conversions: string
  roas: string
  verdict: string
}

interface AdsData {
  audiences: Audience[]
  adsets: AdSet[]
  creatives: AdCreative[]
  results: TestResult[]
}

const TABS: { key: AdTab; label: string; icon: typeof Target }[] = [
  { key: "audiences", label: "Audiences", icon: Target },
  { key: "adsets", label: "Ad Sets", icon: Layers },
  { key: "creatives", label: "Ad Creatives", icon: ImageIcon },
  { key: "results", label: "Testing Results", icon: BarChart3 },
]

const AD_TYPE_OPTIONS = ["Video", "Image", "Carousel", "Collection", "Feed"]
const CTA_OPTIONS = ["Shop Now", "Learn More", "Sign Up", "Get Offer", "Contact Us", "Download"]
const STATUS_OPTIONS = ["Active", "Paused", "Testing", "Completed", "Failed"]
const VERDICT_OPTIONS = ["Winner", "Scale", "Keep Testing", "Kill", "Pending"]

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

function InlineInput({ value, onChange, placeholder, className, type = "text" }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full bg-transparent border border-transparent hover:border-border focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-md px-2 py-1.5 text-sm outline-none transition-all",
        className
      )}
    />
  )
}

function InlineSelect({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-transparent hover:border-border focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-md px-2 py-1.5 text-sm outline-none transition-all cursor-pointer"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function DeleteButton({ onClick, id }: { onClick: () => void; id: string }) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground/40 hover:text-red-500 transition-colors p-1 cursor-pointer"
      data-testid={`button-delete-${id}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}

function StatusPill({ value }: { value: string }) {
  const colors: Record<string, string> = {
    "Winner": "bg-green-50 text-green-700 border-green-200",
    "Scale": "bg-blue-50 text-blue-700 border-blue-200",
    "Keep Testing": "bg-amber-50 text-amber-700 border-amber-200",
    "Kill": "bg-red-50 text-red-700 border-red-200",
    "Active": "bg-green-50 text-green-700 border-green-200",
    "Paused": "bg-gray-50 text-gray-500 border-gray-200",
    "Testing": "bg-blue-50 text-blue-700 border-blue-200",
    "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Failed": "bg-red-50 text-red-700 border-red-200",
  }
  if (!value) return null
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium border", colors[value] || "bg-gray-50 text-gray-600 border-gray-200")}>
      {value}
    </span>
  )
}

function AudiencesTable({ rows, onUpdate, onAdd, onDelete }: {
  rows: Audience[]
  onUpdate: (id: string, field: keyof Audience, value: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">{rows.length} audience{rows.length !== 1 ? "s" : ""}</p>
        <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5" data-testid="button-add-audience">
          <Plus className="h-4 w-4" /> Add Row
        </Button>
      </div>
      <Card className="overflow-hidden">
        <Table data-testid="table-audiences">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead className="w-[140px]">Product</TableHead>
              <TableHead className="w-[160px]">Audience Name</TableHead>
              <TableHead className="w-[110px]">Age Group</TableHead>
              <TableHead className="w-[140px]">Demographic</TableHead>
              <TableHead className="w-[160px]">Behaviour</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No audiences yet. Click "Add Row" to start defining your target audiences.</p>
                </TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={row.id} className="hover:bg-muted/50" data-testid={`row-audience-${row.id}`}>
                <TableCell className="text-center text-xs text-muted-foreground font-medium">{i + 1}</TableCell>
                <TableCell><InlineInput value={row.product} onChange={v => onUpdate(row.id, "product", v)} placeholder="Product name" /></TableCell>
                <TableCell><InlineInput value={row.audience_name} onChange={v => onUpdate(row.id, "audience_name", v)} placeholder="e.g. Fitness Moms" /></TableCell>
                <TableCell><InlineInput value={row.age_group} onChange={v => onUpdate(row.id, "age_group", v)} placeholder="18-35" /></TableCell>
                <TableCell><InlineInput value={row.demographic} onChange={v => onUpdate(row.id, "demographic", v)} placeholder="Female, US" /></TableCell>
                <TableCell><InlineInput value={row.behaviour} onChange={v => onUpdate(row.id, "behaviour", v)} placeholder="Online shoppers" /></TableCell>
                <TableCell><InlineInput value={row.interest} onChange={v => onUpdate(row.id, "interest", v)} placeholder="Yoga, Health" /></TableCell>
                <TableCell className="text-center"><DeleteButton onClick={() => onDelete(row.id)} id={row.id} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function AdSetsTable({ rows, onUpdate, onAdd, onDelete }: {
  rows: AdSet[]
  onUpdate: (id: string, field: keyof AdSet, value: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">{rows.length} ad set{rows.length !== 1 ? "s" : ""}</p>
        <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5" data-testid="button-add-adset">
          <Plus className="h-4 w-4" /> Add Row
        </Button>
      </div>
      <Card className="overflow-hidden">
        <Table data-testid="table-adsets">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead className="w-[160px]">Ad Set Name</TableHead>
              <TableHead className="w-[160px]">Audience Name</TableHead>
              <TableHead className="w-[100px]">Budget</TableHead>
              <TableHead className="w-[120px]">Testing 48 Hrs</TableHead>
              <TableHead className="w-[120px]">Testing 72 Hrs</TableHead>
              <TableHead className="w-[120px]">Testing 7 Days</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center">
                  <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No ad sets yet. Click "Add Row" to start tracking your ad sets.</p>
                </TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={row.id} className="hover:bg-muted/50" data-testid={`row-adset-${row.id}`}>
                <TableCell className="text-center text-xs text-muted-foreground font-medium">{i + 1}</TableCell>
                <TableCell><InlineInput value={row.ad_set_name} onChange={v => onUpdate(row.id, "ad_set_name", v)} placeholder="Ad Set 1" /></TableCell>
                <TableCell><InlineInput value={row.audience_name} onChange={v => onUpdate(row.id, "audience_name", v)} placeholder="Fitness Moms" /></TableCell>
                <TableCell><InlineInput value={row.budget} onChange={v => onUpdate(row.id, "budget", v)} placeholder="$20/day" /></TableCell>
                <TableCell><InlineInput value={row.testing_48h} onChange={v => onUpdate(row.id, "testing_48h", v)} placeholder="Results..." /></TableCell>
                <TableCell><InlineInput value={row.testing_72h} onChange={v => onUpdate(row.id, "testing_72h", v)} placeholder="Results..." /></TableCell>
                <TableCell><InlineInput value={row.testing_7d} onChange={v => onUpdate(row.id, "testing_7d", v)} placeholder="Results..." /></TableCell>
                <TableCell><InlineSelect value={row.status} onChange={v => onUpdate(row.id, "status", v)} options={STATUS_OPTIONS} placeholder="Status" /></TableCell>
                <TableCell className="text-center"><DeleteButton onClick={() => onDelete(row.id)} id={row.id} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function CreativesTable({ rows, onUpdate, onAdd, onDelete }: {
  rows: AdCreative[]
  onUpdate: (id: string, field: keyof AdCreative, value: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">{rows.length} creative{rows.length !== 1 ? "s" : ""}</p>
        <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5" data-testid="button-add-creative">
          <Plus className="h-4 w-4" /> Add Row
        </Button>
      </div>
      <Card className="overflow-hidden">
        <Table data-testid="table-creatives">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead className="w-[110px]">Ad Type</TableHead>
              <TableHead className="w-[160px]">Ad Name</TableHead>
              <TableHead className="w-[160px]">Headline</TableHead>
              <TableHead className="w-[140px]">Media</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">CTA</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No creatives yet. Click "Add Row" to log your ad creatives.</p>
                </TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={row.id} className="hover:bg-muted/50" data-testid={`row-creative-${row.id}`}>
                <TableCell className="text-center text-xs text-muted-foreground font-medium">{i + 1}</TableCell>
                <TableCell><InlineSelect value={row.ad_type} onChange={v => onUpdate(row.id, "ad_type", v)} options={AD_TYPE_OPTIONS} placeholder="Type" /></TableCell>
                <TableCell><InlineInput value={row.ad_name} onChange={v => onUpdate(row.id, "ad_name", v)} placeholder="Ad name" /></TableCell>
                <TableCell><InlineInput value={row.headline} onChange={v => onUpdate(row.id, "headline", v)} placeholder="Headline text" /></TableCell>
                <TableCell><InlineInput value={row.media} onChange={v => onUpdate(row.id, "media", v)} placeholder="URL or filename" /></TableCell>
                <TableCell><InlineInput value={row.description} onChange={v => onUpdate(row.id, "description", v)} placeholder="Ad description" /></TableCell>
                <TableCell><InlineSelect value={row.cta} onChange={v => onUpdate(row.id, "cta", v)} options={CTA_OPTIONS} placeholder="CTA" /></TableCell>
                <TableCell className="text-center"><DeleteButton onClick={() => onDelete(row.id)} id={row.id} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function ResultsTable({ rows, onUpdate, onAdd, onDelete }: {
  rows: TestResult[]
  onUpdate: (id: string, field: keyof TestResult, value: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">{rows.length} result{rows.length !== 1 ? "s" : ""}</p>
        <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5" data-testid="button-add-result">
          <Plus className="h-4 w-4" /> Add Row
        </Button>
      </div>
      <Card className="overflow-hidden">
        <Table data-testid="table-results">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead className="w-[150px]">Ad Set</TableHead>
              <TableHead className="w-[90px]">Spend</TableHead>
              <TableHead className="w-[100px]">Impressions</TableHead>
              <TableHead className="w-[80px]">Clicks</TableHead>
              <TableHead className="w-[70px]">CTR</TableHead>
              <TableHead className="w-[80px]">CPC</TableHead>
              <TableHead className="w-[100px]">Conversions</TableHead>
              <TableHead className="w-[80px]">ROAS</TableHead>
              <TableHead className="w-[120px]">Verdict</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="py-12 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No testing results yet. Add results after running your ad tests.</p>
                </TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={row.id} className="hover:bg-muted/50" data-testid={`row-result-${row.id}`}>
                <TableCell className="text-center text-xs text-muted-foreground font-medium">{i + 1}</TableCell>
                <TableCell><InlineInput value={row.ad_set_name} onChange={v => onUpdate(row.id, "ad_set_name", v)} placeholder="Ad Set 1" /></TableCell>
                <TableCell><InlineInput value={row.spend} onChange={v => onUpdate(row.id, "spend", v)} placeholder="$0" /></TableCell>
                <TableCell><InlineInput value={row.impressions} onChange={v => onUpdate(row.id, "impressions", v)} placeholder="0" /></TableCell>
                <TableCell><InlineInput value={row.clicks} onChange={v => onUpdate(row.id, "clicks", v)} placeholder="0" /></TableCell>
                <TableCell><InlineInput value={row.ctr} onChange={v => onUpdate(row.id, "ctr", v)} placeholder="0%" /></TableCell>
                <TableCell><InlineInput value={row.cpc} onChange={v => onUpdate(row.id, "cpc", v)} placeholder="$0" /></TableCell>
                <TableCell><InlineInput value={row.conversions} onChange={v => onUpdate(row.id, "conversions", v)} placeholder="0" /></TableCell>
                <TableCell><InlineInput value={row.roas} onChange={v => onUpdate(row.id, "roas", v)} placeholder="0x" /></TableCell>
                <TableCell><InlineSelect value={row.verdict} onChange={v => onUpdate(row.id, "verdict", v)} options={VERDICT_OPTIONS} placeholder="Verdict" /></TableCell>
                <TableCell className="text-center"><DeleteButton onClick={() => onDelete(row.id)} id={row.id} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default function MyAdsPage() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<AdTab>("audiences")
  const [data, setData] = useState<AdsData>({
    audiences: [],
    adsets: [],
    creatives: [],
    results: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dataRef = useRef(data)
  dataRef.current = data

  useEffect(() => {
    if (authLoading) return
    if (!user) { setIsLoading(false); return }

    let cancelled = false
    const fetchData = async () => {
      try {
        const res = await apiFetch("/api/ad-logs", { credentials: 'include' })
        if (res.ok && !cancelled) {
          const json = await res.json()
          setData({
            audiences: json.audiences || [],
            adsets: json.adsets || [],
            creatives: json.creatives || [],
            results: json.results || [],
          })
        }
      } catch (error) {
        console.error('Failed to load ad logs:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [authLoading, user])

  const autoSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus("unsaved")
    saveTimer.current = setTimeout(async () => {
      setSaveStatus("saving")
      try {
        const res = await apiFetch("/api/ad-logs", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataRef.current),
          credentials: 'include',
        })
        if (res.ok) {
          setSaveStatus("saved")
        } else {
          setSaveStatus("unsaved")
        }
      } catch {
        setSaveStatus("unsaved")
      }
    }, 1200)
  }, [])

  const flushSave = useCallback(async () => {
    if (!saveTimer.current) return
    clearTimeout(saveTimer.current)
    saveTimer.current = null
    try {
      await apiFetch("/api/ad-logs", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataRef.current),
        credentials: 'include',
      })
    } catch {}
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushSave()
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      flushSave()
    }
  }, [flushSave])

  const updateField = useCallback(<T extends keyof AdsData>(
    section: T,
    id: string,
    field: string,
    value: string
  ) => {
    setData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).map((row: any) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }))
    autoSave()
  }, [autoSave])

  const addRow = useCallback(<T extends keyof AdsData>(section: T) => {
    const templates: Record<keyof AdsData, () => any> = {
      audiences: () => ({ id: uid(), product: "", audience_name: "", age_group: "", demographic: "", behaviour: "", interest: "" }),
      adsets: () => ({ id: uid(), ad_set_name: "", audience_name: "", budget: "", testing_48h: "", testing_72h: "", testing_7d: "", status: "" }),
      creatives: () => ({ id: uid(), ad_type: "", ad_name: "", headline: "", media: "", description: "", cta: "" }),
      results: () => ({ id: uid(), ad_set_name: "", spend: "", impressions: "", clicks: "", ctr: "", cpc: "", conversions: "", roas: "", verdict: "" }),
    }
    setData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]()],
    }))
    autoSave()
  }, [autoSave])

  const deleteRow = useCallback(<T extends keyof AdsData>(section: T, id: string) => {
    setData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((row: any) => row.id !== id),
    }))
    autoSave()
  }, [autoSave])

  const totalAudiences = data.audiences.length
  const totalAdSets = data.adsets.length
  const totalCreatives = data.creatives.length
  const totalResults = data.results.length

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
        <Skeleton className="h-16 w-full rounded-md" />
        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <ProPageWrapper featureName="My Ads" featureDescription="Log and manage your Meta Ads campaigns — audiences, ad sets, creatives, and testing results.">
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2" data-testid="page-my-ads">
      <FrameworkBanner
        title="My Ads"
        description="Log and manage your Meta Ads campaigns — audiences, ad sets, creatives, and testing results."
        iconSrc="/images/banners/3d-products.png"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {TABS.map(tab => {
            const Icon = tab.icon
            const counts: Record<AdTab, number> = {
              audiences: totalAudiences,
              adsets: totalAdSets,
              creatives: totalCreatives,
              results: totalResults,
            }
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeTab === tab.key
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`tab-${tab.key}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {saveStatus === "saving" && (
            <span className="text-muted-foreground">Saving...</span>
          )}
          {saveStatus === "unsaved" && (
            <span className="text-amber-600">Unsaved changes</span>
          )}
        </div>
      </div>

      {activeTab === "audiences" && (
        <AudiencesTable
          rows={data.audiences}
          onUpdate={(id, field, value) => updateField("audiences", id, field, value)}
          onAdd={() => addRow("audiences")}
          onDelete={(id) => deleteRow("audiences", id)}
        />
      )}
      {activeTab === "adsets" && (
        <AdSetsTable
          rows={data.adsets}
          onUpdate={(id, field, value) => updateField("adsets", id, field, value)}
          onAdd={() => addRow("adsets")}
          onDelete={(id) => deleteRow("adsets", id)}
        />
      )}
      {activeTab === "creatives" && (
        <CreativesTable
          rows={data.creatives}
          onUpdate={(id, field, value) => updateField("creatives", id, field, value)}
          onAdd={() => addRow("creatives")}
          onDelete={(id) => deleteRow("creatives", id)}
        />
      )}
      {activeTab === "results" && (
        <ResultsTable
          rows={data.results}
          onUpdate={(id, field, value) => updateField("results", id, field, value)}
          onAdd={() => addRow("results")}
          onDelete={(id) => deleteRow("results", id)}
        />
      )}
    </div>
    </ProPageWrapper>
  )
}
