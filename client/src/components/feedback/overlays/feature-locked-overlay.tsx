

import { useState } from "react"
import { Lock, Crown, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { cn } from "@/lib/utils"

interface FeatureLockedOverlayProps {
  featureName?: string
  description?: string
  className?: string
  children?: React.ReactNode
  variant?: "overlay" | "full-page" | "inline"
}

export function FeatureLockedOverlay({
  featureName = "This feature",
  description = "Upgrade to Pro to unlock access to all features and grow your dropshipping business faster.",
  className,
  children,
  variant = "overlay",
}: FeatureLockedOverlayProps) {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)

  if (variant === "full-page") {
    return (
      <>
        <div className={cn(
          "flex flex-col items-center justify-center min-h-[60vh] p-8 text-center",
          className
        )}>
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-3xl rounded-full" />
            <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 rounded-2xl border border-amber-500/20">
              <Lock className="h-12 w-12 text-amber-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pro Feature
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 max-w-md">
            {featureName} is a Pro Feature
          </h2>
          
          <p className="text-muted-foreground max-w-md mb-8">
            {description}
          </p>
          
          <Button 
            onClick={() => setIsUpsellOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2"
            size="lg"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Pro
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Get unlimited access to all features with a Pro subscription
          </p>
        </div>
        
        <UpsellDialog isOpen={isUpsellOpen} onClose={() => setIsUpsellOpen(false)} />
      </>
    )
  }

  if (variant === "inline") {
    return (
      <>
        <div className={cn(
          "flex items-center gap-4 p-4 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-lg",
          className
        )}>
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Lock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium">{featureName}</span>
              <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                Pro
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button 
            onClick={() => setIsUpsellOpen(true)}
            variant="outline"
            size="sm"
            className="border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            Upgrade
          </Button>
        </div>
        
        <UpsellDialog isOpen={isUpsellOpen} onClose={() => setIsUpsellOpen(false)} />
      </>
    )
  }

  // Default overlay variant - renders over children
  return (
    <>
      <div className={cn("relative", className)}>
        {/* Content behind the overlay (blurred) */}
        <div className="filter blur-sm pointer-events-none select-none opacity-50">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center text-center max-w-sm p-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 rounded-xl border border-amber-500/20">
                <Lock className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 mb-3">
              <Crown className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Pro Feature
              </span>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              Unlock {featureName}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
            
            <Button 
              onClick={() => setIsUpsellOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
      
      <UpsellDialog isOpen={isUpsellOpen} onClose={() => setIsUpsellOpen(false)} />
    </>
  )
}

