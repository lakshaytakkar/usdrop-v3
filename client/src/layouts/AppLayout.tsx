import { AppTopNavigation } from "@/components/layout/app-top-navigation";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { Toaster } from "@/components/ui/toast";
import { VerifyEmailBanner } from "@/components/feedback/banners/verify-email-banner";
import { ContactTeamButton } from "@/components/ui/contact-team-button";
import { MobileDesktopBanner } from "@/components/layout/mobile-desktop-banner";
import { PwaInstallPrompt } from "@/components/layout/pwa-install-prompt";

export function AppLayout({ children }: { children: React.ReactNode }) {
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
