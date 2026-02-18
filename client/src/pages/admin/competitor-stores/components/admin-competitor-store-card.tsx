


import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, Edit, MoreVertical, CheckCircle2, TrendingUp, Globe, ExternalLink, Users } from "lucide-react"
// Using local interface matching the UI format
interface CompetitorStore {
  id: string
  name: string
  url: string
  logo?: string
  category: string
  country?: string
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  products_count?: number
  rating?: number
  verified: boolean
  created_at: string
  updated_at: string
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminCompetitorStoreCardProps {
  store: CompetitorStore
  onEdit?: (store: CompetitorStore) => void
  onViewDetails?: (store: CompetitorStore) => void
  onDelete?: (store: CompetitorStore) => void
  onVerify?: (store: CompetitorStore) => void
  onDuplicate?: (store: CompetitorStore) => void
  canEdit?: boolean
  canDelete?: boolean
  canVerify?: boolean
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function AdminCompetitorStoreCard({
  store,
  onEdit,
  onViewDetails,
  onDelete,
  onVerify,
  onDuplicate,
  canEdit = true,
  canDelete = true,
  canVerify = true,
}: AdminCompetitorStoreCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
        {store.logo ? (
          <img
            src={store.logo}
            alt={store.name}
           
            className="object-cover"
           
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Store className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(store)}>
                  View Details
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => window.open(`https://${store.url}`, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Store
              </DropdownMenuItem>
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(store)}>
                  Edit
                </DropdownMenuItem>
              )}
              {canVerify && onVerify && !store.verified && (
                <DropdownMenuItem onClick={() => onVerify(store)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verify
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(store)}>
                  Duplicate
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(store)} className="text-destructive">
                    <Store className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {store.verified && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{store.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>{store.url}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{store.category}</Badge>
          {store.country && (
            <Badge variant="secondary">{store.country}</Badge>
          )}
          {store.rating && (
            <Badge variant="secondary">{store.rating.toFixed(1)} ⭐</Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Traffic</span>
            </div>
            <span className="font-semibold">{numberFormatter.format(store.monthly_traffic)}</span>
          </div>
          {store.monthly_revenue && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Revenue</span>
              </div>
              <span className="font-semibold">{currencyFormatter.format(store.monthly_revenue)}</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Growth</span>
            </div>
            <span className="font-semibold text-green-600">{store.growth.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {onViewDetails && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(store)}
          >
            View Details
          </Button>
        )}
        {canEdit && onEdit && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onEdit(store)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}




