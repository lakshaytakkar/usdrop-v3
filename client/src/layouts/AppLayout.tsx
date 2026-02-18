import { AppTopNavigation } from "@/components/layout/app-top-navigation";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { Toaster } from "@/components/ui/toast";
import { VerifyEmailBanner } from "@/components/feedback/banners/verify-email-banner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <VerifyEmailBanner />
      <AppTopNavigation />
      <SubNavTabs />
      <main className="flex-1 p-2">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
