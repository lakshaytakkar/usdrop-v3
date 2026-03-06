

import { useOnboarding } from "@/contexts/onboarding-context"
import { UpgradeOverlay } from "@/components/ui/upgrade-overlay"
import { BlueSpinner } from "@/components/ui/blue-spinner"

interface ProPageWrapperProps {
  featureName: string
  featureDescription: string
  children: React.ReactNode
}

export function ProPageWrapper({
  featureName,
  featureDescription,
  children,
}: ProPageWrapperProps) {
  const { isFree, hasCompletedFreeLearning, isLoading } = useOnboarding()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <BlueSpinner size="lg" label="Checking access..." />
      </div>
    )
  }

  if (isFree && !hasCompletedFreeLearning) {
    return (
      <UpgradeOverlay
        featureName={featureName}
        featureDescription={featureDescription}
      >
        {children}
      </UpgradeOverlay>
    )
  }

  return <>{children}</>
}
