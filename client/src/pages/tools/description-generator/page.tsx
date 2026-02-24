

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
        <div className="flex flex-1 flex-col gap-2 px-6 md:px-10 lg:px-16 py-6 md:py-8 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
