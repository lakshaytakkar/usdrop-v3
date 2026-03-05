import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12" data-testid="empty-state">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-medium text-foreground" data-testid="text-empty-title">{title}</p>
        <p className="max-w-xs text-xs text-muted-foreground" data-testid="text-empty-description">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction} data-testid="button-empty-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
