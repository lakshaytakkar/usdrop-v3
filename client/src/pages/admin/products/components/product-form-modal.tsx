

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ProductPick } from "@/types/admin/products"
import {
  Loader2,
  Plus,
  Trash2,
  ImageIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  BarChart3,
  ClipboardList,
  Eye,
} from "lucide-react"

interface ProductFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: ProductPick | null
  onSuccess: () => void
}

interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface FormData {
  title: string
  description: string
  category_id: string
  image: string
  additional_images: string[]
  buy_price: string
  sell_price: string
  rating: string
  reviews_count: string
  trend_data: string
  specifications: { key: string; value: string }[]
}

const STEPS = [
  { label: "Basic Info", icon: Package },
  { label: "Pricing", icon: DollarSign },
  { label: "Details", icon: BarChart3 },
  { label: "Review", icon: Eye },
]

const initialFormData: FormData = {
  title: "",
  description: "",
  category_id: "",
  image: "",
  additional_images: [],
  buy_price: "",
  sell_price: "",
  rating: "",
  reviews_count: "",
  trend_data: "",
  specifications: [],
}

export function ProductFormModal({ open, onOpenChange, product, onSuccess }: ProductFormModalProps) {
  const { showSuccess, showError } = useToast()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({ ...initialFormData })
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const isEditMode = !!product

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/categories")
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data.categories || [])
      return data.categories || []
    } catch {
      showError("Failed to load categories")
      return []
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    if (!open) {
      setStep(0)
      setFormData({ ...initialFormData })
      setErrors({})
      return
    }

    fetchCategories().then((cats: CategoryOption[]) => {
      if (product && cats.length > 0) {
        const matchedCategory = cats.find((c: CategoryOption) => c.slug === product.category)
        const specs: { key: string; value: string }[] = []
        if (product.specifications) {
          Object.entries(product.specifications).forEach(([key, value]) => {
            specs.push({ key, value: String(value) })
          })
        }

        setFormData({
          title: product.title || "",
          description: product.description || "",
          category_id: matchedCategory?.id || "",
          image: product.image || "",
          additional_images: product.additional_images || [],
          buy_price: product.buy_price?.toString() || "",
          sell_price: product.sell_price?.toString() || "",
          rating: product.rating?.toString() || "",
          reviews_count: product.reviews_count?.toString() || "",
          trend_data: product.trend_data?.join(", ") || "",
          specifications: specs,
        })
      }
    })
  }, [open, product, fetchCategories])

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const profit = (parseFloat(formData.sell_price) || 0) - (parseFloat(formData.buy_price) || 0)
  const margin =
    parseFloat(formData.sell_price) > 0
      ? ((profit / parseFloat(formData.sell_price)) * 100).toFixed(1)
      : "0.0"

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, boolean> = {}

    if (currentStep === 0) {
      if (!formData.title.trim()) newErrors.title = true
      if (!formData.category_id) newErrors.category_id = true
      if (!isEditMode && !formData.image.trim()) newErrors.image = true
    }

    if (currentStep === 1) {
      if (!formData.buy_price || parseFloat(formData.buy_price) <= 0) newErrors.buy_price = true
      if (!formData.sell_price || parseFloat(formData.sell_price) <= 0) newErrors.sell_price = true
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3))
    }
  }

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  const parseTrendData = (): number[] => {
    if (!formData.trend_data.trim()) return []
    return formData.trend_data
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n))
  }

  const parseSpecifications = (): Record<string, string> | null => {
    const filtered = formData.specifications.filter((s) => s.key.trim() && s.value.trim())
    if (filtered.length === 0) return null
    const result: Record<string, string> = {}
    filtered.forEach((s) => {
      result[s.key.trim()] = s.value.trim()
    })
    return result
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category_id: formData.category_id || null,
        image: formData.image.trim(),
        additional_images: formData.additional_images.filter((url) => url.trim()),
        buy_price: parseFloat(formData.buy_price),
        sell_price: parseFloat(formData.sell_price),
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : 0,
        trend_data: parseTrendData(),
        specifications: parseSpecifications(),
      }

      if (!isEditMode) {
        body.supplier_id = null
        body.source = { source_type: "scraped" }
      }

      const url = isEditMode ? `/api/admin/products/${product!.id}` : "/api/admin/products"
      const method = isEditMode ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Failed to save product")
      }

      showSuccess(isEditMode ? "Product updated successfully" : "Product created successfully")
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      showError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const addAdditionalImage = () => {
    updateField("additional_images", [...formData.additional_images, ""])
  }

  const removeAdditionalImage = (index: number) => {
    updateField(
      "additional_images",
      formData.additional_images.filter((_, i) => i !== index)
    )
  }

  const updateAdditionalImage = (index: number, value: string) => {
    const updated = [...formData.additional_images]
    updated[index] = value
    updateField("additional_images", updated)
  }

  const addSpecification = () => {
    updateField("specifications", [...formData.specifications, { key: "", value: "" }])
  }

  const removeSpecification = (index: number) => {
    updateField(
      "specifications",
      formData.specifications.filter((_, i) => i !== index)
    )
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const updated = [...formData.specifications]
    updated[index] = { ...updated[index], [field]: value }
    updateField("specifications", updated)
  }

  const getCategoryName = () => {
    return categories.find((c) => c.id === formData.category_id)?.name || "Not selected"
  }

  const renderTrendPreview = (data: number[]) => {
    if (data.length < 2) return null
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    return (
      <div className="flex items-end gap-0.5 h-8">
        {data.map((val, i) => (
          <div
            key={i}
            className="bg-blue-500 rounded-t-sm min-w-[4px] flex-1"
            style={{ height: `${((val - min) / range) * 100}%`, minHeight: "2px" }}
          />
        ))}
      </div>
    )
  }

  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className={errors.title ? "text-destructive" : ""}>
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="Product title"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          aria-invalid={errors.title}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Product description..."
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className={errors.category_id ? "text-destructive" : ""}>
          Category <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.category_id} onValueChange={(val) => updateField("category_id", val)}>
          <SelectTrigger className={`w-full ${errors.category_id ? "border-destructive" : ""}`}>
            <SelectValue placeholder={loading ? "Loading..." : "Select a category"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className={errors.image ? "text-destructive" : ""}>
          Image URL {!isEditMode && <span className="text-destructive">*</span>}
        </Label>
        <Input
          placeholder="https://example.com/image.png"
          value={formData.image}
          onChange={(e) => updateField("image", e.target.value)}
          aria-invalid={errors.image}
        />
        {formData.image && (
          <div className="mt-2 relative w-20 h-20 rounded-lg border overflow-hidden bg-muted">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Additional Images</Label>
          <Button type="button" variant="outline" size="sm" onClick={addAdditionalImage}>
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
        {formData.additional_images.map((url, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder="https://example.com/image.png"
              value={url}
              onChange={(e) => updateAdditionalImage(i, e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeAdditionalImage(i)}>
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={errors.buy_price ? "text-destructive" : ""}>
            Buy Price <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.buy_price}
              onChange={(e) => updateField("buy_price", e.target.value)}
              className="pl-7"
              aria-invalid={errors.buy_price}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className={errors.sell_price ? "text-destructive" : ""}>
            Sell Price <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.sell_price}
              onChange={(e) => updateField("sell_price", e.target.value)}
              className="pl-7"
              aria-invalid={errors.sell_price}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Profit per Order</p>
              <div className="flex items-center gap-2">
                {profit >= 0 ? (
                  <TrendingUp className="size-4 text-green-500" />
                ) : (
                  <TrendingDown className="size-4 text-red-500" />
                )}
                <span className={`text-xl font-bold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${profit.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {margin}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep2 = () => {
    const trendNumbers = parseTrendData()

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rating (0-5)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="e.g. 4.5"
              value={formData.rating}
              onChange={(e) => updateField("rating", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Reviews Count</Label>
            <Input
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 120"
              value={formData.reviews_count}
              onChange={(e) => updateField("reviews_count", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trend Data</Label>
          <Input
            placeholder="e.g. 10, 25, 30, 45, 60"
            value={formData.trend_data}
            onChange={(e) => updateField("trend_data", e.target.value)}
          />
          {trendNumbers.length >= 2 && (
            <div className="mt-2 p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-1">
                Trend Preview ({trendNumbers.length} data points)
              </p>
              {renderTrendPreview(trendNumbers)}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Specifications</Label>
            <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>
          {formData.specifications.length === 0 && (
            <p className="text-sm text-muted-foreground">No specifications added yet.</p>
          )}
          {formData.specifications.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="Key (e.g. Material)"
                value={spec.key}
                onChange={(e) => updateSpecification(i, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g. Stainless Steel)"
                value={spec.value}
                onChange={(e) => updateSpecification(i, "value", e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeSpecification(i)}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderStep3 = () => {
    const trendNumbers = parseTrendData()
    const specs = parseSpecifications()

    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          {formData.image && (
            <div className="w-24 h-24 rounded-lg border overflow-hidden bg-muted shrink-0">
              <img
                src={formData.image}
                alt="Product"
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{formData.title || "Untitled"}</h3>
            <Badge variant="secondary" className="mt-1">
              {getCategoryName()}
            </Badge>
            {formData.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{formData.description}</p>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="pt-4">
            <h4 className="text-sm font-medium mb-3">Pricing</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Buy Price</p>
                <p className="font-semibold">${parseFloat(formData.buy_price || "0").toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sell Price</p>
                <p className="font-semibold">${parseFloat(formData.sell_price || "0").toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className={`font-semibold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${profit.toFixed(2)} ({margin}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(formData.rating || formData.reviews_count || trendNumbers.length > 0) && (
          <Card>
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium mb-3">Details</h4>
              <div className="space-y-2">
                {formData.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-yellow-500" />
                    <span className="text-sm">{formData.rating} / 5</span>
                  </div>
                )}
                {formData.reviews_count && (
                  <p className="text-sm text-muted-foreground">
                    {formData.reviews_count} reviews
                  </p>
                )}
                {trendNumbers.length >= 2 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Trend</p>
                    {renderTrendPreview(trendNumbers)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {specs && (
          <Card>
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium mb-3">Specifications</h4>
              <div className="space-y-1">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {formData.additional_images.filter((u) => u.trim()).length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">
              Additional Images ({formData.additional_images.filter((u) => u.trim()).length})
            </p>
            <div className="flex gap-2 flex-wrap">
              {formData.additional_images
                .filter((u) => u.trim())
                .map((url, i) => (
                  <div key={i} className="w-14 h-14 rounded-md border overflow-hidden bg-muted">
                    <img
                      src={url}
                      alt={`Additional ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the product details below." : "Fill in the product details across the steps below."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1 mb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = i === step
            const isCompleted = i < step

            return (
              <div key={i} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (i < step) setStep(i)
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors w-full ${
                    isActive
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : isCompleted
                        ? "text-green-600 dark:text-green-400 hover:bg-green-500/10 cursor-pointer"
                        : "text-muted-foreground"
                  }`}
                  disabled={i > step}
                >
                  <div
                    className={`flex items-center justify-center size-6 rounded-full shrink-0 ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                  </div>
                  <span className="hidden sm:inline truncate">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 shrink-0 ${i < step ? "bg-green-500" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="min-h-[280px]">{stepRenderers[step]()}</div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft className="size-4" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {isEditMode ? "Update Product" : "Create Product"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
