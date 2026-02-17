"use client"

import { useState, useMemo } from "react"
import { ExternalLayout } from "@/components/layout/external-layout"
import { HelpCategoryCard } from "@/components/help-center/help-category-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { categoryCards, faqs } from "@/components/help-center/help-content-data"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HelpPage() {
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

  const faqsByCategory = useMemo(() => {
    const grouped: Record<string, typeof faqs> = {}
    sortedFAQs.forEach((faq) => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = []
      }
      grouped[faq.category].push(faq)
    })
    return grouped
  }, [sortedFAQs])

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
    const element = document.getElementById("general-faqs")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-4 p-2 bg-gray-50/50">
          <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 flex-shrink-0 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-white">Help & Support</h1>
                <p className="text-xs text-white/90 mt-0.5">
                  Find answers, guides, and support resources
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60 pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs bg-white/15 border-white/20 text-white placeholder:text-white/50 rounded-md w-56 focus:bg-white/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredCategoryCards.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCategoryCards.map((card) => (
                  <Card
                    key={card.id}
                    className="cursor-pointer transition-colors border-gray-200/80 bg-white hover:border-primary/30 group"
                    onClick={() => handleCategoryClick(card.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                          <card.icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 leading-tight">
                            {card.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section id="general-faqs">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">
              Frequently Asked Questions
              {searchQuery && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {sortedFAQs.length} result{sortedFAQs.length !== 1 ? "s" : ""}
                </span>
              )}
            </h2>

            {sortedFAQs.length === 0 ? (
              <Card className="border-gray-200/80 bg-white">
                <CardContent className="py-10 text-center">
                  <HelpCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No results found for "{searchQuery}". Try a different search term.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
                  <Card key={category} className="border-gray-200/80 bg-white overflow-hidden">
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{category}</h3>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-gray-200/80 text-gray-500">
                          {categoryFaqs.length}
                        </Badge>
                      </div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {categoryFaqs.map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <AccordionTrigger className="text-left text-sm font-medium text-gray-800 hover:no-underline py-3 px-4 hover:bg-gray-50/50">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-gray-600 leading-relaxed px-4 pb-3">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="mt-2 mb-4">
            <Card className="border-gray-200/80 bg-white">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Still need help?</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Our support team is available to assist you with any questions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 border-gray-200">
                      <Mail className="h-3.5 w-3.5" />
                      Email Support
                    </Button>
                    <Button size="sm" className="text-xs h-8 gap-1.5 bg-primary/90 hover:bg-primary">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Live Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
    </ExternalLayout>
  )
}
