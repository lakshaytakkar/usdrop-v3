

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { PolicyGenerator } from "@/components/ai-tools/policy-generator"
export default function PolicyGeneratorPage() {
  const toolContent = (
    <>

      <PolicyGenerator />
    </>
  )

  return (
    <>
        <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
