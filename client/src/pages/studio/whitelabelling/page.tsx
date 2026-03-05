

import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { LogoStudio } from "@/components/ai-tools/logo-studio"
export default function LogoStudioPage() {
  const toolContent = (
    <>

      <LogoStudio />
    </>
  )

  return (
    <ModuleAccessGuard moduleId="studio">
    <>
        <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
          {toolContent}

        </div>
    </>
    </ModuleAccessGuard>
  )
}
