

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
        <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
          {toolContent}

        </div>
    </>
  )
}
