"use client"

import { useState, useEffect } from "react"
import { ExternalLayout } from "@/components/layout/external-layout"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Plus, Pencil, Trash2, KeyRound, ExternalLink } from "lucide-react"

interface Credential {
  id: string
  service_name: string
  service_url: string | null
  username: string | null
  password: string | null
  notes: string | null
  created_at: string
}

const emptyForm = {
  service_name: "",
  service_url: "",
  username: "",
  password: "",
  notes: "",
}

export default function MyCredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [showFormPassword, setShowFormPassword] = useState(false)

  const fetchCredentials = async () => {
    try {
      const res = await fetch("/api/user-credentials")
      if (res.ok) {
        const data = await res.json()
        setCredentials(data)
      }
    } catch {}
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowFormPassword(false)
    setDialogOpen(true)
  }

  const openEdit = (cred: Credential) => {
    setEditingId(cred.id)
    setForm({
      service_name: cred.service_name,
      service_url: cred.service_url || "",
      username: cred.username || "",
      password: cred.password || "",
      notes: cred.notes || "",
    })
    setShowFormPassword(false)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.service_name.trim()) return
    setSaving(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { id: editingId, ...form } : form
      const res = await fetch("/api/user-credentials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setDialogOpen(false)
        fetchCredentials()
      }
    } catch {}
    finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this credential?")) return
    try {
      await fetch(`/api/user-credentials?id=${id}`, { method: "DELETE" })
      setCredentials((prev) => prev.filter((c) => c.id !== id))
    } catch {}
  }

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <ExternalLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-purple-950 to-indigo-800 p-5 md:p-6 text-white h-[154px] flex-shrink-0">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              opacity: 0.5,
              mixBlendMode: 'overlay'
            }}
          ></div>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
              opacity: 0.4,
              mixBlendMode: 'multiply'
            }}
          ></div>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
              opacity: 0.3,
              mixBlendMode: 'screen'
            }}
          ></div>
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px),
                            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`,
              opacity: 0.6
            }}
          ></div>

          <div className="relative z-10 flex items-center gap-5 h-full">
            <img
              src="/3d-ecom-icons-blue/Rocket_Launch.png"
              alt="My Credentials"
              width={120}
              height={120}
              decoding="async"
              className="w-[6rem] h-[6rem] md:w-[7rem] md:h-[7rem] flex-shrink-0 object-contain"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">My Credentials</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Securely store your tool logins and important credentials
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={openAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Credential
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-full" />
              </Card>
            ))}
          </div>
        ) : credentials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <KeyRound className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No credentials saved yet</h3>
            <p className="text-sm text-gray-500 mb-4">Add your first credential to get started</p>
            <Button
              onClick={openAdd}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Credential
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((cred) => (
              <Card key={cred.id} className="p-4 hover:shadow-md transition-shadow">
                <CardHeader className="p-0 pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold text-gray-900 truncate pr-2">
                      {cred.service_name}
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(cred)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(cred.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-2">
                  {cred.service_url && (
                    <a
                      href={cred.service_url.startsWith("http") ? cred.service_url : `https://${cred.service_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                    >
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{cred.service_url}</span>
                    </a>
                  )}
                  {cred.username && (
                    <div>
                      <p className="text-xs text-gray-500">Username</p>
                      <p className="text-sm text-gray-800 truncate">{cred.username}</p>
                    </div>
                  )}
                  {cred.password && (
                    <div>
                      <p className="text-xs text-gray-500">Password</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-800 truncate flex-1 font-mono">
                          {showPasswords[cred.id] ? cred.password : "••••••••"}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => togglePassword(cred.id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          {showPasswords[cred.id] ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {cred.notes && (
                    <p className="text-xs text-gray-500 pt-1 line-clamp-2">{cred.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Credential" : "Add Credential"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="service_name">Service Name *</Label>
                <Input
                  id="service_name"
                  placeholder="e.g. Shopify, AliExpress"
                  value={form.service_name}
                  onChange={(e) => setForm((f) => ({ ...f, service_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_url">Service URL</Label>
                <Input
                  id="service_url"
                  placeholder="e.g. https://shopify.com"
                  value={form.service_url}
                  onChange={(e) => setForm((f) => ({ ...f, service_url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username or email"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showFormPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showFormPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  placeholder="Any additional notes..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.service_name.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <OnboardingProgressOverlay pageName="My Credentials" />
      </div>
    </ExternalLayout>
  )
}
