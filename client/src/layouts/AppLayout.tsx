import { AppTopNavigation } from "@/components/layout/app-top-navigation";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { Toaster } from "@/components/ui/toast";
import { VerifyEmailBanner } from "@/components/feedback/banners/verify-email-banner";
import { ContactTeamButton } from "@/components/ui/contact-team-button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f3f8fc 0%, #edf5fa 25%, #f0f6fb 50%, #eef5fa 75%, #f4f9fd 100%)',
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
    </div>
  );
}
