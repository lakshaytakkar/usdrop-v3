import { Header } from "@/pages/(marketing)/components/Header";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#F4F2F1]">
      <div className="absolute top-[32px] left-0 right-0 z-50">
        <Header />
      </div>
      <main>{children}</main>
    </div>
  );
}
