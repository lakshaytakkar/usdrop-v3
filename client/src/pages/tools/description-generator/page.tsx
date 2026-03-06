

import { DescriptionGenerator } from "@/components/ai-tools/description-generator"
import { usePageTeaser } from "@/hooks/use-page-teaser"

export default function DescriptionGeneratorPage() {
  const { isLocked } = usePageTeaser("/tools/description-generator")

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
        <DescriptionGenerator locked={isLocked} />
      </div>
    </>
  )
}
