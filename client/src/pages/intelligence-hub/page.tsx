

import { Header } from '@/components/landing-deprecated/Header';
import { Footer } from '@/components/landing-deprecated/Footer';
import { Container, GeneratedImage } from '@/components/landing-deprecated/ui';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/pages/blogs/components/article-card"
import { sampleArticles } from "@/pages/blogs/data/articles"
import { ArrowRight, TrendingUp, Target, Zap } from "lucide-react"
import { Link } from "wouter"

export default function IntelligenceHubPage() {
  const featuredArticle = sampleArticles.find(a => a.featured) || sampleArticles[0];
  const recentArticles = sampleArticles.filter(a => a.id !== featuredArticle.id);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
          
          <Container className="relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 px-4 py-1 text-sm">
                USDrop Intelligence
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                Master the Art of <br />
                <span className="text-blue-600">Profitable Dropshipping</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Expert insights, winning product breakdowns, and scaling strategies from 7-figure store owners.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 rounded-full">
                  Read Latest Insights
                </Button>
                <Link href="/#trial">
                  <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>

            {/* Featured Article Slab */}
            <div className="mt-16">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <GeneratedImage 
                      prompt="futuristic ecommerce analytics dashboard glowing on a desk, cinematic lighting, blue and purple tones" 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-blue-600 text-white border-none">
                        Featured
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <span className="font-semibold text-blue-600">{featuredArticle.category}</span>
                      <span>•</span>
                      <span>{featuredArticle.readTime} min read</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                           {/* Placeholder avatar since actual image might not load without next/image setup for external domains */}
                           <div className="w-full h-full bg-slate-300" />
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-slate-900">{featuredArticle.author}</p>
                          <p className="text-slate-500">{new Date(featuredArticle.publishedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:translate-x-1 transition-all">
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Categories / Playbooks */}
        <section className="py-12 bg-white border-b border-slate-100">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Product Research</h3>
                  <p className="text-sm text-slate-600">Find winners before they saturate.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors group cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Marketing Strategy</h3>
                  <p className="text-sm text-slate-600">Scale ads profitably on Meta & TikTok.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 transition-colors group cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Store Optimization</h3>
                  <p className="text-sm text-slate-600">Boost conversion rates & AOV.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Recent Articles Grid */}
        <section className="py-16 bg-white">
          <Container>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Recent Insights</h2>
              <Button variant="outline">View All Articles</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <div key={article.id} className="h-[420px]"> {/* Fixed height container for consistency */}
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Mid-page CTA */}
        <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <Container className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to apply these strategies?</h2>
                <p className="text-slate-300 text-lg mb-8">
                  Get access to the same tools 7-figure dropshippers use to find products and scale ads.
                </p>
                <Link href="/#trial">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 px-8">
                    Start Your 7-Day Free Trial
                  </Button>
                </Link>
              </div>
              <div className="w-full md:w-auto flex justify-center">
                 {/* Abstract visual */}
                 <div className="w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              </div>
            </div>
          </Container>
        </section>

      </main>

      <Footer />
    </div>
  );
}










