import { type ReactNode } from "react";
import { PageTransition } from "@/components/ui/animated";
import { cn } from "@/lib/utils";

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PageTransition className={cn("px-6 py-6 lg:px-10 space-y-6", className)}>
      {children}
    </PageTransition>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between" data-testid="page-header">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground" data-testid="text-page-title">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground" data-testid="text-page-subtitle">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2" data-testid="page-header-actions">
          {actions}
        </div>
      )}
    </div>
  );
}

interface HeroBannerMetric {
  label: string;
  value: string | number;
}

interface HeroBannerProps {
  eyebrow: string;
  headline: string;
  tagline: string;
  color: string;
  colorDark: string;
  metrics?: HeroBannerMetric[];
  actions?: ReactNode;
}

export function HeroBanner({
  eyebrow,
  headline,
  tagline,
  color,
  colorDark,
  metrics,
  actions,
}: HeroBannerProps) {
  return (
    <div
      className="rounded-2xl px-8 py-7 text-white relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${colorDark} 100%)` }}
      data-testid="section-hero-banner"
    >
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-75">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold font-heading tracking-tight">{headline}</h1>
        <p className="mt-1 text-sm opacity-75">{tagline}</p>
        {metrics && metrics.length > 0 && (
          <div className="mt-5 flex items-center gap-8">
            {metrics.map((m) => (
              <div key={m.label} data-testid={`metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs opacity-70">{m.label}</div>
              </div>
            ))}
          </div>
        )}
        {actions && <div className="mt-5 flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
}

export function StatCard({ label, value, trend, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div
      className="group rounded-lg border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      data-testid={`card-stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold font-heading tracking-tight">{value}</span>
          {trend && <span className="text-xs font-medium text-muted-foreground">{trend}</span>}
        </div>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
          style={{ backgroundColor: iconBg || "rgba(59, 130, 246, 0.1)", color: iconColor || "#3b82f6" }}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="stat-grid">
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  noPadding,
  actions,
}: {
  title: string;
  children: ReactNode;
  noPadding?: boolean;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-background" data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <h3 className="text-sm font-semibold font-heading">{title}</h3>
        {actions}
      </div>
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}

export function SectionGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{children}</div>
  );
}

export function InfoRow({ label, value, children }: { label: string; value?: string | number; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5" data-testid={`info-row-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      {children ?? <span className="text-sm font-medium">{value}</span>}
    </div>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-background">
      <div className="border-b px-5 py-3.5">
        <h3 className="text-sm font-semibold font-heading">{title}</h3>
      </div>
      <div className="divide-y px-5">{children}</div>
    </div>
  );
}
