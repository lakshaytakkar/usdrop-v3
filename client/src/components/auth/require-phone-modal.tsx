import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function RequirePhoneModal() {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [digits, setDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isInternal = !!user?.internal_role;
  const needsPhone = !!user && !user.phone_number && !isInternal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.length !== 10) {
      showError("Please enter a valid 10-digit mobile number");
      return;
    }
    try {
      setSubmitting(true);
      const res = await apiFetch("/api/auth/phone", {
        method: "PATCH",
        body: JSON.stringify({ phone_number: `+91${digits}` }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save phone number");
      showSuccess("Mobile number saved");
      await refreshUser();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save phone number");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={needsPhone}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="p-6">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-blue-500" />
            </div>
            <DialogTitle className="text-center text-lg">Add your mobile number</DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-500">
              We need your number to keep your account secure and share important updates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="phone-input" className="text-sm">Mobile number</Label>
              <div className="mt-1 flex items-stretch border border-gray-200 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                <span className="px-3 flex items-center text-sm text-gray-600 border-r border-gray-200 bg-gray-50 rounded-l-md">+91</span>
                <Input
                  id="phone-input"
                  data-testid="input-require-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  autoFocus
                  placeholder="98765 43210"
                  value={digits}
                  onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  maxLength={10}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">10 digits, no spaces</p>
            </div>

            <Button
              type="submit"
              disabled={submitting || digits.length !== 10}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              data-testid="button-save-require-phone"
            >
              {submitting ? "Saving..." : "Save & continue"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
