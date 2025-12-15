"use client"

import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "@/components/ui/field"
import { ecommerceExperienceOptions, type EcommerceExperience } from "@/lib/utils/onboarding"

interface ExperienceStepProps {
  experience: EcommerceExperience | undefined
  onSelect: (experience: EcommerceExperience) => void
}

export function ExperienceStep({ experience, onSelect }: ExperienceStepProps) {
  const experienceDescriptions: Record<EcommerceExperience, string> = {
    none: "I'm completely new to ecommerce and looking to get started",
    beginner: "I've dabbled in ecommerce but need guidance to scale",
    intermediate: "I have some experience running online stores",
    advanced: "I've successfully run multiple ecommerce businesses",
    expert: "I'm a seasoned ecommerce professional"
  }

  return (
    <Field className="gap-3">
      <div className="space-y-1">
        <FieldLabel className="text-base font-semibold">
          Tell us about your ecommerce journey
        </FieldLabel>
        <p className="text-sm text-muted-foreground">
          Understanding your experience level helps us tailor the perfect resources and recommendations for your success.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {ecommerceExperienceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "p-4 rounded-lg border-2 text-left transition-all",
              "hover:border-ring hover:bg-accent/50 hover:shadow-sm",
              experience === option.value
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-input bg-card"
            )}
          >
            <div className="font-semibold text-sm mb-1">{option.label}</div>
            <div className="text-xs text-muted-foreground">
              {experienceDescriptions[option.value]}
            </div>
          </button>
        ))}
      </div>
    </Field>
  )
}

