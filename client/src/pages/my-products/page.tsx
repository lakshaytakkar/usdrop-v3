import { apiFetch } from "@/lib/supabase";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TeaserListFade } from "@/components/ui/teaser-list-fade";
import { TeaserButtonLock } from "@/components/ui/teaser-button-lock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  Pencil,
  DollarSign,
  Package,
  Calendar,
  Tag,
  X,
  Wrench,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FrameworkBanner } from "@/components/framework-banner";
import { Badge } from "@/components/ui/badge";

interface PicklistItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  description: string;
  price: number;
  buyPrice: number;
  profitPerOrder: number;
  inStock: boolean;
  category: string;
  categoryId: string | null;
  addedDate: string;
  source:
    | "winning-products"
    | "product-hunt"
    | "other"
    | "manual"
    | "url-import";
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

type ModalStep = "closed" | "choose" | "url" | "manual";

function AddProductModal({
  open,
  onOpenChange,
  onProductCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreated: () => void;
}) {
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState<ModalStep>("choose");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [importUrl, setImportUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const [manualTitle, setManualTitle] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualCategoryId, setManualCategoryId] = useState("");
  const [manualBuyPrice, setManualBuyPrice] = useState("");
  const [manualSellPrice, setManualSellPrice] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      setStep("choose");
      resetForms();
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || data || []);
      }
    } catch {
      console.error("Failed to fetch categories");
    }
  };

  const resetForms = () => {
    setImportUrl("");
    setUrlError("");
    setManualTitle("");
    setManualDescription("");
    setManualCategoryId("");
    setManualBuyPrice("");
    setManualSellPrice("");
    setManualImageUrl("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep("choose");
    resetForms();
  };

  const handleImportUrl = async () => {
    if (!importUrl.trim()) {
      setUrlError("Please enter a URL");
      return;
    }
    try {
      new URL(importUrl.trim());
    } catch {
      setUrlError("Please provide a valid product URL");
      return;
    }
    setUrlError("");
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/api/products/import-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to import product");
      }
      showSuccess("Product imported and added to your list");
      window.dispatchEvent(new CustomEvent("picklist-updated"));
      onProductCreated();
      handleClose();
    } catch (error: any) {
      showError(error.message || "Failed to import product from URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualCreate = async () => {
    if (!manualTitle.trim()) {
      showError("Product name is required");
      return;
    }
    setIsSubmitting(true);
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
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }
      showSuccess("Product created and added to your list");
      window.dispatchEvent(new CustomEvent("picklist-updated"));
      onProductCreated();
      handleClose();
    } catch (error: any) {
      showError(error.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-lg p-0 gap-0 overflow-hidden"
        aria-describedby="add-product-desc"
      >
        <DialogDescription id="add-product-desc" className="sr-only">
          Choose how to add a product to your list
        </DialogDescription>
        {step === "choose" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle
                className="text-xl font-bold text-gray-900"
                data-testid="text-modal-title"
              >
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
                  <p className="text-[15px] font-semibold text-gray-900">
                    Import from URL
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    Paste a product page link and we'll pull the details for you
                  </p>
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
                  <p className="text-[15px] font-semibold text-gray-900">
                    Enter Manually
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    Manually enter all the product details
                  </p>
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
                Paste your{" "}
                <span className="text-indigo-600 font-semibold">
                  product link
                </span>{" "}
                to get product info
              </p>
              <div className="space-y-2">
                <Input
                  placeholder="e.g. amazon product link, shopify product link, etc."
                  value={importUrl}
                  onChange={(e) => {
                    setImportUrl(e.target.value);
                    setUrlError("");
                  }}
                  className={`h-11 bg-white border-gray-200 rounded-lg text-sm ${urlError ? "border-red-400 focus-visible:ring-red-200" : ""}`}
                  data-testid="input-import-url"
                />
                {urlError && (
                  <p
                    className="text-[13px] text-red-500 font-medium"
                    data-testid="text-url-error"
                  >
                    {urlError}
                  </p>
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
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">
                  Basic Info
                </h3>
                <p className="text-[13px] text-gray-500">
                  Core details that help us describe and highlight your product.
                </p>
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
                  <label className="text-[13px] font-semibold text-gray-700">
                    Category
                  </label>
                  <Select
                    value={manualCategoryId}
                    onValueChange={setManualCategoryId}
                  >
                    <SelectTrigger
                      className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                      data-testid="select-category"
                    >
                      <SelectValue placeholder="Select a product category..." />
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
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">
                  Product description
                </label>
                <Textarea
                  placeholder="e.g., Street-ready hoodie made from soft cotton blend."
                  value={manualDescription}
                  onChange={(e) =>
                    setManualDescription(e.target.value.slice(0, 5000))
                  }
                  className="bg-white border-gray-200 rounded-lg text-sm min-h-[100px] resize-none"
                  data-testid="input-product-description"
                />
                <p className="text-[11px] text-gray-400 text-right">
                  {manualDescription.length}/5000
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">
                    Buy Price ($)
                  </label>
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
                  <label className="text-[13px] font-semibold text-gray-700">
                    Sell Price ($)
                  </label>
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
                <label className="text-[13px] font-semibold text-gray-700">
                  Image URL
                </label>
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
  );
}

function ViewProductModal({
  item,
  open,
  onOpenChange,
  onEdit,
}: {
  item: PicklistItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: PicklistItem) => void;
}) {
  if (!item) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const profit = item.price - item.buyPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden"
        aria-describedby="view-product-desc"
      >
        <DialogDescription id="view-product-desc" className="sr-only">
          Product details
        </DialogDescription>

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <DialogTitle
            className="text-lg font-bold text-gray-900"
            data-testid="text-view-product-title"
          >
            Product Details
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold"
              onClick={() => {
                onOpenChange(false);
                onEdit(item);
              }}
              data-testid="button-edit-from-view"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 shrink-0">
              <div className="w-full aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/demo-products/Screenshot 2024-07-24 185228.png";
                  }}
                  data-testid="img-view-product"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div>
                <h2
                  className="text-xl font-bold text-gray-900 leading-tight"
                  data-testid="text-view-product-name"
                >
                  {item.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={`text-xs font-semibold px-2.5 py-0.5 ${item.inStock ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
                    variant="outline"
                    data-testid="badge-view-stock-status"
                  >
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  <span className="text-sm text-gray-500">{item.category}</span>
                </div>
              </div>

              {item.description && (
                <div>
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    data-testid="text-view-description"
                  >
                    {item.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Buy Price
                    </span>
                  </div>
                  <p
                    className="text-lg font-bold text-gray-900"
                    data-testid="text-view-buy-price"
                  >
                    ${Number(item.buyPrice).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Sell Price
                    </span>
                  </div>
                  <p
                    className="text-lg font-bold text-gray-900"
                    data-testid="text-view-sell-price"
                  >
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-3 border ${profit >= 0 ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Profit
                    </span>
                  </div>
                  <p
                    className={`text-lg font-bold ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}
                    data-testid="text-view-profit"
                  >
                    {profit >= 0 ? "+" : ""}${profit.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span data-testid="text-view-added-date">
                    {formatDate(item.addedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="capitalize" data-testid="text-view-source">
                    {item.source.replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditProductModal({
  item,
  open,
  onOpenChange,
  onSaved,
}: {
  item: PicklistItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editBuyPrice, setEditBuyPrice] = useState("");
  const [editSellPrice, setEditSellPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editInStock, setEditInStock] = useState(true);

  useEffect(() => {
    if (open && item) {
      setEditTitle(item.title);
      setEditDescription(item.description || "");
      setEditCategoryId(item.categoryId || "");
      setEditBuyPrice(item.buyPrice ? String(item.buyPrice) : "");
      setEditSellPrice(item.price ? String(item.price) : "");
      setEditImageUrl(item.image || "");
      setEditInStock(item.inStock);
      fetchCategories();
    }
  }, [open, item]);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || data || []);
      }
    } catch {
      console.error("Failed to fetch categories");
    }
  };

  const handleSave = async () => {
    if (!item) return;
    if (!editTitle.trim()) {
      showError("Product name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/api/products/${item.productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || null,
          category_id: editCategoryId || null,
          buy_price: editBuyPrice ? parseFloat(editBuyPrice) : 0,
          sell_price: editSellPrice ? parseFloat(editSellPrice) : 0,
          image: editImageUrl.trim() || null,
          in_stock: editInStock,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }
      showSuccess("Product updated successfully");
      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      showError(error.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg p-0 gap-0 overflow-hidden"
        aria-describedby="edit-product-desc"
      >
        <DialogDescription id="edit-product-desc" className="sr-only">
          Edit product details
        </DialogDescription>

        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Pencil className="h-4 w-4 text-indigo-600" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Edit Product
          </DialogTitle>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700">
                Product name <span className="text-red-500">*</span>
              </label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                data-testid="input-edit-product-name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700">
                Category
              </label>
              <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                <SelectTrigger
                  className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                  data-testid="select-edit-category"
                >
                  <SelectValue placeholder="Select category..." />
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
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">
              Product description
            </label>
            <Textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(e.target.value.slice(0, 5000))
              }
              className="bg-white border-gray-200 rounded-lg text-sm min-h-[100px] resize-none"
              data-testid="input-edit-description"
            />
            <p className="text-[11px] text-gray-400 text-right">
              {editDescription.length}/5000
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700">
                Buy Price ($)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={editBuyPrice}
                onChange={(e) => setEditBuyPrice(e.target.value)}
                className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                data-testid="input-edit-buy-price"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700">
                Sell Price ($)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={editSellPrice}
                onChange={(e) => setEditSellPrice(e.target.value)}
                className="h-10 bg-white border-gray-200 rounded-lg text-sm"
                data-testid="input-edit-sell-price"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">
              Image URL
            </label>
            <Input
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              className="h-10 bg-white border-gray-200 rounded-lg text-sm"
              data-testid="input-edit-image-url"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <label className="text-[13px] font-semibold text-gray-700">
                In Stock
              </label>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Toggle availability status for this product
              </p>
            </div>
            <Switch
              checked={editInStock}
              onCheckedChange={setEditInStock}
              data-testid="switch-edit-in-stock"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 rounded-lg text-sm font-semibold"
            data-testid="button-edit-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || !editTitle.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 rounded-lg text-sm font-semibold"
            data-testid="button-edit-save"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ShopifyStore {
  id: string;
  name: string;
  shop_domain: string;
  status: string;
}

type SourceTab = "all" | "usdrop" | "mine";

export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState<PicklistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<PicklistItem | null>(null);
  const [editItem, setEditItem] = useState<PicklistItem | null>(null);
  const [activeTab, setActiveTab] = useState<SourceTab>("all");
  const [pushingProductId, setPushingProductId] = useState<string | null>(null);
  const [storeSelectItem, setStoreSelectItem] = useState<PicklistItem | null>(
    null,
  );
  const [availableStores, setAvailableStores] = useState<ShopifyStore[]>([]);
  const [storeSelectOpen, setStoreSelectOpen] = useState(false);
  const [shopifyDisabledOpen, setShopifyDisabledOpen] = useState(false);

  const handlePushToShopify = async (_item: PicklistItem) => {
    setShopifyDisabledOpen(true);
    return;
  };

  const handlePushToShopifyOriginal = async (item: PicklistItem) => {
    setPushingProductId(item.id);
    try {
      const res = await apiFetch("/api/shopify-stores");
      if (!res.ok) throw new Error("Failed to fetch stores");
      const data = await res.json();
      const stores: ShopifyStore[] = (data.stores || []).filter(
        (s: ShopifyStore) => s.status === "connected",
      );

      if (stores.length === 0) {
        showError(
          "No Shopify store connected. Go to My Store to connect one first.",
        );
        return;
      }

      if (stores.length === 1) {
        await pushProductToStore(item, stores[0].id);
      } else {
        setAvailableStores(stores);
        setStoreSelectItem(item);
        setStoreSelectOpen(true);
      }
    } catch (error: any) {
      showError(error.message || "Failed to push product to Shopify");
    } finally {
      if (!storeSelectOpen) setPushingProductId(null);
    }
  };

  const pushProductToStore = async (item: PicklistItem, storeId: string) => {
    setPushingProductId(item.id);
    try {
      const res = await apiFetch(
        `/api/shopify-stores/${storeId}/products/push`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: item.productId }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to push product");
      showSuccess(data.message || `"${item.title}" pushed to Shopify`);
    } catch (error: any) {
      showError(error.message || "Failed to push product to Shopify");
    } finally {
      setPushingProductId(null);
      setStoreSelectOpen(false);
      setStoreSelectItem(null);
    }
  };

  const fetchPicklist = async () => {
    try {
      const response = await apiFetch("/api/picklist", {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) {
          setItems([]);
          return;
        }
        throw new Error("Failed to fetch picklist");
      }
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching picklist:", error);
      showError("Failed to load picklist items");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchPicklist();
  }, [authLoading, user]);

  const handleRemove = async (id: string) => {
    try {
      const response = await apiFetch(`/api/picklist/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove item");
      setItems(items.filter((item) => item.id !== id));
      showSuccess("Product removed from picklist");
      window.dispatchEvent(new CustomEvent("picklist-updated"));
    } catch (error) {
      console.error("Error removing item:", error);
      showError("Failed to remove product from picklist");
    }
  };

  const usdropSources: PicklistItem["source"][] = [
    "winning-products",
    "product-hunt",
  ];
  const userSources: PicklistItem["source"][] = ["manual", "url-import"];

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (activeTab === "usdrop") {
      filtered = filtered.filter((item) => usdropSources.includes(item.source));
    } else if (activeTab === "mine") {
      filtered = filtered.filter(
        (item) => userSources.includes(item.source) || item.source === "other",
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      );
    }
    return filtered;
  }, [items, searchQuery, activeTab]);

  const tabCounts = useMemo(
    () => ({
      all: items.length,
      usdrop: items.filter((item) => usdropSources.includes(item.source))
        .length,
      mine: items.filter(
        (item) => userSources.includes(item.source) || item.source === "other",
      ).length,
    }),
    [items],
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

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
          <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
            {[
              { key: "all" as SourceTab, label: "All Products" },
              { key: "usdrop" as SourceTab, label: "Saved from USDrop" },
              { key: "mine" as SourceTab, label: "Added by Me" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <span>{tab.label}</span>
                <span
                  className={`ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tabCounts[tab.key]}
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />
                )}
              </button>
            ))}
          </div>

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
                <p
                  className="text-sm text-muted-foreground hidden md:block"
                  data-testid="text-product-count"
                >
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "product" : "products"} saved
                </p>
              )}
              <TeaserButtonLock message="Complete Free Learning to manage products">
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-4 rounded-lg text-sm font-semibold"
                  data-testid="button-add-product"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Product
                </Button>
              </TeaserButtonLock>
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
                  {searchQuery
                    ? "No products match your search"
                    : activeTab === "usdrop"
                      ? "No products saved from USDrop"
                      : activeTab === "mine"
                        ? "No products added by you"
                        : "No products saved"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try a different search term."
                    : activeTab === "usdrop"
                      ? "Browse Product Hunt or Winning Products to save items here."
                      : activeTab === "mine"
                        ? "Use the Add Product button to create your own products."
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
            <TeaserListFade visibleItems={3} contentType="products">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[320px]">Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Buy Price</TableHead>
                      <TableHead>Sell Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      return (
                        <TableRow
                          key={item.id}
                          className="hover:bg-muted/50 transition-colors"
                          data-testid={`row-product-${item.id}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-md overflow-hidden border flex-shrink-0 bg-gray-50">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/demo-products/Screenshot 2024-07-24 185228.png";
                                  }}
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2
                                      className="h-6 w-6 text-emerald-600 drop-shadow-sm"
                                      fill="white"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className="font-medium text-sm truncate max-w-[220px]"
                                  data-testid={`text-product-title-${item.id}`}
                                >
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                                  {item.source.replace(/-/g, " ")}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {item.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className="text-sm font-medium text-gray-900"
                              data-testid={`text-buy-price-${item.id}`}
                            >
                              ${Number(item.buyPrice).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className="text-sm font-medium text-gray-900"
                              data-testid={`text-sell-price-${item.id}`}
                            >
                              ${Number(item.price).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-[11px] font-semibold px-2 py-0.5 ${item.inStock ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-50"}`}
                              variant="outline"
                              data-testid={`badge-stock-${item.id}`}
                            >
                              {item.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(item.addedDate)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setViewItem(item)}
                                data-testid={`button-view-${item.id}`}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 text-xs bg-[#95BF47] hover:bg-[#7FA737] text-white border-0"
                                onClick={() => handlePushToShopify(item)}
                                disabled={pushingProductId === item.id}
                                data-testid={`button-push-shopify-${item.id}`}
                              >
                                {pushingProductId === item.id ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <img
                                    src="/shopify_glyph.svg"
                                    alt="Shopify"
                                    width={14}
                                    height={14}
                                    className="mr-1"
                                  />
                                )}
                                {pushingProductId === item.id
                                  ? "Pushing..."
                                  : "Shopify"}
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => setEditItem(item)}
                                    data-testid={`button-edit-${item.id}`}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleRemove(item.id)}
                                    data-testid={`button-remove-${item.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TeaserListFade>
          )}
        </div>
      </div>

      <AddProductModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onProductCreated={fetchPicklist}
      />
      <ViewProductModal
        item={viewItem}
        open={!!viewItem}
        onOpenChange={(o) => {
          if (!o) setViewItem(null);
        }}
        onEdit={(item) => setEditItem(item)}
      />
      <EditProductModal
        item={editItem}
        open={!!editItem}
        onOpenChange={(o) => {
          if (!o) setEditItem(null);
        }}
        onSaved={fetchPicklist}
      />

      <Dialog
        open={storeSelectOpen}
        onOpenChange={(o) => {
          if (!o) {
            setStoreSelectOpen(false);
            setStoreSelectItem(null);
            setPushingProductId(null);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          aria-describedby="store-select-desc"
        >
          <DialogDescription id="store-select-desc" className="sr-only">
            Select a Shopify store to push your product to
          </DialogDescription>
          <DialogHeader>
            <DialogTitle data-testid="text-store-select-title">
              Select a Store
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">
            You have multiple Shopify stores connected. Choose which store to
            push{" "}
            <span className="font-medium text-foreground">
              {storeSelectItem?.title}
            </span>{" "}
            to:
          </p>
          <div className="space-y-2">
            {availableStores.map((store) => (
              <button
                key={store.id}
                onClick={() =>
                  storeSelectItem &&
                  pushProductToStore(storeSelectItem, store.id)
                }
                disabled={pushingProductId === storeSelectItem?.id}
                className="w-full flex items-center gap-3 p-3 rounded-md border border-gray-200 hover-elevate text-left cursor-pointer"
                data-testid={`button-select-store-${store.id}`}
              >
                <img
                  src="/shopify_glyph.svg"
                  alt="Shopify"
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {store.name || store.shop_domain}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {store.shop_domain}
                  </p>
                </div>
                {pushingProductId === storeSelectItem?.id && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shopifyDisabledOpen} onOpenChange={setShopifyDisabledOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mx-auto mb-3">
              <Wrench className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-center">
              Temporarily Disabled
            </DialogTitle>
            <DialogDescription className="text-center">
              The Import to Shopify feature is temporarily disabled while we
              stabilize and improve the experience. We'll have it back up
              shortly. Thank you for your patience!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-2">
            <Button
              onClick={() => setShopifyDisabledOpen(false)}
              data-testid="button-close-shopify-disabled"
            >
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
