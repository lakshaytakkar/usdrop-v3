import type { Metadata } from "next";
import { Header } from "./components/Header";

export const metadata: Metadata = {
  title: "USDrop AI - World's #1 All-in-One AI Dropshipping Platform",
  description: "Find winners, create content, ship products—in minutes. AI-powered dropshipping platform that discovers profitable products, generates visuals, and handles fulfillment.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <main>{children}</main>
    </div>
  );
}


