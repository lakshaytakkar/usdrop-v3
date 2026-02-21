

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
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
