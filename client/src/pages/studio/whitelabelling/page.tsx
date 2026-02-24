

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
    <>
        <div className="flex flex-1 flex-col gap-2 px-6 md:px-10 lg:px-16 py-6 md:py-8 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
