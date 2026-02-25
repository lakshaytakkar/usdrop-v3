import { useState, useEffect } from "react";
import { Monitor, X } from "lucide-react";

export function MobileDesktopBanner() {
  const [dismissed, setDismissed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("desktop-banner-dismissed");
    setDismissed(!!wasDismissed);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] bg-[#1a1a2e] text-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      data-testid="banner-mobile-desktop"
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <Monitor className="h-5 w-5 text-blue-400 flex-shrink-0" />
        <p className="text-[13px] leading-snug flex-1">
          For the best experience, open <span className="font-semibold">USDrop AI</span> on your PC or laptop
        </p>
        <button
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem("desktop-banner-dismissed", "1");
          }}
          className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
          data-testid="button-dismiss-desktop-banner"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
