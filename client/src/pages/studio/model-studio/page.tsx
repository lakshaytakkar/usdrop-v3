import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { ProPageWrapper } from "@/components/ui/pro-page-wrapper"
import { ModelStudio } from "@/components/ai-tools/model-studio"

export default function ModelStudioPage() {
  return (
    <ModuleAccessGuard moduleId="studio">
      <ProPageWrapper
        featureName="AI Model Studio"
        featureDescription="Generate professional product photos with AI models. Complete Free Learning to unlock this feature."
      >
        <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">
          <ModelStudio />
        </div>
      </ProPageWrapper>
    </ModuleAccessGuard>
  )
}
