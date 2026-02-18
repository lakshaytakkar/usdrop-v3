import { Header } from "@/pages/(marketing)/components/Header";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
