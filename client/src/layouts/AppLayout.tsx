import { AppTopNavigation } from "@/components/layout/app-top-navigation";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { Toaster } from "@/components/ui/toast";
import { VerifyEmailBanner } from "@/components/feedback/banners/verify-email-banner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #e8f4fd 0%, #dbeef9 20%, #c8e6f5 40%, #b8ddf0 60%, #d4ecf7 80%, #eaf5fc 100%)',
      }}
    >
      <VerifyEmailBanner />
      <AppTopNavigation />
      <SubNavTabs />
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
