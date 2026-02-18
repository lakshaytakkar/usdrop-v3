"use client"

import { ExternalLayout } from '@/components/layout/external-layout';
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, RefreshCw, PackageCheck, BarChart3 } from "lucide-react"
import Link from "next/link"

function ShopifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 256 292" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      preserveAspectRatio="xMidYMid"
    >
      <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/>
      <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357" fill="#5E8E3E"/>
      <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/>
    </svg>
  );
}

export default function ShopifyIntegrationPage() {
  return (
    <ExternalLayout>
      <div className="flex flex-1 flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white" />
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
              <ShopifyIcon className="w-5 h-5" />
              <span className="text-sm font-semibold text-slate-700">Official Shopify Integration</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto">
              Connect USDrop to Your <br/>
              <span className="text-[#95BF46]">Shopify Store</span> in Minutes
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Seamlessly sync products, inventory, and orders. Let USDrop handle the backend while you focus on growing your store.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/#trial">
                <Button size="lg" className="bg-[#95BF46] hover:bg-[#7ea33a] text-white h-12 px-8 font-semibold shadow-xl shadow-green-600/10">
                  Connect Store Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual / Screenshot */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6 relative z-10 mt-16">
            <div className="max-w-5xl mx-auto relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#95BF46] rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
              
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
                {/* Mockup UI of connection screen */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-white px-3 py-1 rounded text-xs text-slate-400 inline-block w-64">app.usdrop.com/connect-store</div>
                  </div>
                </div>
                <div className="p-8 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 aspect-[16/9]">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                      <ShopifyIcon className="w-8 h-8" />
                    </div>
                    <p className="text-slate-400 font-medium">Store Connection Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Sync</h3>
                <p className="text-slate-600 leading-relaxed">
                  Inventory levels and prices update automatically. Never oversell products again.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Auto-Fulfillment</h3>
                <p className="text-slate-600 leading-relaxed">
                  Orders are sent to our warehouse instantly. Tracking numbers are written back to Shopify.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Profit Dashboard</h3>
                <p className="text-slate-600 leading-relaxed">
                  See your true profit margins per product after shipping and ad costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Steps */}
        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Getting Started is Easy</h2>
              <p className="text-slate-600">No coding required. Be up and running in 2 minutes.</p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">1</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">Install USDrop App</h3>
                  <p className="text-slate-600">Search for USDrop in the Shopify App Store and click "Install".</p>
                </div>
                <Button variant="ghost" className="hidden sm:flex" disabled>View in App Store</Button>
              </div>
              
              <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">2</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">Import Products</h3>
                  <p className="text-slate-600">Browse our catalog of 50M+ items and click "Add to Store".</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">3</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">Start Selling</h3>
                  <p className="text-slate-600">Launch your ads. We handle the rest automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mid-page CTA */}
        <section className="py-24 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6">
            <div className="bg-[#008060] rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-3 rounded-xl">
                    <ShopifyIcon className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-6">Ready to automate your Shopify store?</h2>
                <p className="text-green-100 text-lg mb-8">
                  Join the #1 dropshipping platform for Shopify merchants.
                </p>
                <Link href="/#trial">
                  <Button size="lg" className="bg-white text-[#008060] hover:bg-green-50 font-bold h-12 px-8">
                    Install App for Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </ExternalLayout>
  )
}










