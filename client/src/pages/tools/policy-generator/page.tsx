

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
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
