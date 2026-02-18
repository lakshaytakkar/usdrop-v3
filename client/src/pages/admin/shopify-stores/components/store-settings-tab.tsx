

import { ShopifyStore } from "@/pages/shopify-stores/data/stores"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package } from "lucide-react"

interface StoreSettingsTabProps {
  store: ShopifyStore
  onEdit?: (store: ShopifyStore) => void
}

export function StoreSettingsTab({ store, onEdit }: StoreSettingsTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">Store Settings</h3>
        <p className="text-xs text-muted-foreground">
          Configure store settings and sync preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Store Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input id="store-name" defaultValue={store.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="niche">Niche</Label>
            <Input id="niche" defaultValue={store.niche || ""} placeholder="e.g., Fashion, Electronics" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" defaultValue={store.country || ""} placeholder="e.g., US" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue={store.currency} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select defaultValue={store.plan}>
              <SelectTrigger id="plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="shopify">Shopify</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="plus">Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Sync Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sync-frequency">Auto-sync Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="sync-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never (Manual only)</SelectItem>
                <SelectItem value="hourly">Every Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-sync Products</Label>
              <p className="text-xs text-muted-foreground">
                Automatically sync products from Shopify
              </p>
            </div>
            <Badge variant="outline">Enabled</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        {onEdit && (
          <Button size="sm" onClick={() => onEdit(store)}>
            Save Changes
          </Button>
        )}
      </div>
    </div>
  )
}

