

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Truck, Package, Clock, Globe, ArrowRight, XCircle } from "lucide-react"
import { Link } from "wouter"
export default function FulfillmentPage() {
  return (
    <>
      <div className="flex flex-1 flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 px-4 py-1 text-sm">
                  USDrop AI Fulfillment
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  2-5 Day US Shipping <br/>
                  <span className="text-blue-600">Without Inventory</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Stop waiting 3 weeks for AliExpress orders. Ship directly from our US warehouses and keep your customers happy with fast, reliable delivery.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/#trial">
                    <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 font-semibold shadow-lg shadow-blue-600/20">
                      Start Shipping
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-slate-500 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>No minimum order quantity</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-2xl"></div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
                   <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center">
                     <div className="text-center">
                       <Package className="h-16 w-16 text-blue-300 mx-auto mb-3" />
                       <p className="text-blue-400 font-medium">US Warehouse Fulfillment</p>
                     </div>
                   </div>
                   
                   {/* Floating Stats Card */}
                   <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl border border-white shadow-lg">
                     <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                         <div className="bg-green-100 p-2 rounded-lg text-green-600">
                           <Truck className="h-6 w-6" />
                         </div>
                         <div>
                           <p className="text-xs text-slate-500 font-medium uppercase">Avg. Delivery</p>
                           <p className="text-lg font-bold text-slate-900">3.2 Days</p>
                         </div>
                       </div>
                       <div className="h-8 w-px bg-slate-200"></div>
                       <div className="flex items-center gap-3">
                         <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                           <Package className="h-6 w-6" />
                         </div>
                         <div>
                           <p className="text-xs text-slate-500 font-medium uppercase">Order Accuracy</p>
                           <p className="text-lg font-bold text-slate-900">99.9%</p>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="py-20 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How USDrop Fulfillment Works</h2>
              <p className="text-slate-600">We handle the logistics so you can focus on marketing.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop only) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-200 to-blue-200 z-0"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-blue-50 flex items-center justify-center mb-6 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <Store className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">1. Connect Store</h3>
                <p className="text-slate-600 text-sm">Link your Shopify store in one click. Products sync automatically.</p>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-blue-50 flex items-center justify-center mb-6 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <Package className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">2. Customer Orders</h3>
                <p className="text-slate-600 text-sm">Orders are automatically forwarded to our US warehouse system.</p>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-blue-50 flex items-center justify-center mb-6 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <Truck className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">3. We Ship Fast</h3>
                <p className="text-slate-600 text-sm">We pick, pack, and ship from the US. Tracking updates instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">USDrop vs. The Old Way</h2>
              <p className="text-slate-600">Why top dropshippers are switching to US fulfillment.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="grid grid-cols-3 bg-slate-900 text-white p-6 text-sm font-bold uppercase tracking-wider">
                <div>Feature</div>
                <div className="text-center">AliExpress / China</div>
                <div className="text-center text-blue-400">USDrop AI Fulfillment</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-3 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-slate-700">Shipping Time</div>
                  <div className="text-center text-red-500 flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" /> 15-45 Days
                  </div>
                  <div className="text-center text-green-600 font-bold flex items-center justify-center gap-2 bg-green-50 py-1 rounded-full mx-auto w-fit px-4">
                    <Clock className="h-4 w-4" /> 2-5 Days
                  </div>
                </div>
                
                <div className="grid grid-cols-3 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-slate-700">Product Quality</div>
                  <div className="text-center text-slate-500">Inconsistent</div>
                  <div className="text-center text-blue-600 font-bold">Verified & Inspected</div>
                </div>
                
                <div className="grid grid-cols-3 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-slate-700">Tracking Updates</div>
                  <div className="text-center text-slate-500">Delayed / Fake</div>
                  <div className="text-center text-blue-600 font-bold">Real-time USPS/UPS</div>
                </div>

                <div className="grid grid-cols-3 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-slate-700">Packaging</div>
                  <div className="text-center text-slate-500">Cheap Plastic Bag</div>
                  <div className="text-center text-blue-600 font-bold">Professional Box</div>
                </div>

                <div className="grid grid-cols-3 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-slate-700">Returns</div>
                  <div className="text-center text-red-500 flex items-center justify-center gap-2">
                     <XCircle className="h-4 w-4" /> Impossible
                  </div>
                  <div className="text-center text-green-600 font-bold flex items-center justify-center gap-2">
                     <CheckCircle2 className="h-4 w-4" /> Easy US Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mid-page CTA */}
        <section className="py-20 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6">
            <div className="bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/grid.svg')]"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Ready to scale with faster shipping?</h2>
                <p className="text-blue-100 text-lg mb-8">
                  Join 8,000+ merchants shipping from the US. No credit card required to start.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/#trial">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold h-12 px-8">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

function Store({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      height="24" 
      stroke="currentColor" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      viewBox="0 0 24 24" 
      width="24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  )
}










