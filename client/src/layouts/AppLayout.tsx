import { useEffect } from "react";
import { useLocation } from "wouter";
import { AppTopNavigation } from "@/components/layout/app-top-navigation";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { Toaster } from "@/components/ui/toast";
import { VerifyEmailBanner } from "@/components/feedback/banners/verify-email-banner";
import { ContactTeamButton } from "@/components/ui/contact-team-button";
import { MobileDesktopBanner } from "@/components/layout/mobile-desktop-banner";
import { PwaInstallPrompt } from "@/components/layout/pwa-install-prompt";
import { trackActivity } from "@/lib/activity-tracker";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    trackActivity('page_view', { path: location });
  }, [location]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#F5F5F7',
      }}
    >
      <VerifyEmailBanner />
      <AppTopNavigation />
      <SubNavTabs />
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
      <ContactTeamButton />
      <MobileDesktopBanner />
      <PwaInstallPrompt />
    </div>
  );
}
