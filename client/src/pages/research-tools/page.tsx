

import { Header } from '@/components/landing-deprecated/Header';
import { Footer } from '@/components/landing-deprecated/Footer';
import { Container, GeneratedImage } from '@/components/landing-deprecated/ui';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, LineChart, Eye, Globe, ShoppingBag, ArrowRight, TrendingUp } from "lucide-react"
import { Link } from "wouter"

export default function ResearchToolsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-white" />
          <Container className="relative z-10 text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200 px-4 py-1 text-sm">
              USDrop Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Find Winning Products <br/>
              <span className="text-indigo-600">Before They Go Viral</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop guessing. Use real-time data to spy on competitors, track sales trends, and uncover high-margin opportunities in seconds.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/#trial">
                <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 h-12 px-8 font-semibold shadow-xl shadow-indigo-600/20">
                  Start Researching
                </Button>
              </Link>
            </div>
          </Container>

          {/* Hero Visual */}
          <Container className="relative z-10 mt-16">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white aspect-[16/9] max-w-5xl mx-auto">
              <GeneratedImage 
                prompt="dashboard interface showing product analytics graph going up, heatmap of sales, and competitor store data, sophisticated dark mode ui"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
            </div>
          </Container>
        </section>

        {/* Tools Grid */}
        <section className="py-20 bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product Database */}
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors bg-white">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">50M+ Product Database</h3>
                <p className="text-slate-600 mb-6">
                  Search by niche, price, or trend. Filter for US-shippable items only.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 mb-6">
                  <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" /> Historical sales data</li>
                  <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Global supplier network</li>
                </ul>
              </div>

              {/* Competitor Spy */}
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors bg-white">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Competitor Spy</h3>
                <p className="text-slate-600 mb-6">
                  Enter any Shopify URL to see their bestsellers, traffic sources, and estimated revenue.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 mb-6">
                  <li className="flex items-center gap-2"><Search className="h-4 w-4 text-purple-500" /> Reverse engineer ads</li>
                  <li className="flex items-center gap-2"><LineChart className="h-4 w-4 text-purple-500" /> Revenue estimates</li>
                </ul>
              </div>

              {/* Ad Library */}
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors bg-white">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Ad Intelligence</h3>
                <p className="text-slate-600 mb-6">
                  See what ads are running right now on Facebook, TikTok, and Pinterest.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 mb-6">
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-blue-500" /> Download active creatives</li>
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-blue-500" /> Copy winning hooks</li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Demo / Steps */}
        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  Live Walkthrough
                </Badge>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Reverse Engineer Any Store</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-sm">1</div>
                    <p className="text-slate-600 pt-1">Find a store selling products in your niche.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-sm">2</div>
                    <p className="text-slate-600 pt-1">Paste the URL into USDrop Store Research.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-sm">3</div>
                    <p className="text-slate-600 pt-1">Instantly see their revenue, top products, and active ads.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">4</div>
                    <p className="text-slate-900 font-medium pt-1">Add their winning products to your store in one click.</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/store-research">
                    <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                      Try Store Research Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                 <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-3xl"></div>
                 <GeneratedImage 
                   prompt="ui design of a competitor store analyzer tool showing revenue graphs and product lists, clean modern interface"
                   className="relative rounded-xl shadow-xl border border-slate-200 bg-white w-full"
                 />
              </div>
            </div>
          </Container>
        </section>

        {/* Stats Strip */}
        <section className="py-16 bg-white border-b border-slate-100">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">50M+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Products Tracked</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">120+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Countries</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">10M+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Ads Analyzed</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">24/7</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Real-time Updates</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Mid-page CTA */}
        <section className="py-24 bg-white">
          <Container>
            <div className="bg-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('/grid.svg')]"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Stop selling saturated products</h2>
                <p className="text-indigo-200 text-lg mb-8">
                  Get access to the data that gives you an unfair advantage.
                </p>
                <Link href="/#trial">
                  <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold h-12 px-8">
                    Start 7-Day Free Trial
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










