

import { apiFetch } from '@/lib/supabase'
import { useState } from "react"
import { useRouter } from "@/hooks/use-router"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { PhoneStep } from "@/components/onboarding/phone-step"
import { ExperienceStep } from "@/components/onboarding/experience-step"
import { NicheStep } from "@/components/onboarding/niche-step"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  type OnboardingData,
  type EcommerceExperience,
  type PreferredNiche,
  validatePhoneNumber,
} from "@/lib/utils/onboarding"

interface OnboardingModalProps {
  open: boolean
  onComplete?: () => void
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({})
  const [errors, setErrors] = useState<{ phone?: string; general?: string }>({})

  const totalSteps = 3

  const handleNext = () => {
    if (step === 1) {
      // Validate phone number
      const phoneValidation = validatePhoneNumber(data.phone_number || "")
      if (!phoneValidation.valid) {
        setErrors({ phone: phoneValidation.error })
        return
      }
      setErrors({})
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setErrors({})

    try {
      const response = await apiFetch("/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ general: result.error || "Failed to save onboarding data" })
        showError(result.error || "Failed to save onboarding data")
        return
      }

      showSuccess("Onboarding completed successfully!")

      if (onComplete) {
        onComplete()
      } else {
        router.push("/home")
        router.refresh()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save onboarding data. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md h-[600px] max-h-[90vh] flex flex-col p-6 m-4" 
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="flex-shrink-0 mb-4 px-2">
          <DialogTitle className="text-center text-xl mb-3">Complete your profile</DialogTitle>
          {/* Progress Bar */}
          <div className="w-full mb-2">
            <div className="relative flex items-center justify-between mb-3">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
              {/* Step indicators */}
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all",
                      index < step
                        ? "bg-primary border-primary text-primary-foreground"
                        : index === step - 1
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted text-muted-foreground"
                    )}
                  >
                    {index < step ? "✓" : index + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span className={cn("transition-colors", step >= 1 && "text-primary font-medium")}>
                Contact
              </span>
              <span className={cn("transition-colors", step >= 2 && "text-primary font-medium")}>
                Experience
              </span>
              <span className={cn("transition-colors", step >= 3 && "text-primary font-medium")}>
                Niche
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 px-2">
          {errors.general && (
            <div className="rounded-md bg-destructive/15 p-2 text-xs text-destructive">
              {errors.general}
            </div>
          )}

          <FieldGroup className="gap-4">
            {step === 1 && (
              <PhoneStep
                phoneNumber={data.phone_number || ""}
                onChange={(phone) => updateData({ phone_number: phone })}
                error={errors.phone}
              />
            )}

            {step === 2 && (
              <ExperienceStep
                experience={data.ecommerce_experience}
                onSelect={(experience) => updateData({ ecommerce_experience: experience })}
              />
            )}

            {step === 3 && (
              <NicheStep
                niche={data.preferred_niche}
                onSelect={(niche) => updateData({ preferred_niche: niche })}
              />
            )}
          </FieldGroup>
        </div>

        <div className="flex justify-between gap-3 flex-shrink-0 mt-4 pt-4 border-t px-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="flex-1 h-9 text-sm"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={loading || (step === 1 && !data.phone_number) || (step === 2 && !data.ecommerce_experience) || (step === 3 && !data.preferred_niche)}
            className="flex-1 h-9 text-sm"
          >
            {loading ? "Saving..." : step === totalSteps ? "Complete" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

