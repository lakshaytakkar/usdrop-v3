

import { apiFetch } from '@/lib/supabase'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Store, CheckCircle2, XCircle, Trash2, Loader2, RefreshCw } from "lucide-react"
import { ShopifyStore } from "../data/stores"
import { useToast } from "@/hooks/use-toast"
// Helper function to format relative time
const formatRelativeTime = (date: string) => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

interface StoreListProps {
  stores: ShopifyStore[]
  onStoresChange?: () => void
}

export function StoreList({ stores, onStoresChange }: StoreListProps) {
  const { showSuccess, showError } = useToast()
  const [disconnectStoreId, setDisconnectStoreId] = useState<string | null>(null)
  const [openDisconnectDialog, setOpenDisconnectDialog] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null)

  const handleDisconnect = (storeId: string) => {
    setDisconnectStoreId(storeId)
    setOpenDisconnectDialog(true)
  }

  const handleConfirmDisconnect = async () => {
    if (!disconnectStoreId) return
    
    try {
      setIsDisconnecting(true)
      
      const response = await apiFetch(`/api/shopify-stores/${disconnectStoreId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect store')
      }
      
      showSuccess('Store disconnected successfully')
      setDisconnectStoreId(null)
      setOpenDisconnectDialog(false)
      onStoresChange?.()
    } catch (err) {
      console.error("Error disconnecting store:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to disconnect store"
      showError(errorMessage)
    } finally {
      setIsDisconnecting(false)
    }
  }

  const handleSync = async (storeId: string) => {
    try {
      setSyncingStoreId(storeId)
      
      const response = await apiFetch(`/api/shopify-stores/${storeId}/sync`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sync store')
      }
      
      showSuccess('Store synced successfully')
      onStoresChange?.()
    } catch (err) {
      console.error("Error syncing store:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to sync store"
      showError(errorMessage)
    } finally {
      setSyncingStoreId(null)
    }
  }

  const handleCancelDisconnect = () => {
    setDisconnectStoreId(null)
    setOpenDisconnectDialog(false)
  }

  if (stores.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <Card key={store.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 flex-none items-center justify-center rounded-xl">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{store.name}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{store.url}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-1.5">
                    {store.status === "connected" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-600">Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-xs font-medium text-destructive">Disconnected</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Connected at</span>
                  <span className="text-sm font-medium">
                    {store.connected_at ? formatRelativeTime(store.connected_at) : 'N/A'}
                  </span>
                </div>
                {store.last_synced_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last synced</span>
                    <span className="text-sm font-medium">
                      {formatRelativeTime(store.last_synced_at)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t flex gap-2">
                {store.status === "connected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(store.id)}
                    disabled={syncingStoreId === store.id}
                    className="flex-1"
                  >
                    {syncingStoreId === store.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnect(store.id)}
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDisconnectDialog} onOpenChange={setOpenDisconnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect this store? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDisconnect} disabled={isDisconnecting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDisconnect} disabled={isDisconnecting}>
              {isDisconnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

