"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { HelpSearch } from "@/components/help-center/help-search"
import { HelpCategoryCard } from "@/components/help-center/help-category-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { categoryCards, faqs } from "@/components/help-center/help-content-data"
import { cn } from "@/lib/utils"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter FAQs based on search query
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

  // Sort FAQs - show General first, then others
  const sortedFAQs = useMemo(() => {
    const sorted = [...filteredFAQs]
    sorted.sort((a, b) => {
      if (a.category === "General" && b.category !== "General") return -1
      if (a.category !== "General" && b.category === "General") return 1
      return a.category.localeCompare(b.category)
    })
    return sorted
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
    // Scroll to FAQs section
    const element = document.getElementById("general-faqs")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="min-h-screen bg-background">
          {/* Header Section */}
          <div className="relative w-full border-b border-border bg-gradient-to-br from-gray-50 via-gray-50/80 to-primary/5 dark:from-gray-900 dark:via-gray-900/80 dark:to-primary/10">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
              <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center">
                  USDrop Help & Documentation
                </h1>
                <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl">
                  Stuck on something or getting started? Our friendly team is here to help.
                </p>
                <HelpSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search for help..."
                  className="w-full"
                />
              </div>
            </div>
          </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Quickfind Answers Section */}
        {filteredCategoryCards.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Quickfind answers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* General FAQs Section */}
        <section id="general-faqs">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            General FAQs
          </h2>

          {sortedFAQs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No FAQs found matching your search. Try a different query.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {sortedFAQs.map((faq) => (
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
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>
      </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

