"use client"

import { useState, useMemo } from "react"
import { HelpSearch } from "@/components/help-center/help-search"
import { HelpCategoryCard } from "@/components/help-center/help-category-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { categoryCards, faqs } from "./data/admin-knowledge-base-data"

export default function AdminKnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqs

    const query = searchQuery.toLowerCase()
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        faq.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Group FAQs by category
  const faqsByCategory = useMemo(() => {
    const grouped: Record<string, typeof faqs> = {}
    filteredFAQs.forEach((faq) => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = []
      }
      grouped[faq.category].push(faq)
    })
    return grouped
  }, [filteredFAQs])

  // Filter category cards based on search
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
    // Find the category name from the card
    const card = categoryCards.find((c) => c.id === categoryId)
    if (card) {
      // Scroll to the FAQs section for that category
      const element = document.getElementById(`category-${card.category.toLowerCase().replace(/\s+/g, "-")}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Textured Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/10">
        {/* Multiple texture layers for depth */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.4,
            mixBlendMode: 'overlay'
          }}
        ></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
            opacity: 0.3,
            mixBlendMode: 'multiply'
          }}
        ></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
            opacity: 0.2,
            mixBlendMode: 'screen'
          }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative w-full border-b border-border bg-gradient-to-br from-gray-50/95 via-blue-50/80 to-indigo-50/60 dark:from-gray-900/95 dark:via-blue-950/80 dark:to-indigo-950/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center">
              Admin Knowledge Base
            </h1>
            <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl">
              Comprehensive documentation and guides for managing the USDrop platform. Find answers to common admin questions and learn best practices.
            </p>
            <HelpSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search knowledge base..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Quick Access Categories Section */}
        {filteredCategoryCards.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCategoryCards.map((card) => (
                <HelpCategoryCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  onClick={() => handleCategoryClick(card.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* FAQs by Category Section */}
        {Object.keys(faqsByCategory).length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No FAQs found matching your search. Try a different query.
            </p>
          </div>
        ) : (
          <section>
            {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
              <div
                key={category}
                id={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {categoryFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border-b border-border"
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        <p>{faq.answer}</p>
                        {faq.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {faq.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

