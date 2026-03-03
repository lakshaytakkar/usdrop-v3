import { AdminTopNavigation } from "@/components/layout/admin-top-navigation";
import { Toaster } from "@/components/ui/toast";
import { VerifyEmailBanner } from "@/components/feedback/banners/verify-email-banner";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#F5F5F7' }}>
      <VerifyEmailBanner />
      <AdminTopNavigation />
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
