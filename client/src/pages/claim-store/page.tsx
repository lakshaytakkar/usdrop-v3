import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlueSpinner } from "@/components/ui/blue-spinner";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Laptop,
  Package,
  Palette,
  RefreshCw,
  ShieldCheck,
  Star,
  Store,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

type StoreClaim = {
  id: string;
  user_id: string;
  store_name: string;
  niche: string;
  status: "pending" | "processing" | "ready" | "claimed" | "cancelled" | "failed";
  shopify_store_url: string | null;
  shopify_admin_url: string | null;
  products_count: number;
  template_applied: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  claimed_at: string | null;
};

const ELECTRONICS_PRODUCTS = [
  "Wireless Bluetooth Earbuds Pro",
  "Smart Watch Fitness Tracker",
  "Portable LED Projector HD",
  "USB-C Fast Charging Hub",
  "Magnetic Phone Mount Stand",
  "Mini Bluetooth Speaker",
  "LED Ring Light with Tripod",
  "Wireless Charging Pad",
  "Smart LED Light Strips RGB",
  "Noise Cancelling Headphones",
  "Portable Power Bank 20000mAh",
  "Digital Kitchen Scale",
  "Smart WiFi Plug Socket",
  "Wireless Gaming Mouse",
  "Car Dash Cam HD 1080p",
  "Electric Air Duster",
  "Foldable Phone Stand",
  "Smart Door Sensor Kit",
  "USB Desk Fan Quiet",
  "LED Desk Lamp Adjustable",
];

