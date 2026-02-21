

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { DescriptionGenerator } from "@/components/ai-tools/description-generator"
export default function DescriptionGeneratorPage() {
  const toolContent = (
    <>

      <DescriptionGenerator />
    </>
  )

  return (
    <>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
