

import { apiFetch } from '@/lib/supabase'
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

async function fetchHistory(taskId: string) {
  const response = await apiFetch(`/api/dev/tasks/${taskId}/history`)
  if (!response.ok) {
    throw new Error("Failed to fetch history")
  }
  return response.json()
}

export function TaskHistory({ taskId }: { taskId: string }) {
  const { data: history, isLoading } = useQuery({
    queryKey: ["dev-task-history", taskId],
    queryFn: () => fetchHistory(taskId),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No history available yet. Changes to this task will appear here.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item: any) => (
        <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.changed_user?.avatar_url || undefined} alt={item.changed_user?.full_name || ''} />
            <AvatarFallback className="text-xs">
              {(item.changed_user?.full_name || item.changed_user?.email || 'U')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {item.changed_user?.full_name || item.changed_user?.email || "Unknown User"}
              </span>
              <span className="text-xs text-muted-foreground">
                changed {item.field_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {item.old_value && (
                <>
                  <Badge variant="outline" className="text-xs">
                    {item.old_value}
                  </Badge>
                  <span className="text-muted-foreground">→</span>
                </>
              )}
              {item.new_value && (
                <Badge variant="default" className="text-xs">
                  {item.new_value}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}




