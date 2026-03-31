import { apiFetch } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useUnifiedUser } from "@/contexts/unified-user-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageShell, PageHeader } from "@/components/admin-shared";
import { Save, User, Camera } from "lucide-react";

export default function AdminProfilePage() {
  const { id, email, fullName, avatarUrl, internalRole } = useUserMetadata();
  const { refreshMetadata } = useUnifiedUser();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", phone_number: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
        });
      })
      .catch(() => {});
  }, [id]);

  const displayAvatarUrl = previewUrl || avatarUrl || undefined;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be smaller than 5MB");
      return;
    }

    setPendingFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      setSaving(true);

      if (pendingFile) {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const photoRes = await apiFetch("/api/admin/profile/avatar", {
          method: "POST",
          body: formData,
        });
        if (!photoRes.ok) {
          const err = await photoRes.json().catch(() => ({}));
          throw new Error(err.error || "Photo upload failed");
        }
        setPendingFile(null);
      }

      const res = await apiFetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          full_name: form.full_name || null,
          phone_number: form.phone_number || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");

      showSuccess("Profile saved successfully");
      await refreshMetadata();
      setPreviewUrl(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const initials = (fullName || email || "A")
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <PageShell>
      <PageHeader title="My Profile" subtitle="Manage your personal information and account details" />

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="size-16">
                <AvatarImage src={displayAvatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">{initials}</AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                data-testid="button-change-avatar"
                title="Change profile photo"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>

              {pendingFile && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] text-white font-bold ring-2 ring-background">
                  1
                </span>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileSelect}
                data-testid="input-avatar-file"
              />
            </div>

            <div>
              <p className="font-semibold text-base">{fullName || form.full_name || email?.split("@")[0] || "Admin"}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{internalRole?.replace(/_/g, " ") || "Admin"}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                data-testid="button-change-photo-text"
              >
                {pendingFile ? "Photo selected — click Save Changes" : "Change photo"}
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                data-testid="input-full-name"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                data-testid="input-email"
                value={email || ""}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact super admin to update.</p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                data-testid="input-phone"
                placeholder="Enter your phone number"
                value={form.phone_number}
                onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              data-testid="button-save-profile"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Save className="mr-1.5 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Account Info</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Role</p>
              <p className="font-medium capitalize">{internalRole?.replace(/_/g, " ") || "Admin"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Account Type</p>
              <p className="font-medium">Internal Staff</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
