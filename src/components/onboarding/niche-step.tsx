"use client"

import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "@/components/ui/field"
import { preferredNicheOptions, type PreferredNiche } from "@/lib/utils/onboarding"

interface NicheStepProps {
  niche: PreferredNiche | undefined
  onSelect: (niche: PreferredNiche) => void
}

export function NicheStep({ niche, onSelect }: NicheStepProps) {
  return (
    <Field className="gap-3">
      <div className="space-y-1">
        <FieldLabel className="text-base font-semibold">
          What niche are you most interested in?
        </FieldLabel>
        <p className="text-sm text-muted-foreground">
          Select the category that best matches your business focus. We&apos;ll customize your experience with relevant products, insights, and opportunities.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {preferredNicheOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "p-4 rounded-lg border-2 text-left transition-all",
              "hover:border-ring hover:bg-accent/50 hover:shadow-sm",
              niche === option.value
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-input bg-card"
            )}
          >
            <div className="font-semibold text-sm">{option.label}</div>
          </button>
        ))}
      </div>
    </Field>
  )
}

