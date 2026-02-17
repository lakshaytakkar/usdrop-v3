"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { ExternalLayout } from "@/components/layout/external-layout"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import {
  Trash2,
  Eye,
  Search,
  MoreVertical,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface PicklistItem {
  id: string
  productId: string
  title: string
  image: string
  price: number
  buyPrice: number
  profitPerOrder: number
  category: string
  addedDate: string
  source: "winning-products" | "product-hunt" | "other"
}

export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth()
  const { showSuccess, showError } = useToast()
  const [items, setItems] = useState<PicklistItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (authLoading) return
    if (hasFetched.current) return
    hasFetched.current = true

    if (!user) {
      setItems([])
      setIsLoading(false)
      return
    }

    let cancelled = false

    const fetchPicklist = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/picklist', {
          credentials: 'include',
        })
        
        if (cancelled) return

        if (!response.ok) {
          if (response.status === 401) {
            setItems([])
            return
          }
          throw new Error('Failed to fetch picklist')
        }

        const data = await response.json()
        if (!cancelled) {
          setItems(data.items || [])
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching picklist:', error)
          showError('Failed to load picklist items')
          setItems([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchPicklist()

    return () => {
      cancelled = true
    }
  }, [authLoading, user])

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/picklist/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove item')
      }

      setItems(items.filter(item => item.id !== id))
      showSuccess('Product removed from picklist')

      // Dispatch event to update sidebar badge
      window.dispatchEvent(new CustomEvent("picklist-updated"))
    } catch (error) {
      console.error('Error removing item:', error)
      showError('Failed to remove product from picklist')
    }
  }

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    const query = searchQuery.toLowerCase()
    return items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }, [items, searchQuery])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
            {/* Premium Banner with grainy gradient */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-slate-950 to-blue-800 p-5 md:p-6 text-white h-[154px] flex-shrink-0">
              {/* Enhanced grainy texture layers */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: 0.5,
                  mixBlendMode: 'overlay'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
                  opacity: 0.4,
                  mixBlendMode: 'multiply'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
                  opacity: 0.3,
                  mixBlendMode: 'screen'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px),
                                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`,
                  opacity: 0.6
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-5 h-full">
                <img
                  src="/3d-ecom-icons-blue/My_Products.png"
                  alt="My Products"
                  width={120}
                  height={120}
                  className="w-[6rem] h-[6rem] md:w-[7rem] md:h-[7rem] flex-shrink-0 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">My Products</h2>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Your saved products ready for Shopify import
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-sm text-muted-foreground hidden md:block">
                {filteredItems.length} {filteredItems.length === 1 ? "product" : "products"} saved
              </p>
            </div>

            {/* Table */}
            {isLoading ? (
              <Card>
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              </Card>
            ) : filteredItems.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Image
                    src="/images/3d-icons/pin-icon.png"
                    alt="No products"
                    width={48}
                    height={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-lg font-semibold mb-2">No products saved</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "No products match your search."
                      : "Start adding products to your list to save them for later."}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <a href="/winning-products">Browse Products</a>
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {item.source.replace("-", " ")}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.category}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(item.addedDate)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              View
                            </Button>
                            <Button size="sm" className="h-8 text-xs bg-[#95BF47] hover:bg-[#7FA737] text-white border-0">
                              <Image
                                src="/shopify_glyph.svg"
                                alt="Shopify"
                                width={14}
                                height={14}
                                className="mr-1.5"
                              />
                              Import to Shopify
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Onboarding Progress Overlay */}
            <OnboardingProgressOverlay pageName="My Products" />
          </div>
    </ExternalLayout>
  )
}
