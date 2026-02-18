

import { useOnboarding } from "@/contexts/onboarding-context"
import { UnlockBadge } from "@/components/ui/unlock-badge"

export function SidebarOnboardingBadge() {
  const { isFree, isLoading } = useOnboarding()

  // Don't show badge if loading or not a free user
  if (isLoading || !isFree) {
    return null
  }

  return <UnlockBadge size="sm" />
}
