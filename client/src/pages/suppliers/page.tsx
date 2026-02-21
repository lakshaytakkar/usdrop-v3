

import { useState, useMemo } from "react"
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
import { Search, Users } from "lucide-react"
import { SupplierCard } from "./components/supplier-card"
import { Supplier, sampleSuppliers } from "./data/suppliers"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { LockOverlay } from "@/components/ui/lock-overlay"

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "minOrder">("rating")
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(sampleSuppliers.map((s) => s.category)))]
  }, [])

  const filteredAndSortedSuppliers = useMemo(() => {
    let filtered = sampleSuppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || supplier.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort suppliers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        case "minOrder":
          return a.minOrder - b.minOrder
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 min-h-0 relative">

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers, categories, or specialties..."
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
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                    <SelectItem value="reviews">Sort by Reviews</SelectItem>
                    <SelectItem value="minOrder">Sort by Min Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers Grid */}
          {filteredAndSortedSuppliers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSortedSuppliers.map((supplier, index) => {
                const { isLocked } = getTeaserLockState(index, isFree, {
                  freeVisibleCount: 3,
                  strategy: "first-n-items"
                })
                return (
                  <div key={supplier.id} className="relative">
                    <SupplierCard supplier={supplier} />
                    {isLocked && (
                      <LockOverlay 
                        onClick={() => setIsUpsellOpen(true)}
                        size="md"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </>
  )
}

