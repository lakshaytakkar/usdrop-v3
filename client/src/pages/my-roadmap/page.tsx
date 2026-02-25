

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { journeyStages } from "@/data/journey-stages";
import { useAuth } from "@/contexts/auth-context";
import {
  ChevronRight,
} from "lucide-react";
import { FrameworkBanner } from "@/components/framework-banner";
import { Link } from "wouter";

type TaskStatus = "not_started" | "in_progress" | "completed";

export default function MyJourneyPage() {
  const { user, loading: authLoading } = useAuth()
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(journeyStages.map(s => s.id)));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    const fetchProgress = async () => {
      try {
        const res = await apiFetch("/api/roadmap-progress", { credentials: 'include' })
        if (res.ok && !cancelled) {
          const data = await res.json()
          setTaskStatuses(data.statuses || {})
        }
      } catch (error) {
        console.error('Failed to load roadmap progress:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchProgress()

    return () => { cancelled = true }
  }, [authLoading, user]);

  const getTaskStatus = useCallback((taskId: string): TaskStatus => {
    return taskStatuses[taskId] || "not_started";
  }, [taskStatuses]);

  const setTaskStatus = async (taskId: string, status: TaskStatus) => {
    setTaskStatuses(prev => ({ ...prev, [taskId]: status }));
    try {
      await apiFetch("/api/roadmap-progress", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ taskId, status }),
      })
    } catch (error) {
      console.error('Failed to save roadmap progress:', error)
    }
  };

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  };

  const totalTasks = journeyStages.reduce((sum, stage) => sum + stage.tasks.length, 0);
  const completedCount = Object.values(taskStatuses).filter(s => s === "completed").length;
  const inProgressCount = Object.values(taskStatuses).filter(s => s === "in_progress").length;
  const overallProgress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const getStageStats = (stageId: string) => {
    const stage = journeyStages.find(s => s.id === stageId);
    if (!stage) return { completed: 0, inProgress: 0, notStarted: 0, total: 0 };
    const completed = stage.tasks.filter(t => getTaskStatus(t.id) === "completed").length;
    const inProgress = stage.tasks.filter(t => getTaskStatus(t.id) === "in_progress").length;
    return { completed, inProgress, notStarted: stage.tasks.length - completed - inProgress, total: stage.tasks.length };
  };

  if (isLoading) {
    return (
      <div className="px-12 md:px-20 lg:px-32 py-8 max-w-[1200px] mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-xl bg-white p-5 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2" data-testid="page-my-roadmap">
      <FrameworkBanner
        title="My Roadmap"
        description="Track your progress through the dropshipping journey"
        iconSrc="/images/banners/3d-roadmap.png"
        onTutorialClick={() => {}}
      />
      <div>
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[13px]">
            <span className="flex items-center gap-1.5 text-green-600" data-testid="text-completed-count"><span className="w-2 h-2 rounded-full bg-green-500" />{completedCount} completed</span>
            <span className="flex items-center gap-1.5 text-yellow-600" data-testid="text-inprogress-count"><span className="w-2 h-2 rounded-full bg-yellow-500" />{inProgressCount} in progress</span>
            <span className="flex items-center gap-1.5 text-[#999]" data-testid="text-remaining-count"><span className="w-2 h-2 rounded-full bg-gray-300" />{totalTasks - completedCount - inProgressCount} remaining</span>
          </div>
          <span className="text-[13px] font-bold text-black" data-testid="text-overall-progress">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex" data-testid="progress-bar-overall">
          {completedCount > 0 && (
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(completedCount / totalTasks) * 100}%` }}
            />
          )}
          {inProgressCount > 0 && (
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${(inProgressCount / totalTasks) * 100}%` }}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {journeyStages.map((stage) => {
          const stats = getStageStats(stage.id);
          const isExpanded = expandedStages.has(stage.id);
          const stageProgress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
          const isStageCompleted = stageProgress === 100;

          return (
            <div key={stage.id} className="border rounded-xl bg-white overflow-hidden self-start">
              <button
                onClick={() => toggleStage(stage.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer transition-colors",
                  isStageCompleted ? "bg-green-50" : "hover:bg-gray-50"
                )}
              >
                <ChevronRight className={cn("h-4 w-4 text-gray-400 transition-transform shrink-0", isExpanded && "rotate-90")} />

                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  isStageCompleted ? "bg-green-500 text-white" : "bg-indigo-100 text-indigo-700"
                )}>
                  {stage.number}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-gray-400 uppercase leading-none">{stage.phase}</span>
                  <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">Stage {stage.number}: {stage.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs">
                    {stats.completed > 0 && (
                      <span className="flex items-center gap-0.5 text-green-600">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        {stats.completed}
                      </span>
                    )}
                    {stats.inProgress > 0 && (
                      <span className="flex items-center gap-0.5 text-yellow-600">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        {stats.inProgress}
                      </span>
                    )}
                    {stats.notStarted > 0 && (
                      <span className="flex items-center gap-0.5 text-red-600">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        {stats.notStarted}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-500">{stats.completed}/{stats.total}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t">
                  <div className="divide-y">
                    {stage.tasks.map((task) => {
                      const status = getTaskStatus(task.id);
                      const isCompleted = status === "completed";

                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm",
                            isCompleted ? "bg-green-50/50" : status === "in_progress" ? "bg-yellow-50/30" : ""
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => {
                              setTaskStatus(task.id, isCompleted ? "not_started" : "completed");
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0 accent-blue-600"
                            data-testid={`checkbox-task-${task.id}`}
                          />
                          <span className="text-gray-400 font-mono text-xs w-5 shrink-0">{task.taskNo}</span>
                          <span className="flex-1 min-w-0 truncate">
                            {task.link ? (
                              <Link href={task.link} className="text-gray-900 hover:text-indigo-600 transition-colors">
                                {task.title}
                              </Link>
                            ) : (
                              <span className={cn(
                                "text-gray-900",
                                isCompleted && "line-through text-gray-500"
                              )}>
                                {task.title}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {stage.callout && (
                    <div className="px-4 py-2.5 bg-red-600 text-white text-center text-xs font-bold uppercase tracking-wider">
                      {stage.callout}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {overallProgress === 100 && (
        <Card className="p-8 mt-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center">
          <ChevronRight className="h-14 w-14 mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-2">Congratulations! You've completed your roadmap!</h3>
          <p className="text-white/90 text-base">You're now ready to scale your dropshipping business to new heights.</p>
        </Card>
      )}

      </div>
    </div>
  );
}
