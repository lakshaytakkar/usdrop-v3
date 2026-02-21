

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { EmailTemplates } from "@/components/ai-tools/email-templates"
export default function EmailTemplatesPage() {
  const toolContent = (
    <>

      <EmailTemplates />
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
