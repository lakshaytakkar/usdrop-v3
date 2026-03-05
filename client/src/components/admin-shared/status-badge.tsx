import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "success" | "error" | "warning" | "neutral" | "info";

const variantMap: Record<string, StatusVariant> = {
  Active: "success",
  active: "success",
  Inactive: "error",
  inactive: "error",
  Suspended: "error",
  suspended: "error",
  Pending: "warning",
  pending: "warning",
  Approved: "success",
  approved: "success",
  Rejected: "error",
  rejected: "error",
  Completed: "success",
  completed: "success",
  Published: "success",
  published: "success",
  Draft: "neutral",
  draft: "neutral",
  Archived: "neutral",
  archived: "neutral",
  Pro: "info",
  pro: "info",
  Free: "neutral",
  free: "neutral",
  Premium: "success",
  premium: "success",
  Enterprise: "info",
  enterprise: "info",
  Verified: "success",
  verified: "success",
  Unverified: "warning",
  unverified: "warning",
  Yes: "success",
  yes: "success",
  No: "neutral",
  no: "neutral",
  true: "success",
  false: "neutral",
  Connected: "success",
  connected: "success",
  Disconnected: "error",
  disconnected: "error",
  Syncing: "warning",
  syncing: "warning",
  Error: "error",
  error: "error",
  New: "info",
  new: "info",
  "In Progress": "info",
  "in-progress": "info",
  Contacted: "warning",
  contacted: "warning",
  Converted: "success",
  converted: "success",
  Lost: "error",
  lost: "error",
  High: "error",
  high: "error",
  Medium: "warning",
  medium: "warning",
  Low: "neutral",
  low: "neutral",
  admin: "info",
  super_admin: "success",
  editor: "warning",
  moderator: "neutral",
  Trending: "success",
  trending: "success",
};

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant || variantMap[status] || "neutral";
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0 text-xs font-medium px-2 py-0.5",
        variantStyles[resolvedVariant],
        className
      )}
      data-testid={`badge-status-${status.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {status}
    </Badge>
  );
}
