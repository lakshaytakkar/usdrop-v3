import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 15000);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-16 left-4 right-4 md:left-auto md:right-6 md:w-[360px] z-[101] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-bottom-4 duration-300"
      data-testid="prompt-pwa-install"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Download className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900">Install USDrop AI</h4>
          <p className="text-xs text-gray-500 mt-0.5">Add to your home screen for quick access</p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          data-testid="button-dismiss-pwa-install"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleDismiss}
          className="flex-1 text-sm py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
          data-testid="button-not-now-pwa"
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 text-sm py-2 px-3 rounded-lg bg-[#1a1a2e] text-white hover:bg-[#2a2a3e] transition-colors font-medium"
          data-testid="button-install-pwa"
        >
          Install
        </button>
      </div>
    </div>
  );
}
