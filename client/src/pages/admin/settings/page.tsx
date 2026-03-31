import { apiFetch } from "@/lib/supabase";
import { useState } from "react";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell, PageHeader } from "@/components/admin-shared";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  const { email } = useUserMetadata();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChangePassword = async () => {
    setErrors([]);
    const errs: string[] = [];
    if (!passwords.newPass) errs.push("New password is required");
    if (passwords.newPass.length < 8) errs.push("Password must be at least 8 characters");
    if (passwords.newPass !== passwords.confirm) errs.push("Passwords do not match");
    if (errs.length) { setErrors(errs); return; }

    try {
      setSaving(true);
      const res = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ password: passwords.newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      showSuccess("Password changed successfully");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <PageHeader title="Account Settings" subtitle="Manage your security and account preferences" />

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Change Password</h3>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email-display">Email</Label>
              <Input
                id="email-display"
                value={email || ""}
                disabled
                className="opacity-60 cursor-not-allowed"
                data-testid="input-settings-email"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                  data-testid="input-new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="toggle-new-password"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  data-testid="input-confirm-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="toggle-confirm-password"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errors.length > 0 && (
              <ul className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 px-4 py-3 space-y-1">
                {errors.map((e, i) => (
                  <li key={i} className="text-sm text-red-600 dark:text-red-400">{e}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={saving}
              data-testid="button-change-password"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Lock className="mr-1.5 h-4 w-4" />
              {saving ? "Saving..." : "Update Password"}
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
