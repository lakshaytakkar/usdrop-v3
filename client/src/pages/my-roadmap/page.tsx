

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { journeyStages } from "@/data/journey-stages";
import { useAuth } from "@/contexts/auth-context";
import {
  Rocket,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

type TaskStatus = "not_started" | "in_progress" | "completed";

const STATUS_OPTIONS: { value: TaskStatus; label: string; dotClass: string; bgClass: string; textClass: string }[] = [
  { value: "not_started", label: "Not Started", dotClass: "bg-red-500", bgClass: "bg-red-50 border-red-200 hover:bg-red-100", textClass: "text-red-700" },
  { value: "in_progress", label: "In Progress", dotClass: "bg-yellow-500", bgClass: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100", textClass: "text-yellow-700" },
  { value: "completed", label: "Completed", dotClass: "bg-green-500", bgClass: "bg-green-50 border-green-200 hover:bg-green-100", textClass: "text-green-700" },
];

export default function MyJourneyPage() {
  const { user, loading: authLoading } = useAuth()
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(journeyStages.map(s => s.id)));
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
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

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdownId]);

  const getTaskStatus = useCallback((taskId: string): TaskStatus => {
    return taskStatuses[taskId] || "not_started";
  }, [taskStatuses]);

  const setTaskStatus = async (taskId: string, status: TaskStatus) => {
    setTaskStatuses(prev => ({ ...prev, [taskId]: status }));
    setOpenDropdownId(null);

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

  const getStatusOption = (status: TaskStatus) => STATUS_OPTIONS.find(o => o.value === status)!;

  if (isLoading) {
    return (
      <>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg bg-white p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 min-h-0 relative">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {journeyStages.map((stage) => {
            const stats = getStageStats(stage.id);
            const isExpanded = expandedStages.has(stage.id);
            const stageProgress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
            const isStageCompleted = stageProgress === 100;

            return (
              <div key={stage.id} className="border rounded-lg bg-white overflow-hidden self-start">
                <button
                  onClick={() => toggleStage(stage.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer transition-colors",
                    isStageCompleted ? "bg-green-50" : "hover:bg-gray-50"
                  )}
                >
                  <ChevronRight className={cn("h-3.5 w-3.5 text-gray-400 transition-transform shrink-0", isExpanded && "rotate-90")} />

                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    isStageCompleted ? "bg-green-500 text-white" : "bg-indigo-100 text-indigo-700"
                  )}>
                    {stage.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-medium text-gray-400 uppercase leading-none">{stage.phase}</span>
                    <h3 className="text-xs font-semibold text-gray-900 truncate leading-tight">Stage {stage.number}: {stage.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-[10px]">
                      {stats.completed > 0 && (
                        <span className="flex items-center gap-0.5 text-green-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {stats.completed}
                        </span>
                      )}
                      {stats.inProgress > 0 && (
                        <span className="flex items-center gap-0.5 text-yellow-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          {stats.inProgress}
                        </span>
                      )}
                      {stats.notStarted > 0 && (
                        <span className="flex items-center gap-0.5 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {stats.notStarted}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-500">{stats.completed}/{stats.total}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t">
                    <div className="divide-y">
                      {stage.tasks.map((task) => {
                        const status = getTaskStatus(task.id);
                        const statusOption = getStatusOption(status);
                        const isDropdownOpen = openDropdownId === task.id;

                        return (
                          <div
                            key={task.id}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 text-xs",
                              status === "completed" ? "bg-green-50/50" : status === "in_progress" ? "bg-yellow-50/30" : ""
                            )}
                          >
                            <span className="text-gray-400 font-mono text-[10px] w-5 shrink-0">{task.taskNo}</span>
                            <span className="flex-1 min-w-0 truncate">
                              {task.link ? (
                                <Link href={task.link} className="text-gray-900 hover:text-indigo-600 transition-colors">
                                  {task.title}
                                </Link>
                              ) : (
                                <span className={cn(
                                  "text-gray-900",
                                  status === "completed" && "line-through text-gray-500"
                                )}>
                                  {task.title}
                                </span>
                              )}
                            </span>
                            <div className="relative shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(isDropdownOpen ? null : task.id);
                                }}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium cursor-pointer transition-colors",
                                  statusOption.bgClass,
                                  statusOption.textClass
                                )}
                              >
                                <span className={cn("w-1.5 h-1.5 rounded-full", statusOption.dotClass)} />
                                {statusOption.label}
                                <ChevronDown className="h-2.5 w-2.5" />
                              </button>

                              {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                  {STATUS_OPTIONS.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTaskStatus(task.id, option.value);
                                      }}
                                      className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium w-full text-left hover:bg-gray-50 cursor-pointer transition-colors",
                                        status === option.value && "bg-gray-50"
                                      )}
                                    >
                                      <span className={cn("w-1.5 h-1.5 rounded-full", option.dotClass)} />
                                      <span className={option.textClass}>{option.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {stage.callout && (
                      <div className="px-3 py-2 bg-red-600 text-white text-center text-[10px] font-bold uppercase tracking-wider">
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
          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center">
            <Rocket className="h-12 w-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Congratulations! You've completed your roadmap!</h3>
            <p className="text-white/90">You're now ready to scale your dropshipping business to new heights.</p>
          </Card>
        )}

      </div>
    </>
  );
}
