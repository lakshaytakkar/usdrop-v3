

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
import { ButtonSpinner } from "@/components/ui/blue-spinner"

interface ConnectStoreModalProps {
  open: boolean
  onClose: () => void
  onStoreAdded?: () => void
}

export function ConnectStoreModal({ open, onClose, onStoreAdded }: ConnectStoreModalProps) {
  const [storeUrl, setStoreUrl] = useState("")
  const [storeName, setStoreName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ url?: string }>({})

  const handleClose = () => {
    setStoreUrl("")
    setStoreName("")
    setErrors({})
    setIsLoading(false)
    onClose()
  }

  const validateShopifyStoreUrl = (url: string): boolean => {
    const shopifyPattern = /^[a-zA-Z0-9-]+\.myshopify\.com$|^[a-zA-Z0-9-]+$/
    return shopifyPattern.test(url.trim())
  }

  const normalizeShopifyStoreUrl = (url: string): string => {
    let normalized = url.trim().toLowerCase()
    if (!normalized.includes(".")) {
      normalized = `${normalized}.myshopify.com`
    }
    if (!normalized.startsWith("http")) {
      normalized = `https://${normalized}`
    }
    return normalized.replace(/^https?:\/\//, "").replace(/\/$/, "")
  }

  const validate = async (): Promise<boolean> => {
    const newErrors: { url?: string } = {}

    if (!storeUrl.trim()) {
      newErrors.url = "Store URL is required"
    } else if (!validateShopifyStoreUrl(storeUrl)) {
      newErrors.url = "Invalid Shopify store URL"
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      handleClose()
      onStoreAdded?.()
    } catch (error) {
      console.error("Error connecting store:", error)
      setErrors({ url: "Error connecting store. Please try again." })
    } finally {
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
              <Label htmlFor="store-url">Store URL *</Label>
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
              <p className="text-xs text-muted-foreground">Enter your Shopify store URL</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name (Optional)</Label>
              <Input
                id="store-name"
                placeholder="My Store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">A friendly name for your store</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ButtonSpinner />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

