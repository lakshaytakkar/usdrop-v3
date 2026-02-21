

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Save } from "lucide-react"

interface UserDetails {
  email: string
  full_name: string
  contact_number: string
  batch_id: string
  enrolled_number: string
  website_name: string
  llc_name: string
  ein_name: string
  facebook_page: string
  instagram_account: string
  learning_videos_link: string
  useful_links: string
  tools_url: string
  tools_username: string
  tools_password: string
}

const defaultDetails: UserDetails = {
  email: "",
  full_name: "",
  contact_number: "",
  batch_id: "",
  enrolled_number: "",
  website_name: "",
  llc_name: "",
  ein_name: "",
  facebook_page: "",
  instagram_account: "",
  learning_videos_link: "",
  useful_links: "",
  tools_url: "",
  tools_username: "",
  tools_password: "",
}

export default function MyProfilePage() {
  const { showSuccess, showError } = useToast()
  const [details, setDetails] = useState<UserDetails>(defaultDetails)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    apiFetch("/api/user-details")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      })
      .then((data) => {
        setDetails({
          email: data.email || "",
          full_name: data.full_name || "",
          contact_number: data.contact_number || "",
          batch_id: data.batch_id || "",
          enrolled_number: data.enrolled_number || "",
          website_name: data.website_name || "",
          llc_name: data.llc_name || "",
          ein_name: data.ein_name || "",
          facebook_page: data.facebook_page || "",
          instagram_account: data.instagram_account || "",
          learning_videos_link: data.learning_videos_link || "",
          useful_links: data.useful_links || "",
          tools_url: data.tools_url || "",
          tools_username: data.tools_username || "",
          tools_password: data.tools_password || "",
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (field: keyof UserDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await apiFetch("/api/user-details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      })
      if (!res.ok) throw new Error("Failed to save")
      showSuccess("Profile updated successfully!")
    } catch {
      showError("Failed to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={details.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={details.email}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input
                      id="contact_number"
                      value={details.contact_number}
                      onChange={(e) => handleChange("contact_number", e.target.value)}
                      placeholder="Enter your contact number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch_id">Batch ID</Label>
                    <Input
                      id="batch_id"
                      value={details.batch_id}
                      onChange={(e) => handleChange("batch_id", e.target.value)}
                      placeholder="Enter your batch ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrolled_number">Enrolled Number</Label>
                    <Input
                      id="enrolled_number"
                      value={details.enrolled_number}
                      onChange={(e) => handleChange("enrolled_number", e.target.value)}
                      placeholder="Enter your enrolled number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_name">Website Name</Label>
                    <Input
                      id="website_name"
                      value={details.website_name}
                      onChange={(e) => handleChange("website_name", e.target.value)}
                      placeholder="Enter your website name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="llc_name">LLC Name</Label>
                    <Input
                      id="llc_name"
                      value={details.llc_name}
                      onChange={(e) => handleChange("llc_name", e.target.value)}
                      placeholder="Enter your LLC name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ein_name">EIN Name</Label>
                    <Input
                      id="ein_name"
                      value={details.ein_name}
                      onChange={(e) => handleChange("ein_name", e.target.value)}
                      placeholder="Enter your EIN name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook_page">Facebook Page</Label>
                    <Input
                      id="facebook_page"
                      type="url"
                      value={details.facebook_page}
                      onChange={(e) => handleChange("facebook_page", e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram_account">Instagram Account</Label>
                    <Input
                      id="instagram_account"
                      value={details.instagram_account}
                      onChange={(e) => handleChange("instagram_account", e.target.value)}
                      placeholder="@youraccount"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources & Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="learning_videos_link">Learning Videos Link</Label>
                    <Input
                      id="learning_videos_link"
                      type="url"
                      value={details.learning_videos_link}
                      onChange={(e) => handleChange("learning_videos_link", e.target.value)}
                      placeholder="https://example.com/videos"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="useful_links">Useful Links</Label>
                    <textarea
                      id="useful_links"
                      value={details.useful_links}
                      onChange={(e) => handleChange("useful_links", e.target.value)}
                      placeholder="Add useful links, one per line"
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tools_url">Tools URL</Label>
                    <Input
                      id="tools_url"
                      type="url"
                      value={details.tools_url}
                      onChange={(e) => handleChange("tools_url", e.target.value)}
                      placeholder="https://example.com/tools"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tools_username">Tools Username</Label>
                    <Input
                      id="tools_username"
                      value={details.tools_username}
                      onChange={(e) => handleChange("tools_username", e.target.value)}
                      placeholder="Enter your tools username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tools_password">Tools Password</Label>
                    <div className="relative">
                      <Input
                        id="tools_password"
                        type={showPassword ? "text" : "password"}
                        value={details.tools_password}
                        onChange={(e) => handleChange("tools_password", e.target.value)}
                        placeholder="Enter your tools password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving} size="lg">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
