"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, Edit, MoreVertical, CheckCircle2, Star, Globe, Mail } from "lucide-react"
import { Supplier } from "@/app/suppliers/data/suppliers"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminSupplierCardProps {
  supplier: Supplier
  onEdit?: (supplier: Supplier) => void
  onViewDetails?: (supplier: Supplier) => void
  onDelete?: (supplier: Supplier) => void
  onVerify?: (supplier: Supplier) => void
  onDuplicate?: (supplier: Supplier) => void
  canEdit?: boolean
  canDelete?: boolean
  canVerify?: boolean
}

export function AdminSupplierCard({
  supplier,
  onEdit,
  onViewDetails,
  onDelete,
  onVerify,
  onDuplicate,
  canEdit = true,
  canDelete = true,
  canVerify = true,
}: AdminSupplierCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
        {supplier.logo ? (
          <Image
            src={supplier.logo}
            alt={supplier.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Building className="h-12 w-12 text-muted-foreground" />
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
                <DropdownMenuItem onClick={() => onViewDetails(supplier)}>
                  View Details
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(supplier)}>
                  Edit
                </DropdownMenuItem>
              )}
              {canVerify && onVerify && !supplier.verified && (
                <DropdownMenuItem onClick={() => onVerify(supplier)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verify
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(supplier)}>
                  Duplicate
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(supplier)} className="text-destructive">
                    <Building className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {supplier.verified && (
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
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{supplier.name}</h3>
          {supplier.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{supplier.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{supplier.category}</Badge>
          {supplier.country && (
            <Badge variant="secondary">{supplier.country}</Badge>
          )}
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {supplier.rating.toFixed(1)}
            <span className="text-xs text-muted-foreground">({supplier.reviews})</span>
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Min Order</span>
            <span className="font-semibold">{supplier.minOrder}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Lead Time</span>
            <span className="font-semibold">{supplier.leadTime}</span>
          </div>
        </div>

        {supplier.specialties && supplier.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {supplier.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {supplier.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{supplier.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {onViewDetails && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(supplier)}
          >
            View Details
          </Button>
        )}
        {canEdit && onEdit && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onEdit(supplier)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}


