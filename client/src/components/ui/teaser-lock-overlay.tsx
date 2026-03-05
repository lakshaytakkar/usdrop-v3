import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TeaserLockOverlayProps {
  message?: string;
  ctaText?: string;
  onUpgrade?: () => void;
  className?: string;
}

export function TeaserLockOverlay({
  message = "Upgrade your plan to unlock all content",
  ctaText = "Upgrade Now",
  onUpgrade,
  className,
}: TeaserLockOverlayProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 py-16 px-8",
        "bg-gradient-to-t from-background via-background/95 to-transparent",
        className
      )}
      data-testid="teaser-lock-overlay"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Lock className="size-6 text-primary" />
      </div>
      <p className="text-center text-sm text-muted-foreground max-w-sm">
        {message}
      </p>
      {onUpgrade && (
        <Button onClick={onUpgrade} data-testid="button-upgrade-teaser">
          {ctaText}
        </Button>
      )}
    </div>
  );
}

interface TeaserItemOverlayProps {
  children: React.ReactNode;
  locked?: boolean;
}

export function TeaserItemOverlay({ children, locked = false }: TeaserItemOverlayProps) {
  if (!locked) return <>{children}</>;

  return (
    <div className="relative select-none" data-testid="teaser-item-locked">
      <div className="blur-sm pointer-events-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm border">
          <Lock className="size-3" />
          Pro
        </div>
      </div>
    </div>
  );
}
