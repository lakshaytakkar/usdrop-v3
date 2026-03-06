import { ProPageWrapper } from "@/components/ui/pro-page-wrapper"
import { PromptAnalyzerComponent } from '@/components/shared/prompt-analyzer';

export default function PromptAnalyzerPage() {
  return (
    <ProPageWrapper
      featureName="Prompt Analyzer"
      featureDescription="Analyze and optimize your AI prompts. Complete Free Learning to unlock this tool."
    >
      <PromptAnalyzerComponent />
    </ProPageWrapper>
  );
}

