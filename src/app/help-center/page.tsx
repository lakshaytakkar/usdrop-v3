"use client"

import { useState, useMemo } from "react"
import { Header } from '@/components/landing-deprecated/Header';
import { Footer } from '@/components/landing-deprecated/Footer';
import { Container } from '@/components/landing-deprecated/ui';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, FileText, MessageCircle, BookOpen } from "lucide-react"
import { categoryCards, faqs } from "@/components/help-center/help-content-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqs

    const query = searchQuery.toLowerCase()
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }, [searchQuery])

  const sortedFAQs = useMemo(() => {
    const sorted = [...filteredFAQs]
    sorted.sort((a, b) => {
      if (a.category === "General" && b.category !== "General") return -1
      if (a.category !== "General" && b.category === "General") return 1
      return a.category.localeCompare(b.category)
    })
    return sorted
  }, [filteredFAQs])

  const filteredCategoryCards = useMemo(() => {
    if (!searchQuery.trim()) return categoryCards

    const query = searchQuery.toLowerCase()
    return categoryCards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query) ||
        card.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleCategoryClick = (categoryId: string) => {
    const element = document.getElementById("faqs")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Search Section */}
        <section className="relative py-20 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          <Container className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-xl mb-6 backdrop-blur-sm">
              <HelpCircle className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              How can we help you?
            </h1>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search for answers, articles, or tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white/20 transition-all"
              />
            </div>
            <div className="mt-6 flex justify-center gap-6 text-sm text-slate-400">
              <span>Popular:</span>
              <button onClick={() => setSearchQuery("pricing")} className="hover:text-white underline decoration-slate-600 hover:decoration-white underline-offset-4 transition-all">Pricing</button>
              <button onClick={() => setSearchQuery("shopify")} className="hover:text-white underline decoration-slate-600 hover:decoration-white underline-offset-4 transition-all">Shopify Integration</button>
              <button onClick={() => setSearchQuery("shipping")} className="hover:text-white underline decoration-slate-600 hover:decoration-white underline-offset-4 transition-all">Shipping</button>
            </div>
          </Container>
        </section>

        {/* Quick Categories */}
        <section className="py-16 bg-white">
          <Container>
            {filteredCategoryCards.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategoryCards.map((card) => (
                    <div 
                      key={card.id}
                      onClick={() => handleCategoryClick(card.id)}
                      className="group p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer bg-white"
                    >
                      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                        <card.icon className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No categories found</h3>
                <p className="text-slate-600">Try adjusting your search terms.</p>
              </div>
            )}
          </Container>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="py-16 bg-slate-50 border-y border-slate-100">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
              
              {sortedFAQs.length > 0 ? (
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {sortedFAQs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="bg-white border border-slate-200 rounded-xl px-6"
                      >
                        <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600 hover:no-underline py-6">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600">No FAQs found matching your search.</p>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Contact Support Strip */}
        <section className="py-20 bg-white">
          <Container>
            <div className="bg-slate-900 rounded-2xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/50 to-purple-900/50"></div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Still need help?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                    <MessageCircle className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold mb-2">Live Chat</h3>
                    <p className="text-slate-300 text-sm">Available 9am - 5pm EST</p>
                  </div>
                  <Link href="/academy" className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                    <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold mb-2">Academy</h3>
                    <p className="text-slate-300 text-sm">Video tutorials & courses</p>
                  </Link>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                    <FileText className="h-8 w-8 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold mb-2">Email Support</h3>
                    <p className="text-slate-300 text-sm">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

      </main>

      <Footer />
    </div>
  )
}










