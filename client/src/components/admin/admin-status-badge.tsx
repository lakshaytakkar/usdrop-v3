import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType =
  | "active"
  | "inactive"
  | "suspended"
  | "trial"
  | "expired"
  | "pending"
  | "draft"
  | "published"
  | "connected"
  | "disconnected"
  | "syncing"
  | "error"
  | "verified"
  | "unverified"
  | "new_lead"
  | "engaged"
  | "pitched"
  | "converted"
  | "churned"
  | "low"
  | "medium"
  | "high"
  | "free"
  | "pro"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
  inactive: { label: "Inactive", className: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20" },
  suspended: { label: "Suspended", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
  trial: { label: "Trial", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
  expired: { label: "Expired", className: "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
  pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20" },
  draft: { label: "Draft", className: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20" },
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
  connected: { label: "Connected", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
  disconnected: { label: "Disconnected", className: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20" },
  syncing: { label: "Syncing", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
  error: { label: "Error", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
  verified: { label: "Verified", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
  unverified: { label: "Unverified", className: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20" },
  new_lead: { label: "New", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
  engaged: { label: "Engaged", className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20" },
  pitched: { label: "Pitched", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
  converted: { label: "Converted", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
  churned: { label: "Churned", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
  low: { label: "Low", className: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
  high: { label: "High", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
  free: { label: "Free", className: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20" },
  pro: { label: "Pro", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
}

interface AdminStatusBadgeProps {
  status: string
  label?: string
  size?: "sm" | "default"
  className?: string
  dot?: boolean
}

export function AdminStatusBadge({ status, label, size = "default", className, dot = false }: AdminStatusBadgeProps) {
  const config = statusConfig[status as StatusType] || {
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
    className: "bg-gray-50 text-gray-600 border-gray-200",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        config.className,
        size === "sm" && "text-[10px] px-1.5 py-0",
        className
      )}
      data-testid={`status-badge-${status}`}
    >
      {dot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5 inline-block",
          status === "active" || status === "connected" || status === "verified" || status === "published" || status === "converted"
            ? "bg-emerald-500"
            : status === "suspended" || status === "error" || status === "churned"
            ? "bg-red-500"
            : status === "trial" || status === "syncing" || status === "pending"
            ? "bg-amber-500"
            : "bg-gray-400"
        )} />
      )}
      {label || config.label}
    </Badge>
  )
}
