"use client"

import { Header } from '@/components/landing-deprecated/Header';
import { Footer } from '@/components/landing-deprecated/Footer';
import { Container, GeneratedImage } from '@/components/landing-deprecated/ui';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, Truck, ArrowRight, Percent, PieChart, Target } from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
          <Container className="relative z-10 text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 px-4 py-1 text-sm">
              Free Dropshipping Tools
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Calculate Your Profit <br/>
              <span className="text-orange-600">Before You Spend a Dime</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Use our free calculators to estimate shipping costs, profit margins, and ROAS. De-risk your business decisions today.
            </p>
          </Container>
        </section>

        {/* Tools Grid */}
        <section className="py-12 bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Shipping Calculator */}
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                    <Truck className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Shipping Calculator</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Get instant shipping estimates for any product weight and destination. Compare shipping lines and delivery times.
                  </p>
                  <Link href="/shipping-calculator">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full h-12 font-semibold">
                      Calculate Shipping <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Profit Calculator */}
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-green-300 transition-all hover:shadow-lg bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                    <Calculator className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Profit Calculator</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Input your product cost, selling price, and ad spend to see your real net profit. Don't sell blindly.
                  </p>
                  <Link href="/tools/profit-calculator">
                    <Button className="bg-green-600 text-white hover:bg-green-700 w-full h-12 font-semibold">
                      Calculate Profit <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Coming Soon Tools */}
        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900">Coming Soon</h2>
              <p className="text-slate-600">We are constantly building new tools to help you succeed.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-xl bg-white border border-slate-200 opacity-75">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">ROAS Calculator</h3>
                </div>
                <p className="text-sm text-slate-600">Determine your break-even ROAS before launching ads.</p>
              </div>
              
              <div className="p-6 rounded-xl bg-white border border-slate-200 opacity-75">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                    <Percent className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">CPA Calculator</h3>
                </div>
                <p className="text-sm text-slate-600">Calculate your maximum cost per acquisition per product.</p>
              </div>
              
              <div className="p-6 rounded-xl bg-white border border-slate-200 opacity-75">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">Interest Explorer</h3>
                </div>
                <p className="text-sm text-slate-600">Find hidden Facebook interests that your competitors miss.</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Mid-page CTA */}
        <section className="py-24 bg-white">
          <Container>
            <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('/grid.svg')]"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Save your calculations?</h2>
                <p className="text-slate-300 text-lg mb-8">
                  Create a free account to save your profit scenarios and shipping estimates for later.
                </p>
                <Link href="/#trial">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 px-8">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

      </main>

      <Footer />
    </div>
  )
}










