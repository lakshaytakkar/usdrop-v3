"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, Star } from "lucide-react"
import { Supplier } from "../data/suppliers"

interface SupplierCardProps {
  supplier: Supplier
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Card className="flex h-full flex-col transition-transform hover:scale-[1.02]">
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-primary/10">
              <AvatarFallback className="text-primary font-semibold">
                {supplier.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{supplier.name}</h3>
                {supplier.verified && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{supplier.country}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{supplier.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{supplier.category}</Badge>
          {supplier.specialties.slice(0, 2).map((specialty, index) => (
            <Badge key={index} variant="outline">
              {specialty}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 pt-2 border-t">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{supplier.rating}</span>
          <span className="text-sm text-muted-foreground">({supplier.reviews} reviews)</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Min Order</p>
            <p className="text-sm font-semibold">{currencyFormatter.format(supplier.minOrder)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Lead Time</p>
            <p className="text-sm font-semibold">{supplier.leadTime}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-auto pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" className="flex-1">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

