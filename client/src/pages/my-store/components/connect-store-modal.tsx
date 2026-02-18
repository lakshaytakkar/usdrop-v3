

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
import { Loader2, ExternalLink } from "lucide-react"
import { validateShopifyStoreUrl } from "@/lib/utils/shopify-store-helpers"

interface ConnectStoreModalProps {
  open: boolean
  onClose: () => void
  onStoreAdded?: () => void
}

export function ConnectStoreModal({ open, onClose, onStoreAdded }: ConnectStoreModalProps) {
  const [storeUrl, setStoreUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ url?: string }>({})

  const handleClose = () => {
    setStoreUrl("")
    setErrors({})
    setIsLoading(false)
    onClose()
  }

  const validate = async (): Promise<boolean> => {
    const newErrors: { url?: string } = {}

    if (!storeUrl.trim()) {
      newErrors.url = "Store URL is required"
    } else if (!validateShopifyStoreUrl(storeUrl)) {
      newErrors.url = "Invalid Shopify store URL. Please enter a valid .myshopify.com URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!(await validate())) {
      return
    }

    setIsLoading(true)

    try {
      // Normalize store URL (extract shop name)
      let shop = storeUrl.trim().toLowerCase()
      shop = shop.replace(/^https?:\/\//, "")
      shop = shop.replace(/\/$/, "")
      if (shop.includes(".")) {
        shop = shop.split(".")[0]
      }

      // Initiate OAuth flow
      const response = await apiFetch("/api/shopify-stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate OAuth flow")
      }

      const data = await response.json()
      
      // Redirect to Shopify OAuth
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Store</DialogTitle>
          <DialogDescription>
            Connect your Shopify store to start tracking and analyzing your performance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="store-url">Shopify Store URL *</Label>
              <Input
                id="store-url"
                placeholder="your-store.myshopify.com or your-store"
                value={storeUrl}
                onChange={(e) => {
                  setStoreUrl(e.target.value)
                  if (errors.url) {
                    setErrors({})
                  }
                }}
                required
                disabled={isLoading}
              />
              {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
              <p className="text-xs text-muted-foreground">
                Enter your Shopify store URL. You'll be redirected to authorize the connection.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

