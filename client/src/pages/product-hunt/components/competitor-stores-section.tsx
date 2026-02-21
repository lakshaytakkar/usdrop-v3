
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Globe, TrendingUp, Star, ExternalLink } from "lucide-react"
import { CompetitorStore } from "@/types/products"

interface CompetitorStoresSectionProps {
  stores: CompetitorStore[]
}

function formatTraffic(n: number | null): string {
  if (!n) return "N/A"
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

function formatRevenue(n: number | null): string {
  if (!n) return "N/A"
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export function CompetitorStoresSection({ stores }: CompetitorStoresSectionProps) {
  if (!stores || stores.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {stores.slice(0, 6).map((store) => (
        <Card key={store.id} className="p-4" data-testid={`card-competitor-store-${store.id}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/50 overflow-hidden shrink-0 flex items-center justify-center">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold truncate">{store.name}</h4>
                {store.url && (
                  <a
                    href={`https://${store.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    data-testid={`link-store-${store.id}`}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {store.country && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {store.country}
                  </div>
                )}
                {store.rating && (
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {store.rating.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Traffic</p>
              <p className="text-xs font-semibold">{formatTraffic(store.monthly_traffic)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-xs font-semibold">{formatRevenue(store.monthly_revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Growth</p>
              <div className="flex items-center gap-0.5">
                {store.growth && store.growth > 0 ? (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 text-[10px] px-1 py-0 h-4">
                    <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                    +{store.growth.toFixed(1)}%
                  </Badge>
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground">N/A</span>
                )}
              </div>
            </div>
          </div>
          {store.products_count && store.products_count > 0 && (
            <p className="text-[10px] text-muted-foreground mt-2">{store.products_count} products listed</p>
          )}
        </Card>
      ))}
    </div>
  )
}
