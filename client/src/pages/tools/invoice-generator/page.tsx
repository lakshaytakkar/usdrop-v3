

import { InvoiceGenerator } from "@/components/ai-tools/invoice-generator"
import { usePageTeaser } from "@/hooks/use-page-teaser"

export default function InvoiceGeneratorPage() {
  const { isLocked } = usePageTeaser("/tools/invoice-generator")

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
        <InvoiceGenerator locked={isLocked} />
      </div>
    </>
  )
}
