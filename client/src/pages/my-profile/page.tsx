

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Save, ChevronDown, ChevronUp, User, Building2, Share2, Link2 } from "lucide-react"

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
  const [showMore, setShowMore] = useState(false)

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
    <div className="flex flex-1 flex-col px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">

      {loading ? (
        <div className="max-w-2xl space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">

          <div className="flex items-center gap-2.5 ds-text-heading">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="ds-card-title">Personal Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="ds-label ds-text-muted">Full Name</Label>
              <Input
                id="full_name"
                data-testid="input-full-name"
                value={details.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="ds-label ds-text-muted">Email</Label>
              <Input
                id="email"
                data-testid="input-email"
                value={details.email}
                readOnly
                className="bg-muted/50 cursor-not-allowed text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_number" className="ds-label ds-text-muted">Contact Number</Label>
              <Input
                id="contact_number"
                data-testid="input-contact-number"
                value={details.contact_number}
                onChange={(e) => handleChange("contact_number", e.target.value)}
                placeholder="Enter your contact number"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website_name" className="ds-label ds-text-muted">Website</Label>
              <Input
                id="website_name"
                data-testid="input-website-name"
                value={details.website_name}
                onChange={(e) => handleChange("website_name", e.target.value)}
                placeholder="Enter your website name"
              />
            </div>
          </div>

          <div className="border-t border-gray-200/60 my-2" />

          <div className="flex items-center gap-2.5 ds-text-heading">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="ds-card-title">Business Details</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="llc_name" className="ds-label ds-text-muted">LLC Name</Label>
              <Input
                id="llc_name"
                data-testid="input-llc-name"
                value={details.llc_name}
                onChange={(e) => handleChange("llc_name", e.target.value)}
                placeholder="Enter your LLC name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ein_name" className="ds-label ds-text-muted">EIN</Label>
              <Input
                id="ein_name"
                data-testid="input-ein-name"
                value={details.ein_name}
                onChange={(e) => handleChange("ein_name", e.target.value)}
                placeholder="Enter your EIN"
              />
            </div>
          </div>

          <div className="border-t border-gray-200/60 my-2" />

          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            data-testid="button-show-more-details"
          >
            {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showMore ? "Show less" : "More details"}
            <span className="text-xs text-gray-400 font-normal">(Social, IDs, Tools)</span>
          </button>

          {showMore && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">

              <div className="flex items-center gap-2.5 ds-text-heading">
                <Share2 className="h-5 w-5 text-blue-600" />
                <h3 className="ds-card-title">Social Media</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="facebook_page" className="ds-label ds-text-muted">Facebook Page</Label>
                  <Input
                    id="facebook_page"
                    data-testid="input-facebook-page"
                    type="url"
                    value={details.facebook_page}
                    onChange={(e) => handleChange("facebook_page", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="instagram_account" className="ds-label ds-text-muted">Instagram</Label>
                  <Input
                    id="instagram_account"
                    data-testid="input-instagram-account"
                    value={details.instagram_account}
                    onChange={(e) => handleChange("instagram_account", e.target.value)}
                    placeholder="@youraccount"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200/60 my-2" />

              <div className="flex items-center gap-2.5 ds-text-heading">
                <Link2 className="h-5 w-5 text-blue-600" />
                <h3 className="ds-card-title">Enrollment & Tools</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="batch_id" className="ds-label ds-text-muted">Batch ID</Label>
                  <Input
                    id="batch_id"
                    data-testid="input-batch-id"
                    value={details.batch_id}
                    onChange={(e) => handleChange("batch_id", e.target.value)}
                    placeholder="Enter your batch ID"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="enrolled_number" className="ds-label ds-text-muted">Enrolled Number</Label>
                  <Input
                    id="enrolled_number"
                    data-testid="input-enrolled-number"
                    value={details.enrolled_number}
                    onChange={(e) => handleChange("enrolled_number", e.target.value)}
                    placeholder="Enter your enrolled number"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="learning_videos_link" className="ds-label ds-text-muted">Learning Videos Link</Label>
                  <Input
                    id="learning_videos_link"
                    data-testid="input-learning-videos-link"
                    type="url"
                    value={details.learning_videos_link}
                    onChange={(e) => handleChange("learning_videos_link", e.target.value)}
                    placeholder="https://example.com/videos"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tools_url" className="ds-label ds-text-muted">Tools URL</Label>
                  <Input
                    id="tools_url"
                    data-testid="input-tools-url"
                    type="url"
                    value={details.tools_url}
                    onChange={(e) => handleChange("tools_url", e.target.value)}
                    placeholder="https://example.com/tools"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tools_username" className="ds-label ds-text-muted">Tools Username</Label>
                  <Input
                    id="tools_username"
                    data-testid="input-tools-username"
                    value={details.tools_username}
                    onChange={(e) => handleChange("tools_username", e.target.value)}
                    placeholder="Enter your tools username"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tools_password" className="ds-label ds-text-muted">Tools Password</Label>
                  <div className="relative">
                    <Input
                      id="tools_password"
                      data-testid="input-tools-password"
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
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="useful_links" className="ds-label ds-text-muted">Useful Links</Label>
                  <textarea
                    id="useful_links"
                    data-testid="input-useful-links"
                    value={details.useful_links}
                    onChange={(e) => handleChange("useful_links", e.target.value)}
                    placeholder="Add useful links, one per line"
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving} size="lg" data-testid="button-save-profile">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}
