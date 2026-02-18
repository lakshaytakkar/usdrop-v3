

import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { StoreResearchData } from "../data/store-research-data"

interface RevenueEstimatesProps {
  data: StoreResearchData
}

export function RevenueEstimates({ data }: RevenueEstimatesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Estimated Traffic & Revenue</h3>

        {data.hasInsufficientData ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This website is either down or does not receive enough traffic for accurate estimates.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {data.monthlyRevenue !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(data.monthlyRevenue)}</p>
              </div>
            )}
            {data.monthlyTraffic !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Traffic</p>
                <p className="text-2xl font-bold">
                  {formatNumber(data.monthlyTraffic)} visitors
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

