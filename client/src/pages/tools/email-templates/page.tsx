

import { EmailTemplates } from "@/components/ai-tools/email-templates"
import { usePageTeaser } from "@/hooks/use-page-teaser"

export default function EmailTemplatesPage() {
  const { isLocked } = usePageTeaser("/tools/email-templates")

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
        <EmailTemplates locked={isLocked} />
      </div>
    </>
  )
}
