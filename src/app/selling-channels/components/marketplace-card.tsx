"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lock, ExternalLink, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Marketplace } from "../data/marketplaces"
import { cn } from "@/lib/utils"
import { LockOverlay } from "@/components/ui/lock-overlay"

interface MarketplaceCardProps {
  marketplace: Marketplace
  onLockedClick?: () => void
}

export function MarketplaceCard({ marketplace, onLockedClick }: MarketplaceCardProps) {
  return (
    <Card className={cn(
      "relative flex h-full flex-col",
      marketplace.isLocked && "overflow-hidden"
    )}>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 mb-1">
          <div className="relative w-full h-full max-w-[100px]">
            <Image
              src={marketplace.logo}
              alt={`${marketplace.name} logo`}
              fill
              className={cn(
                "object-contain transition-all duration-300",
                marketplace.isLocked && "blur-sm"
              )}
              sizes="100px"
            />
          </div>
        </div>

        {/* Marketplace Name */}
        <h3 className={cn(
          "text-lg font-semibold text-center mb-2",
          marketplace.isLocked && "blur-sm opacity-0"
        )}>
          {marketplace.name}
        </h3>

        {/* Requirements List */}
        <div className="flex-1 space-y-1.5 mb-3">
          {marketplace.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className={cn(
                "h-3.5 w-3.5 flex-shrink-0",
                marketplace.isLocked ? "text-muted-foreground" : "text-emerald-600"
              )} />
              <span className={cn(
                "text-xs",
                marketplace.isLocked && "text-muted-foreground"
              )}>
                {requirement}
              </span>
            </div>
          ))}
        </div>

        {/* Seller Panel Button */}
        {marketplace.isLocked ? (
          <button
            disabled
            className="relative w-full h-9 rounded-md text-sm font-medium text-white/60 cursor-not-allowed"
          >
            <span className="absolute inset-0 rounded-md bg-gray-200"></span>
            <span className="relative flex items-center justify-center gap-2 z-10">
              <Lock className="h-3.5 w-3.5" />
              <span>Locked</span>
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              window.open(marketplace.sellerPanelUrl, "_blank", "noopener,noreferrer")
            }}
            className="relative w-full h-9 rounded-md text-sm font-medium text-white cursor-pointer"
          >
            <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
            <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
            <span className="relative flex items-center justify-center gap-2 z-10">
              <span>Seller Panel</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </button>
        )}

        {/* Lock Overlay */}
        {marketplace.isLocked && (
          <LockOverlay onClick={onLockedClick} />
        )}
      </CardContent>
    </Card>
  )
}

