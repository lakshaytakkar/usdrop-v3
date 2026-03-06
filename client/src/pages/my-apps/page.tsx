import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  AppWindow,
  Copy,
  Check,
  KeyRound,
  Globe,
  Link2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import {
  SiShopify,
  SiStripe,
  SiAmazon,
  SiMeta,
  SiGoogle,
  SiTiktok,
  SiPaypal,
  SiMailchimp,
  SiZapier,
  SiSlack,
} from "react-icons/si"
import { FrameworkBanner } from "@/components/framework-banner"

interface UserApp {
  id: string
  app_name: string
  app_url: string | null
  app_icon: string | null
  category: string
  api_key: string | null
  api_secret: string | null
  access_token: string | null
  client_id: string | null
  client_secret: string | null
  webhook_url: string | null
  notes: string | null
  status: string
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  { value: "ecommerce", label: "E-Commerce" },
  { value: "payment", label: "Payment" },
  { value: "marketing", label: "Marketing" },
  { value: "analytics", label: "Analytics" },
  { value: "shipping", label: "Shipping" },
  { value: "social", label: "Social Media" },
  { value: "communication", label: "Communication" },
  { value: "automation", label: "Automation" },
  { value: "other", label: "Other" },
]

const POPULAR_APPS = [
  { name: "Shopify", icon: SiShopify, color: "#96BF48", category: "ecommerce", url: "https://shopify.com" },
  { name: "Stripe", icon: SiStripe, color: "#635BFF", category: "payment", url: "https://stripe.com" },
  { name: "Amazon Seller", icon: SiAmazon, color: "#FF9900", category: "ecommerce", url: "https://sellercentral.amazon.com" },
  { name: "Meta Business", icon: SiMeta, color: "#0081FB", category: "marketing", url: "https://business.facebook.com" },
  { name: "Google Ads", icon: SiGoogle, color: "#4285F4", category: "marketing", url: "https://ads.google.com" },
  { name: "TikTok Shop", icon: SiTiktok, color: "#000000", category: "ecommerce", url: "https://seller.tiktok.com" },
  { name: "PayPal", icon: SiPaypal, color: "#003087", category: "payment", url: "https://paypal.com" },
  { name: "Mailchimp", icon: SiMailchimp, color: "#FFE01B", category: "marketing", url: "https://mailchimp.com" },
  { name: "Zapier", icon: SiZapier, color: "#FF4A00", category: "automation", url: "https://zapier.com" },
  { name: "Slack", icon: SiSlack, color: "#4A154B", category: "communication", url: "https://slack.com" },
]

const emptyForm = {
  app_name: "",
  app_url: "",
  app_icon: "",
  category: "other",
  api_key: "",
  api_secret: "",
  access_token: "",
  client_id: "",
  client_secret: "",
  webhook_url: "",
  notes: "",
  status: "active",
}

function getStatusColor(status: string) {
  switch (status) {
    case "active": return "bg-green-100 text-green-700 border-green-200"
    case "inactive": return "bg-gray-100 text-gray-600 border-gray-200"
    case "error": return "bg-red-100 text-red-700 border-red-200"
    default: return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active": return <ShieldCheck className="h-3 w-3" />
    case "error": return <AlertCircle className="h-3 w-3" />
    default: return null
  }
}

function getCategoryLabel(value: string) {
  return CATEGORIES.find(c => c.value === value)?.label || "Other"
}

