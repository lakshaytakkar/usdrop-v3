

import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Trash2,
  Eye,
  Search,
  MoreVertical,
  Plus,
  Link as LinkIcon,
  FileEdit,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { FrameworkBanner } from "@/components/framework-banner"

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
  source: "winning-products" | "product-hunt" | "other" | "manual" | "url-import"
}

interface Category {
  id: string
  name: string
  slug: string
}

type ModalStep = "closed" | "choose" | "url" | "manual"

function AddProductModal({
  open,
  onOpenChange,
  onProductCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductCreated: () => void
}) {
  const { showSuccess, showError } = useToast()
  const [step, setStep] = useState<ModalStep>("choose")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [importUrl, setImportUrl] = useState("")
  const [urlError, setUrlError] = useState("")

  const [manualTitle, setManualTitle] = useState("")
  const [manualDescription, setManualDescription] = useState("")
  const [manualCategoryId, setManualCategoryId] = useState("")
  const [manualBuyPrice, setManualBuyPrice] = useState("")
  const [manualSellPrice, setManualSellPrice] = useState("")
  const [manualImageUrl, setManualImageUrl] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (open) {
      setStep("choose")
      resetForms()
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || data || [])
      }
    } catch {
      console.error("Failed to fetch categories")
    }
  }

  const resetForms = () => {
    setImportUrl("")
    setUrlError("")
    setManualTitle("")
    setManualDescription("")
    setManualCategoryId("")
    setManualBuyPrice("")
    setManualSellPrice("")
    setManualImageUrl("")
    setIsSubmitting(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    setStep("choose")
    resetForms()
  }

  const handleImportUrl = async () => {
    if (!importUrl.trim()) {
      setUrlError("Please enter a URL")
      return
    }

    try {
      new URL(importUrl.trim())
    } catch {
      setUrlError("Please provide a valid product URL")
      return
    }

    setUrlError("")
    setIsSubmitting(true)

    try {
      const res = await apiFetch("/api/products/import-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to import product")
      }

      showSuccess("Product imported and added to your list")
      window.dispatchEvent(new CustomEvent("picklist-updated"))
      onProductCreated()
      handleClose()
    } catch (error: any) {
      showError(error.message || "Failed to import product from URL")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleManualCreate = async () => {
    if (!manualTitle.trim()) {
      showError("Product name is required")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await apiFetch("/api/products/create-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualTitle.trim(),
          description: manualDescription.trim() || undefined,
          category_id: manualCategoryId || undefined,
          buy_price: manualBuyPrice ? parseFloat(manualBuyPrice) : 0,
          sell_price: manualSellPrice ? parseFloat(manualSellPrice) : 0,
          image: manualImageUrl.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create product")
      }

      showSuccess("Product created and added to your list")
      window.dispatchEvent(new CustomEvent("picklist-updated"))
      onProductCreated()
      handleClose()
    } catch (error: any) {
      showError(error.message || "Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden" aria-describedby="add-product-desc">
        <DialogDescription id="add-product-desc" className="sr-only">
          Choose how to add a product to your list
        </DialogDescription>
        {step === "choose" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="text-xl font-bold text-gray-900" data-testid="text-modal-title">
                How do you want to add product?
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={() => setStep("url")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all text-left cursor-pointer group"
                data-testid="button-import-url"
              >
                <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900">Import from URL</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">Paste a product page link and we'll pull the details for you</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
              </button>

              <button
                onClick={() => setStep("manual")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all text-left cursor-pointer group"
                data-testid="button-enter-manually"
              >
                <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <FileEdit className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900">Enter Manually</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">Manually enter all the product details</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
              </button>
            </div>
          </>
        )}

        {step === "url" && (
          <>
            <div className="flex items-center gap-3 px-6 pt-5 pb-4">
              <button
                onClick={() => setStep("choose")}
                className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                data-testid="button-back-from-url"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </button>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Import from URL
              </DialogTitle>
            </div>
            <div className="px-6 pb-6 space-y-5">
              <p className="text-center text-[15px] text-gray-700">
                Paste your <span className="text-indigo-600 font-semibold">product link</span> to get product info
              </p>

              <div className="space-y-2">
                <Input
                  placeholder="e.g. amazon product link, shopify product link, etc."
                  value={importUrl}
                  onChange={(e) => {
                    setImportUrl(e.target.value)
                    setUrlError("")
                  }}
                  className={`h-11 bg-white border-gray-200 rounded-lg text-sm ${urlError ? "border-red-400 focus-visible:ring-red-200" : ""}`}
                  data-testid="input-import-url"
                />
                {urlError && (
                  <p className="text-[13px] text-red-500 font-medium" data-testid="text-url-error">{urlError}</p>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleImportUrl}
                  disabled={isSubmitting || !importUrl.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-10 rounded-lg font-semibold"
                  data-testid="button-analyze-url"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze URL"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "manual" && (
          <>
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
              <button
                onClick={() => setStep("choose")}
                className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                data-testid="button-back-from-manual"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </button>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Setup your product
              </DialogTitle>
            </div>
            <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">Basic Info</h3>
                <p className="text-[13px] text-gray-500">Core details that help us describe and highlight your product.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">
                    Product name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Men's Quarter-Zip Hoodie"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                    data-testid="input-product-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Category</label>
                  <Select value={manualCategoryId} onValueChange={setManualCategoryId}>
                    <SelectTrigger className="h-10 bg-white border-gray-200 rounded-lg text-sm" data-testid="select-category">
                      <SelectValue placeholder="Select a product category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Product description</label>
                <Textarea
                  placeholder="e.g., Street-ready hoodie made from soft cotton blend."
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value.slice(0, 5000))}
                  className="bg-white border-gray-200 rounded-lg text-sm min-h-[100px] resize-none"
                  data-testid="input-product-description"
                />
                <p className="text-[11px] text-gray-400 text-right">{manualDescription.length}/5000</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Buy Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={manualBuyPrice}
                    onChange={(e) => setManualBuyPrice(e.target.value)}
                    className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                    data-testid="input-buy-price"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Sell Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={manualSellPrice}
                    onChange={(e) => setManualSellPrice(e.target.value)}
                    className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                    data-testid="input-sell-price"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Image URL</label>
                <Input
                  placeholder="https://example.com/product-image.jpg"
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                  data-testid="input-image-url"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <Button
                variant="outline"
                onClick={handleClose}
                className="h-10 px-5 rounded-lg text-sm font-semibold"
                data-testid="button-discard"
              >
                Discard
              </Button>
              <Button
                onClick={handleManualCreate}
                disabled={isSubmitting || !manualTitle.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 rounded-lg text-sm font-semibold"
                data-testid="button-create-product"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create product"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth()
  const { showSuccess, showError } = useToast()
  const [items, setItems] = useState<PicklistItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const fetchPicklist = async () => {
    try {
      const response = await apiFetch("/api/picklist", {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          setItems([])
          return
        }
        throw new Error('Failed to fetch picklist')
      }

      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Error fetching picklist:', error)
      showError('Failed to load picklist items')
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setItems([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    fetchPicklist()
  }, [authLoading, user])

  const handleRemove = async (id: string) => {
    try {
      const response = await apiFetch(`/api/picklist/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove item')
      }

      setItems(items.filter(item => item.id !== id))
      showSuccess('Product removed from picklist')

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
    <>
        <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
          <FrameworkBanner
            title="My Products"
            description="Your saved products and picklist for quick access"
            iconSrc="/images/banners/3d-products.png"
            tutorialVideoUrl=""
          />
          <div>

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-white border-gray-200 rounded-lg text-sm"
                  data-testid="input-search-products"
                />
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <p className="text-sm text-muted-foreground hidden md:block" data-testid="text-product-count">
                    {filteredItems.length} {filteredItems.length === 1 ? "product" : "products"} saved
                  </p>
                )}
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-4 rounded-lg text-sm font-semibold"
                  data-testid="button-add-product"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Product
                </Button>
              </div>
            </div>

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
                  <img
                    src="/images/3d-icons/pin-icon.png"
                    alt="No products"
                    width={48}
                    height={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? "No products match your search" : "No products saved"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try a different search term."
                      : "Start by adding products to your list."}
                  </p>
                  {!searchQuery && (
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        data-testid="button-add-product-empty"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Product
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="/products/winning-products">Browse Products</a>
                      </Button>
                    </div>
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
                              <img
                                src={item.image}
                                alt={item.title}
                               
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
                              <img
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

          </div>
        </div>

      <AddProductModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onProductCreated={fetchPicklist}
      />
    </>
  )
}
