

import { Button } from "@/components/ui/button"
import { Play, Coins } from "lucide-react"
import { ModelStudio } from "@/components/ai-tools/model-studio"
export default function ModelStudioPage() {
  const toolContent = (
    <>

      <ModelStudio />
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
