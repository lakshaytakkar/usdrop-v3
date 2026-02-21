

import { AppTopNavigation } from "@/components/layout/app-top-navigation"
import { SubNavTabs } from "@/components/layout/sub-nav-tabs"
import { WhatsAppFloatingButton } from "@/components/shared/whatsapp-contact-button"
import { useAuth } from "@/contexts/auth-context"

interface ExternalLayoutProps {
  children: React.ReactNode
  showSubNav?: boolean
}

export function ExternalLayout({ children, showSubNav = true }: ExternalLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#f0f6fb]">
      <AppTopNavigation />
      {showSubNav && <SubNavTabs />}
      <main className="flex-1">
        {children}
      </main>
      {user && (
        <WhatsAppFloatingButton
          pocName="Parth"
          phoneNumber="+91 9350502364"
        />
      )}
    </div>
  )
}