function MaskedField({ label, value, className }: { label: string; value: string; className?: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={className}>
      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">{label}</p>
      <div className="flex items-center gap-1">
        <p className="text-[13px] text-gray-700 truncate flex-1 font-mono">
          {visible ? value : "••••••••••••"}
        </p>
        <button
          data-testid={`btn-toggle-${label.toLowerCase().replace(/\s/g, '-')}`}
          onClick={() => setVisible(!visible)}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
        <button
          data-testid={`btn-copy-${label.toLowerCase().replace(/\s/g, '-')}`}
          onClick={handleCopy}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}

export default function MyAppsPage() {
  const [apps, setApps] = useState<UserApp[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const fetchApps = async () => {
    try {
      const res = await apiFetch("/api/user-apps")
      if (res.ok) {
        const data = await res.json()
        setApps(data)
      }
    } catch {}
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [])

  const filteredApps = useMemo(() => {
    let result = apps
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.app_name.toLowerCase().includes(q) ||
        (a.app_url && a.app_url.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      )
    }
    if (filterCategory !== "all") {
      result = result.filter(a => a.category === filterCategory)
    }
    return result
  }, [apps, search, filterCategory])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openQuickAdd = () => {
    setQuickAddOpen(true)
  }

  const selectPopularApp = (app: typeof POPULAR_APPS[0]) => {
    setForm({
      ...emptyForm,
      app_name: app.name,
      app_url: app.url,
      category: app.category,
    })
    setQuickAddOpen(false)
    setEditingId(null)
    setDialogOpen(true)
  }

  const openEdit = (app: UserApp) => {
    setEditingId(app.id)
    setForm({
      app_name: app.app_name,
      app_url: app.app_url || "",
      app_icon: app.app_icon || "",
      category: app.category || "other",
      api_key: app.api_key || "",
      api_secret: app.api_secret || "",
      access_token: app.access_token || "",
      client_id: app.client_id || "",
      client_secret: app.client_secret || "",
      webhook_url: app.webhook_url || "",
      notes: app.notes || "",
      status: app.status || "active",
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.app_name.trim()) return
    setSaving(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { id: editingId, ...form } : form
      const res = await apiFetch("/api/user-apps", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setDialogOpen(false)
        fetchApps()
      }
    } catch {}
    finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this app?")) return
    try {
      await apiFetch(`/api/user-apps?id=${id}`, { method: "DELETE" })
      setApps((prev) => prev.filter((a) => a.id !== id))
    } catch {}
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
        <FrameworkBanner
          title="My Apps"
          description="Connect and manage your external apps, API keys, and integrations"
          iconSrc="/3d-ecom-icons-blue/Toolbox_Wrench.png"
          tutorialVideoUrl=""
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                data-testid="input-search-apps"
                placeholder="Search apps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-gray-200"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px] bg-white border-gray-200" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              data-testid="btn-quick-add"
              variant="outline"
              onClick={openQuickAdd}
              className="border-gray-200"
            >
              <Globe className="h-4 w-4 mr-1.5" />
              Popular Apps
            </Button>
            <Button
              data-testid="btn-add-app"
              onClick={openAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add App
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <AppWindow className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1" data-testid="text-empty-state">
              {search || filterCategory !== "all" ? "No apps match your filter" : "No apps connected yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {search || filterCategory !== "all"
                ? "Try adjusting your search or filter"
                : "Add your first external app to manage credentials and API keys"}
            </p>
            {!search && filterCategory === "all" && (
              <div className="flex gap-2">
                <Button
                  data-testid="btn-empty-quick-add"
                  variant="outline"
                  onClick={openQuickAdd}
                >
                  <Globe className="h-4 w-4 mr-1.5" />
                  Popular Apps
                </Button>
                <Button
                  data-testid="btn-empty-add"
                  onClick={openAdd}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add App
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredApps.map((app) => {
              const popularMatch = POPULAR_APPS.find(p => p.name.toLowerCase() === app.app_name.toLowerCase())
              const IconComponent = popularMatch?.icon
              const hasCredentials = !!(app.api_key || app.api_secret || app.access_token || app.client_id || app.client_secret)

              return (
                <Card
                  key={app.id}
                  data-testid={`card-app-${app.id}`}
                  className="p-5 border border-gray-100 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: popularMatch?.color || "#6366f1" }}
                      >
                        {IconComponent ? (
                          <IconComponent className="h-5 w-5" />
                        ) : (
                          app.app_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-gray-900">{app.app_name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal border-gray-200 text-gray-500">
                            {getCategoryLabel(app.category)}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-medium flex items-center gap-0.5 ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {app.app_url && (
                        <a
                          href={app.app_url.startsWith("http") ? app.app_url : `https://${app.app_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`link-app-url-${app.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        data-testid={`btn-edit-app-${app.id}`}
                        onClick={() => openEdit(app)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        data-testid={`btn-delete-app-${app.id}`}
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {hasCredentials ? (
                    <div className="space-y-1.5 pt-2 border-t border-gray-50">
                      {app.api_key && <MaskedField label="API Key" value={app.api_key} />}
                      {app.api_secret && <MaskedField label="API Secret" value={app.api_secret} />}
                      {app.access_token && <MaskedField label="Access Token" value={app.access_token} />}
                      {app.client_id && <MaskedField label="Client ID" value={app.client_id} />}
                      {app.client_secret && <MaskedField label="Client Secret" value={app.client_secret} />}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-[12px] text-gray-400 italic">No credentials added yet</p>
                    </div>
                  )}

                  {app.webhook_url && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Webhook URL</p>
                      <div className="flex items-center gap-1">
                        <Link2 className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <p className="text-[12px] text-blue-600 truncate font-mono">{app.webhook_url}</p>
                      </div>
                    </div>
                  )}

                  {app.notes && (
                    <p className="text-[12px] text-gray-500 mt-2 pt-2 border-t border-gray-50 line-clamp-2">{app.notes}</p>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Popular App</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 -mt-2">Select an app to quickly set it up with your credentials.</p>
          <div className="grid grid-cols-2 gap-2 py-2">
            {POPULAR_APPS.map((app) => {
              const Icon = app.icon
              return (
                <button
                  key={app.name}
                  data-testid={`btn-popular-${app.name.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => selectPopularApp(app)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
                >
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: app.color }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{app.name}</p>
                    <p className="text-[11px] text-gray-400">{getCategoryLabel(app.category)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit App" : "Add App"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="app_name">App Name *</Label>
                <Input
                  id="app_name"
                  data-testid="input-app-name"
                  placeholder="e.g. Shopify, Stripe"
                  value={form.app_name}
                  onChange={(e) => setForm((f) => ({ ...f, app_name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="app_url">App URL</Label>
              <Input
                id="app_url"
                data-testid="input-app-url"
                placeholder="https://example.com"
                value={form.app_url}
                onChange={(e) => setForm((f) => ({ ...f, app_url: e.target.value }))}
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-gray-400" />
                Credentials
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input
                      id="api_key"
                      data-testid="input-api-key"
                      type="password"
                      placeholder="sk_live_..."
                      value={form.api_key}
                      onChange={(e) => setForm((f) => ({ ...f, api_key: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="api_secret">API Secret</Label>
                    <Input
                      id="api_secret"
                      data-testid="input-api-secret"
                      type="password"
                      placeholder="Secret key..."
                      value={form.api_secret}
                      onChange={(e) => setForm((f) => ({ ...f, api_secret: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="access_token">Access Token</Label>
                  <Input
                    id="access_token"
                    data-testid="input-access-token"
                    type="password"
                    placeholder="Token..."
                    value={form.access_token}
                    onChange={(e) => setForm((f) => ({ ...f, access_token: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="client_id">Client ID</Label>
                    <Input
                      id="client_id"
                      data-testid="input-client-id"
                      placeholder="Client ID..."
                      value={form.client_id}
                      onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client_secret">Client Secret</Label>
                    <Input
                      id="client_secret"
                      data-testid="input-client-secret"
                      type="password"
                      placeholder="Client secret..."
                      value={form.client_secret}
                      onChange={(e) => setForm((f) => ({ ...f, client_secret: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="webhook_url">Webhook URL</Label>
                  <Input
                    id="webhook_url"
                    data-testid="input-webhook-url"
                    placeholder="https://example.com/webhook"
                    value={form.webhook_url}
                    onChange={(e) => setForm((f) => ({ ...f, webhook_url: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {editingId && (
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                data-testid="input-notes"
                placeholder="Additional notes about this app..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving} data-testid="btn-cancel">
              Cancel
            </Button>
            <Button
              data-testid="btn-save-app"
              onClick={handleSave}
              disabled={saving || !form.app_name.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
