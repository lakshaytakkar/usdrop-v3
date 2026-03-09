import { apiFetch } from '@/lib/supabase'
import { FormEvent, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ExternalLink, HelpCircle } from "lucide-react"
import { ButtonSpinner } from "@/components/ui/blue-spinner"

interface ConnectStoreModalProps {
  open: boolean
  onClose: () => void
  onStoreAdded?: () => void
}

export function ConnectStoreModal({ open, onClose, onStoreAdded }: ConnectStoreModalProps) {
  const [storeId, setStoreId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ url?: string }>({})

  const handleClose = () => {
    setStoreId("")
    setErrors({})
    setIsLoading(false)
    onClose()
  }

  const cleanedId = storeId.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\.myshopify\.com.*$/, "")
    .replace(/\/$/, "")
    .replace(/[^a-z0-9-]/g, "")

  const validate = (): boolean => {
    const newErrors: { url?: string } = {}

    if (!cleanedId) {
      newErrors.url = "Store ID is required"
    } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(cleanedId) && cleanedId.length > 1) {
      newErrors.url = "Store ID can only contain letters, numbers, and hyphens"
    } else if (cleanedId.length < 2) {
      newErrors.url = "Store ID must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await apiFetch("/api/shopify-stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop: cleanedId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate OAuth flow")
      }

      const data = await response.json()

      if (data.oauth_url) {
        window.location.href = data.oauth_url
      } else {
        throw new Error("OAuth URL not received")
      }
    } catch (error) {
      console.error("Error connecting store:", error)
      setErrors({ url: error instanceof Error ? error.message : "Error connecting store. Please try again." })
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect Your Shopify Store</DialogTitle>
          <DialogDescription>
            Enter your Shopify store ID to connect it to USDrop.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="store-id">Store ID</Label>
              <div className="flex items-center">
                <Input
                  id="store-id"
                  placeholder="your-store-name"
                  value={storeId}
                  onChange={(e) => {
                    setStoreId(e.target.value)
                    if (errors.url) setErrors({})
                  }}
                  className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                  required
                  disabled={isLoading}
                  data-testid="input-store-id"
                />
                <span className="inline-flex items-center px-3 h-9 rounded-r-md border border-l-0 border-input bg-gray-50 text-sm text-muted-foreground whitespace-nowrap select-none">
                  .myshopify.com
                </span>
              </div>
              {cleanedId && !errors.url && (
                <p className="text-xs text-green-600" data-testid="text-store-preview">
                  Your store: <span className="font-mono font-medium">{cleanedId}.myshopify.com</span>
                </p>
              )}
              {errors.url && <p className="text-sm text-destructive" data-testid="text-store-error">{errors.url}</p>}
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                How to find your Store ID
              </div>
              <ol className="space-y-2 text-xs text-gray-600 list-none pl-0">
                <li className="flex gap-2">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>
                    Log in to your{" "}
                    <a href="https://admin.shopify.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline underline-offset-2" data-testid="link-shopify-admin">
                      Shopify Admin
                      <ExternalLink className="inline h-3 w-3 ml-0.5 -mt-0.5" />
                    </a>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>
                    Your Store ID is in the URL:{" "}
                    <span className="font-mono text-gray-500 bg-white px-1 py-0.5 rounded border border-gray-200">admin.shopify.com/store/<strong className="text-gray-900">your-store-id</strong></span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>
                    Or go to{" "}
                    <a href="https://admin.shopify.com/settings/general" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline underline-offset-2" data-testid="link-shopify-settings">
                      Settings &rarr; Store details
                      <ExternalLink className="inline h-3 w-3 ml-0.5 -mt-0.5" />
                    </a>
                    {" "}&mdash; your <span className="font-mono bg-white px-1 py-0.5 rounded border border-gray-200">.myshopify.com</span> domain is listed there.
                  </span>
                </li>
              </ol>
              <p className="text-[11px] text-gray-400 pt-1 border-t border-gray-200">
                Don't have a store yet?{" "}
                <a href="https://shopify.pxf.io/usdrop" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline underline-offset-2" data-testid="link-create-store">
                  Create one free on Shopify
                  <ExternalLink className="inline h-3 w-3 ml-0.5 -mt-0.5" />
                </a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} data-testid="button-cancel-connect">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !cleanedId} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="button-connect-store">
              {isLoading ? (
                <>
                  <ButtonSpinner />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect via Shopify
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