export default function ClaimStorePage() {
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingClaim, setExistingClaim] = useState<StoreClaim | null>(null);
  const [storeName, setStoreName] = useState("");
  const [storeNameError, setStoreNameError] = useState("");
  const [pollingId, setPollingId] = useState<ReturnType<typeof setInterval> | null>(null);

  const [loadError, setLoadError] = useState(false);

  const fetchExistingClaims = useCallback(async () => {
    try {
      setLoadError(false);
      const res = await apiFetch("/api/store-claims");
      if (!res.ok) {
        setLoadError(true);
        return;
      }
      const data = await res.json();
      const activeClaim = data.claims?.find(
        (c: StoreClaim) => c.status !== "cancelled"
      );
      if (activeClaim) {
        setExistingClaim(activeClaim);
        if (["ready", "claimed", "processing", "pending", "failed"].includes(activeClaim.status)) {
          setStep(3);
        }
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExistingClaims();
  }, [fetchExistingClaims]);

  useEffect(() => {
    if (
      existingClaim &&
      (existingClaim.status === "pending" || existingClaim.status === "processing")
    ) {
      let pollCount = 0;
      const maxPolls = 60;
      const id = setInterval(async () => {
        pollCount++;
        if (pollCount > maxPolls) {
          clearInterval(id);
          setPollingId(null);
          return;
        }
        try {
          const res = await apiFetch(`/api/store-claims/${existingClaim.id}`);
          if (res.ok) {
            const data = await res.json();
            setExistingClaim(data);
            if (data.status === "ready" || data.status === "claimed" || data.status === "failed") {
              clearInterval(id);
              setPollingId(null);
            }
          }
        } catch {}
      }, 3000);
      setPollingId(id);
      return () => clearInterval(id);
    }
  }, [existingClaim?.id, existingClaim?.status]);

  const handleSubmit = async () => {
    const name = storeName.trim();
    if (name.length < 2) {
      setStoreNameError("Store name must be at least 2 characters");
      return;
    }
    if (name.length > 60) {
      setStoreNameError("Store name must be 60 characters or less");
      return;
    }
    setStoreNameError("");
    setSubmitting(true);

    try {
      const res = await apiFetch("/api/store-claims", {
        method: "POST",
        body: JSON.stringify({ store_name: name, niche: "electronics" }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409 && err.existing_claim_id) {
          showError("You already have a store claim in progress");
          await fetchExistingClaims();
          return;
        }
        throw new Error(err.error || "Failed to submit claim");
      }

      const claim = await res.json();
      setExistingClaim(claim);
      setStep(3);
      showSuccess("Your store is being prepared!");
    } catch (err: any) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimStore = async () => {
    if (!existingClaim) return;
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/store-claims/${existingClaim.id}/claim`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to claim store");
      }
      const data = await res.json();
      setExistingClaim(data);
      showSuccess("Store claimed successfully! You can now access your Shopify store.");
    } catch (err: any) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = async () => {
    if (!existingClaim) return;
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/store-claims/${existingClaim.id}/retry`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to retry");
      }
      setExistingClaim({ ...existingClaim, status: "pending", notes: null });
      showSuccess("Retrying store build...");
    } catch (err: any) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <BlueSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-white border border-gray-200 max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-gray-600">Failed to load your store claims. Please try again.</p>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => { setLoading(true); fetchExistingClaims(); }}
              data-testid="button-retry-load"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {step > 0 && step < 3 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step < 3 && <StepIndicator current={step} />}

        {step === 0 && <PlanStep onContinue={() => setStep(1)} />}
        {step === 1 && (
          <StoreDetailsStep
            storeName={storeName}
            setStoreName={setStoreName}
            error={storeNameError}
            onContinue={() => {
              const name = storeName.trim();
              if (name.length < 2) {
                setStoreNameError("Store name must be at least 2 characters");
                return;
              }
              if (name.length > 60) {
                setStoreNameError("Store name must be 60 characters or less");
                return;
              }
              setStoreNameError("");
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <ReviewStep
            storeName={storeName}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}
        {step === 3 && existingClaim && (
          <StatusStep
            claim={existingClaim}
            submitting={submitting}
            onClaim={handleClaimStore}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  const steps = ["Choose Plan", "Store Details", "Review & Confirm"];
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                i < current
                  ? "bg-green-500 text-white"
                  : i === current
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              data-testid={`step-indicator-${i}`}
            >
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-sm font-medium hidden sm:inline ${
                i === current ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-8 sm:w-16 h-px bg-gray-300 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function PlanStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Get your ready-made Shopify store
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          A completely pre-built store with winning products to kickstart your dropshipping business. One-time setup, no hidden costs.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          <Card className="border-2 border-blue-500 bg-white relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-gray-500">Premium Shopify Store</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">$49</span>
                    <span className="text-sm text-gray-400 line-through">$1,000+</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                A completely pre-built store for a quick launch to start earning.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 opacity-60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-400">Fully custom Shopify store</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-gray-400">$2,995</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Laptop className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Badge variant="secondary" className="mt-3 text-xs">Coming Soon</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-gradient-to-b from-green-50 to-white border border-green-200 sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-gray-900 text-sm">Premium Shopify Store</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>Estimated delivery: <strong className="text-gray-700">within 24 hours</strong></span>
              </div>

              <div className="border-t border-green-200 pt-4 space-y-2.5">
                <PriceLine label="Standalone Store" price="$49" original="" />
                <PriceLine label="20 Curated Products" price="$0" original="$197" free />
                <PriceLine label="Store Optimization" price="$0" original="$249" free />
                <PriceLine label="Mobile Optimization" price="$0" original="$249" free />
                <PriceLine label="Store Review" price="$0" original="$149" free />
              </div>

              <div className="border-t border-green-200 pt-4 flex items-center justify-between">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="text-2xl font-bold text-gray-900">$49</span>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11"
                onClick={onContinue}
                data-testid="button-continue-plan"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          30-day money-back guarantee
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap className="h-4 w-4 text-blue-500" />
          Delivery within 24 hours
        </div>
      </div>

      <HowItWorks />
      <ProductPreview />
    </div>
  );
}

function PriceLine({
  label,
  price,
  original,
  free,
}: {
  label: string;
  price: string;
  original: string;
  free?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        {original && (
          <span className="text-gray-400 line-through text-xs">{original}</span>
        )}
        <span className={free ? "text-green-600 font-semibold" : "font-semibold text-gray-900"}>
          {free ? "FREE" : price}
        </span>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Store,
      title: "You choose your store",
      desc: "Simple setup — pick your store name and niche.",
    },
    {
      icon: Palette,
      title: "Your store is being built",
      desc: "USDrop designs and builds a premium store for you.",
    },
    {
      icon: Package,
      title: "Products are added",
      desc: "20 curated electronics products, ready to sell.",
    },
    {
      icon: CheckCircle2,
      title: "Your store is ready",
      desc: "You receive full access to your personal store.",
    },
  ];

  return (
    <div className="space-y-6 pt-4">
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          How it works
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          Receive your done-for-you store in under 24 hours
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <Card key={i} className="bg-white border border-gray-200">
            <CardContent className="p-5 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-500">Step {i + 1}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{s.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="space-y-6 pt-4">
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          What you get
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          20 curated electronics products included
        </h2>
        <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
          Pre-configured product pages with descriptions, images, and competitive pricing. Ready to sell from day one.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {ELECTRONICS_PRODUCTS.map((name, i) => (
          <Card key={i} className="bg-white border border-gray-200">
            <CardContent className="p-3 space-y-2">
              <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{name}</p>
              <p className="text-xs text-gray-400">
                ${(14.99 + i * 2.5).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StoreDetailsStep({
  storeName,
  setStoreName,
  error,
  onContinue,
}: {
  storeName: string;
  setStoreName: (v: string) => void;
  error: string;
  onContinue: () => void;
}) {
  const slug = storeName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Name your store</h1>
        <p className="text-gray-500">
          Choose a name for your Shopify store. You can always change it later.
        </p>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Store Name</label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. TechVault, GadgetZone, ElectroHub"
              className="h-12 text-base"
              data-testid="input-store-name"
              maxLength={60}
            />
            {error && (
              <p className="text-sm text-red-500" data-testid="text-store-name-error">
                {error}
              </p>
            )}
            {slug && (
              <p className="text-xs text-gray-400">
                Your store URL: <span className="font-mono text-gray-500">{slug}.myshopify.com</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Niche</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Electronics & Gadgets</span>
              <Badge className="ml-auto bg-blue-500 text-white text-[10px]">Pre-selected</Badge>
            </div>
            <p className="text-xs text-gray-400">
              Your store will be loaded with 20 trending electronics products.
            </p>
          </div>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11"
            onClick={onContinue}
            disabled={!storeName.trim()}
            data-testid="button-continue-details"
          >
            Continue to Review
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewStep({
  storeName,
  submitting,
  onSubmit,
}: {
  storeName: string;
  submitting: boolean;
  onSubmit: () => void;
}) {
  const slug = storeName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Review your order</h1>
        <p className="text-gray-500">Confirm your store details before we start building.</p>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Store Name</p>
              <p className="font-semibold text-gray-900" data-testid="text-review-store-name">{storeName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Store URL</p>
              <p className="font-mono text-sm text-gray-700" data-testid="text-review-store-url">{slug}.myshopify.com</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Niche</p>
              <p className="font-semibold text-gray-900">Electronics & Gadgets</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Products</p>
              <p className="font-semibold text-gray-900">20 curated products</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">What's included:</h3>
            {[
              "Done-for-you Shopify store with Dawn theme",
              "20 trending electronics products with images & descriptions",
              "Mobile-optimized responsive design",
              "Professional store layout & branding",
              "Ready for fulfillment integration",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-2xl font-bold text-gray-900">$49</span>
          </div>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base"
            onClick={onSubmit}
            disabled={submitting}
            data-testid="button-confirm-order"
          >
            {submitting ? (
              <>
                <BlueSpinner className="h-4 w-4 mr-2" />
                Processing...
              </>
            ) : (
              <>
                Confirm & Build My Store
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            30-day money-back guarantee
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusStep({
  claim,
  submitting,
  onClaim,
  onRetry,
}: {
  claim: StoreClaim;
  submitting: boolean;
  onClaim: () => void;
  onRetry: () => void;
}) {
  const isReady = claim.status === "ready";
  const isClaimed = claim.status === "claimed";
  const isFailed = claim.status === "failed";
  const isProcessing = claim.status === "pending" || claim.status === "processing";

  const progressSteps = [
    { label: "Order received", done: true },
    { label: "Template applied", done: claim.template_applied },
    { label: "Products added", done: claim.products_count > 0 },
    { label: "Store ready", done: isReady || isClaimed },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        {isFailed ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Store build failed</h1>
            <p className="text-gray-500">
              Something went wrong while building "{claim.store_name}". You can retry or contact support.
            </p>
          </>
        ) : isClaimed ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your store is live!</h1>
            <p className="text-gray-500">
              Congratulations! Your Shopify store "{claim.store_name}" is ready and claimed.
            </p>
          </>
        ) : isReady ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                <Store className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your store is ready!</h1>
            <p className="text-gray-500">
              Your Shopify store "{claim.store_name}" has been built and is waiting for you.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center">
                <BlueSpinner className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Building your store...</h1>
            <p className="text-gray-500">
              We're setting up "{claim.store_name}" for you. This usually takes a few moments.
            </p>
          </>
        )}
      </div>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            {progressSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    s.done
                      ? "bg-green-500 text-white"
                      : isProcessing && i === progressSteps.findIndex((x) => !x.done)
                      ? "bg-blue-100 text-blue-500 animate-pulse"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s.done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-semibold">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    s.done ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
                {s.done && (
                  <Check className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </div>
            ))}
          </div>

          {(isReady || isClaimed) && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Store Name</p>
                  <p className="font-semibold text-gray-900">{claim.store_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Products</p>
                  <p className="font-semibold text-gray-900">{claim.products_count} products</p>
                </div>
                {claim.shopify_store_url && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Store URL</p>
                    <a
                      href={claim.shopify_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
                      data-testid="link-store-url"
                    >
                      {claim.shopify_store_url.replace("https://", "")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {claim.notes && (
                <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-xs text-blue-700">{claim.notes}</p>
                </div>
              )}
            </div>
          )}

          {isFailed && (
            <div className="space-y-3">
              {claim.notes && (
                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-xs text-red-700 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {claim.notes}
                  </p>
                </div>
              )}
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base"
                onClick={onRetry}
                disabled={submitting}
                data-testid="button-retry-build"
              >
                {submitting ? (
                  <>
                    <BlueSpinner className="h-4 w-4 mr-2" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Retry Store Build
                  </>
                )}
              </Button>
            </div>
          )}

          {isReady && (
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base"
              onClick={onClaim}
              disabled={submitting}
              data-testid="button-claim-store"
            >
              {submitting ? (
                <>
                  <BlueSpinner className="h-4 w-4 mr-2" />
                  Claiming...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Claim Your Store
                </>
              )}
            </Button>
          )}

          {isClaimed && claim.shopify_admin_url && (
            <a
              href={claim.shopify_admin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-base font-medium transition-colors"
              data-testid="link-shopify-admin"
            >
              Open Shopify Admin
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {isClaimed && (
            <div className="text-center">
              <Link
                href="/framework/my-store"
                className="text-sm text-blue-500 hover:text-blue-600"
                data-testid="link-go-to-my-store"
              >
                Go to My Store
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
