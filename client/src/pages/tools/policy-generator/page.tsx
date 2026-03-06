

import { PolicyGenerator } from "@/components/ai-tools/policy-generator"
import { usePageTeaser } from "@/hooks/use-page-teaser"

export default function PolicyGeneratorPage() {
  const { isLocked } = usePageTeaser("/tools/policy-generator")

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
        <PolicyGenerator locked={isLocked} />
      </div>
    </>
  )
}
