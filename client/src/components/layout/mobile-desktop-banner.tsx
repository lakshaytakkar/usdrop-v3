import { useState, useEffect } from "react";
import { Monitor } from "lucide-react";

/**
 * Hard desktop-only gate for the logged-in platform (owner decision,
 * 2026-07-16 — upgraded from a dismissible bottom banner).
 *
 * On screens under 768px the platform is fully blocked with "use your laptop
 * or PC" — no dismiss, no sessionStorage escape hatch. USDrop is sold and
 * demoed as a desktop product; a phone view of it undercuts the demo call and
 * produces support tickets no one can win. Marketing pages are NOT gated —
 * this component only mounts inside AppLayout (the platform shell).
 *
 * Kept the original filename/export so the AppLayout mount point is unchanged.
 */
export function MobileDesktopBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-[#1a1a2e] text-white flex items-center justify-center px-6"
      data-testid="gate-mobile-desktop"
      role="dialog"
      aria-modal="true"
      aria-label="USDrop AI is desktop-only"
    >
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Monitor className="h-8 w-8 text-blue-400" />
        </div>
        <h1 className="text-xl font-bold leading-snug">
          Please use USDrop AI on your laptop or PC
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-white/70">
          The platform is built for a big screen — research tables, store
          builders and ad tools don&apos;t fit on a phone. Open{" "}
          <span className="font-semibold text-white">usdrop.ai</span> on your
          computer to continue.
        </p>
      </div>
    </div>
  );
}
