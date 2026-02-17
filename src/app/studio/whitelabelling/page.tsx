"use client"

import { ExternalLayout } from "@/components/layout/external-layout"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { LogoStudio } from "@/components/ai-tools/logo-studio"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
export default function LogoStudioPage() {
  const toolContent = (
    <>
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
        <h1 className="text-2xl font-bold">Whitelabelling</h1>
        <p className="text-sm text-blue-100 mt-1">Apply your logo to multiple images in bulk. Customize placement, size, and opacity.</p>
      </div>

      <LogoStudio />
    </>
  )

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {toolContent}

          <OnboardingProgressOverlay pageName="Whitelabelling" />
        </div>
    </ExternalLayout>
  )
}
