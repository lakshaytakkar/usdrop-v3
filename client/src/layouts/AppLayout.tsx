import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Toaster } from "@/components/ui/toast";
import { VerifyEmailBanner } from "@/components/feedback/banners/verify-email-banner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <VerifyEmailBanner />
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-2 bg-gray-50/50">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
