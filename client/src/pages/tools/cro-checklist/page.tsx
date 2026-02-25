import { CROChecklist } from "./cro-checklist"
import { FrameworkBanner } from "@/components/framework-banner"

export default function CROChecklistPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2" data-testid="page-cro-checklist">
      <FrameworkBanner
        title="CRO Checklist"
        description="Optimize your store's conversion rate with this comprehensive checklist"
        iconSrc="/images/banners/3d-roadmap.png"
        tutorialVideoUrl=""
      />
      <CROChecklist />
    </div>
  )
}
