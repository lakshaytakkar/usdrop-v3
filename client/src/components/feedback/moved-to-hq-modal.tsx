import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

/* HARD retirement notice for the USDrop admin (2026-07-15).

   Blurs the admin behind a centred modal on every /admin/* route and sends
   staff to the USDrop space in Suprans HQ (team.suprans.in/usdrop), which is
   now the place to work clients, leads, catalogue, content and account control
   (reset password / force logout / suspend all run from there).

   Why there is still a way past it: the portal does NOT yet cover everything
   here — creating or deleting a user, creating or deleting a product, editing
   categories / suppliers / competitor stores, Shopify stores, per-user content
   grants, the LLC tracker, batches and mentorship sessions exist ONLY in this
   console. A modal with no escape would strand that work with no route to it.
   So the notice is unmissable and the portal is the default, but staff can
   deliberately continue for the un-migrated tools.

   The escape is per-tab (sessionStorage): it comes back next session, so the
   notice can't be dismissed once and forgotten. When the remaining tools land
   in the portal, delete this component and its use in AdminLayout — and at that
   point the admin can be removed outright rather than notice-gated. */

const HQ_USDROP_URL = "https://team.suprans.in/usdrop";
const ACK_KEY = "usdrop_admin_moved_ack";

const MOVED = [
  "Clients & leads — search, 360 view, notes, follow-ups",
  "Account control — reset password, force logout, suspend, credits, plan",
  "Catalogue & content — products, courses, roadmap, CRO, articles",
  "Communications — email & SMS templates, automations, logs",
];

export function MovedToHqModal() {
  const [ack, setAck] = useState<boolean>(() => {
    try { return sessionStorage.getItem(ACK_KEY) === "1"; } catch { return false; }
  });

  if (ack) return null;

  const stay = () => {
    try { sessionStorage.setItem(ACK_KEY, "1"); } catch { /* private mode — notice just stays */ }
    setAck(true);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="moved-title"
      data-testid="modal-moved-to-hq"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div
        className="bg-background text-foreground"
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 16,
          padding: "28px 28px 24px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
          border: "1px solid rgba(148,163,184,0.28)",
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
          <Info className="h-5 w-5 text-blue-600" />
        </div>

        <h2 id="moved-title" className="mt-4 text-xl font-semibold tracking-tight">
          USDrop admin has moved to Suprans HQ
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Day-to-day USDrop work now happens in your own portal at{" "}
          <span className="font-medium text-foreground">team.suprans.in/usdrop</span> — the same
          live data, with your Suprans HQ sign-in. Please work there from now on.
        </p>

        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          {MOVED.map((m) => (
            <li key={m} className="flex gap-2">
              <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-blue-600" />
              <span>{m}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="gap-1.5" data-testid="button-open-hq">
            <a href={HQ_USDROP_URL}>
              Open the USDrop portal
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="lg" onClick={stay} data-testid="button-stay-here">
            Continue in the old admin
          </Button>
        </div>

        <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
          A few tools haven&apos;t moved across yet — creating or deleting users and products,
          categories, suppliers, competitor stores, Shopify stores, content grants, the LLC tracker
          and batches. Use this console for those; everything else belongs in the portal.
        </p>
      </div>
    </div>,
    document.body,
  );
}
