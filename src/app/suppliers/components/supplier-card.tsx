"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, Star, Shield, Award, Truck, Lock } from "lucide-react"
import { Supplier } from "../data/suppliers"
import Image from "next/image"

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
  const profileImage = supplier.profileImage || supplier.logo
  const coverImage = supplier.coverImage

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {/* Cover Image Section */}
      {coverImage && (
        <div className="relative w-full h-[140px] bg-muted overflow-hidden">
          <Image
            src={coverImage}
            alt={`${supplier.name} cover`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <CardContent className={`flex flex-1 flex-col gap-3 p-4 ${coverImage ? 'pt-16' : ''}`}>
        {/* Profile Picture Overlapping Cover */}
        {coverImage && (
          <div className="flex flex-col items-center -mt-20 mb-1">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg bg-primary/10">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={supplier.name} />
              ) : null}
              <AvatarFallback className="text-primary font-semibold text-xl">
                {supplier.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        {!coverImage && (
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg bg-primary/10">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={supplier.name} />
              ) : null}
              <AvatarFallback className="text-primary font-semibold text-lg">
                {supplier.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Supplier Name and Verified Badge */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-center">{supplier.name}</h3>
            {supplier.verified && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{supplier.country}</p>
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted text-xs">
              🇨🇳
            </span>
          </div>
          {supplier.managerName && (
            <p className="text-xs text-muted-foreground">Manager: {supplier.managerName}</p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Badge variant="outline" className="text-xs gap-1">
            <Shield className="h-3 w-3 text-emerald-600" />
            Verified
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Award className="h-3 w-3 text-blue-600" />
            Premium
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Lock className="h-3 w-3 text-purple-600" />
            Secure
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Truck className="h-3 w-3 text-orange-600" />
            Express
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 text-center">{supplier.description}</p>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="default" className="text-xs">{supplier.category}</Badge>
          {supplier.specialties.slice(0, 2).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-md p-2 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-center text-blue-700 dark:text-blue-300 font-medium">
            🚚 Delivered in 6-8 days in USA via USDrop Express Line
          </p>
        </div>

        <div className="flex items-center justify-center gap-1 pt-1 border-t">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">{supplier.rating}</span>
          <span className="text-xs text-muted-foreground">({supplier.reviews} reviews)</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Min Order</p>
            <p className="text-xs font-semibold">{currencyFormatter.format(supplier.minOrder)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Lead Time</p>
            <p className="text-xs font-semibold">{supplier.leadTime}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-auto pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
            View Details
          </Button>
          <Button size="sm" className="flex-1 text-xs h-8">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

