"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, Search } from "lucide-react"
import { ToolCard } from "./components/tool-card"
import { AITool, aiTools } from "./data/tools"

export default function AIStudioPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(aiTools.map((t) => t.category)))]
  }, [])

  const filteredTools = useMemo(() => {
    return aiTools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const availableTools = filteredTools.filter((t) => t.status === "available")
  const premiumTools = filteredTools.filter((t) => t.status === "premium")
  const comingSoonTools = filteredTools.filter((t) => t.status === "coming-soon")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">AI Studio</h1>
              <Badge className="ml-2">NEW</Badge>
            </div>
            <p className="text-muted-foreground">
              Create compelling content and optimize your workflow with AI-powered tools
            </p>
          </div>

          {/* Hero Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-3">AI-Powered Tools for Your Business</h2>
                <p className="text-muted-foreground">
                  Create compelling content, optimize your marketing, and streamline your workflow
                  with our suite of AI-powered tools designed specifically for dropshippers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search AI tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Available Tools */}
          {availableTools.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* Premium Tools */}
          {premiumTools.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Premium Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {premiumTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon Tools */}
          {comingSoonTools.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {comingSoonTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {filteredTools.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

