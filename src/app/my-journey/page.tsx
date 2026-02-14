"use client"

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { journeyStages } from "@/data/journey-stages";
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay";
import {
  Check,
  ChevronRight,
  Rocket,
  Target,
  Trophy
} from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = 'usdrop-journey-completed-tasks';

export default function MyJourneyPage() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Load completed tasks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const taskIds = JSON.parse(stored) as string[];
          setCompletedTasks(new Set(taskIds));
        }
      } catch (error) {
        console.error('Failed to load journey progress:', error);
      }
    }
  }, []);

  // Save completed tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedTasks)));
      } catch (error) {
        console.error('Failed to save journey progress:', error);
      }
    }
  }, [completedTasks]);

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Calculate overall progress
  const totalTasks = journeyStages.reduce((sum, stage) => sum + stage.tasks.length, 0);
  const completedTasksCount = completedTasks.size;
  const overallProgress = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  // Find current stage (first incomplete stage)
  const currentStageIndex = journeyStages.findIndex(stage => {
    const stageCompleted = stage.tasks.every(task => completedTasks.has(task.id));
    return !stageCompleted;
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {/* Premium Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-purple-950 to-indigo-800 p-5 md:p-6 text-white h-[154px] flex-shrink-0">
            <div className="absolute inset-0 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, opacity: 0.5, mixBlendMode: 'overlay' }}></div>
            <div className="absolute inset-0 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`, opacity: 0.4, mixBlendMode: 'multiply' }}></div>
            <div className="absolute inset-0 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`, opacity: 0.3, mixBlendMode: 'screen' }}></div>
            <div className="absolute inset-0 z-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`, opacity: 0.6 }}></div>

            <div className="relative z-10 flex items-center gap-5 h-full">
              <img
                src="/3d-ecom-icons-blue/Rocket_Launch.png"
                alt="My Roadmap"
                width={120}
                height={120}
                className="w-[6rem] h-[6rem] md:w-[7rem] md:h-[7rem] flex-shrink-0 object-contain"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">My Roadmap</h2>
                <p className="text-white/80 text-sm leading-relaxed mb-2">
                  Your step-by-step guide to dropshipping success
                </p>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 transition-all duration-500 ease-out"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex-shrink-0 hidden sm:flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
                  <div className="text-xs text-white/70">Complete</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedTasksCount}/{totalTasks}</div>
                  <div className="text-xs text-white/70">Tasks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap Timeline */}
          <Accordion type="multiple" className="space-y-4">
            {journeyStages.map((stage, index) => {
              const stageCompletedCount = stage.tasks.filter(task => completedTasks.has(task.id)).length;
              const stageProgress = stage.tasks.length > 0 ? (stageCompletedCount / stage.tasks.length) * 100 : 0;
              const isStageCompleted = stageProgress === 100;
              const isCurrentStage = index === currentStageIndex;
              const isPastStage = currentStageIndex === -1 || index < currentStageIndex;

              return (
                <AccordionItem
                  key={stage.id}
                  value={stage.id}
                  className={cn(
                    "border rounded-xl overflow-hidden transition-all duration-300",
                    isStageCompleted && "bg-green-50/50 border-green-200"
                  )}
                >
                  <AccordionTrigger className={cn(
                    "p-4 hover:no-underline [&>svg]:ml-auto",
                    isStageCompleted ? "bg-green-100/50" : isCurrentStage ? "bg-indigo-50" : "bg-gray-50"
                  )}>
                    <div className="flex flex-col w-full pr-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          {/* Stage Number/Check */}
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                            isStageCompleted
                              ? "bg-green-500 text-white"
                              : isCurrentStage
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          )}>
                            {isStageCompleted ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              stage.number
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                              {isCurrentStage && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                  Current
                                </span>
                              )}
                              {isStageCompleted && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                                  <Trophy className="h-3 w-3" />
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{stage.description}</p>
                          </div>
                        </div>

                        {/* Stage Progress */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{Math.round(stageProgress)}%</div>
                          <div className="text-xs text-gray-500">{stageCompletedCount}/{stage.tasks.length} tasks</div>
                        </div>
                      </div>

                      {/* Stage Progress Bar */}
                      <div className="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500 ease-out rounded-full",
                            isStageCompleted
                              ? "bg-green-500"
                              : "bg-indigo-500"
                          )}
                          style={{ width: `${stageProgress}%` }}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    {/* Tasks List */}
                    <div className="p-4">
                      <div className="space-y-2">
                        {stage.tasks.map((task) => {
                          const isTaskCompleted = completedTasks.has(task.id);
                          return (
                            <div
                              key={task.id}
                              className={cn(
                                "flex items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200",
                                isTaskCompleted
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                              )}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Checkbox
                                  id={task.id}
                                  checked={isTaskCompleted}
                                  onCheckedChange={() => handleTaskToggle(task.id)}
                                  className={cn(
                                    "h-5 w-5",
                                    isTaskCompleted && "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <label
                                    htmlFor={task.id}
                                    className={cn(
                                      "text-sm font-medium cursor-pointer block",
                                      isTaskCompleted ? "text-gray-500 line-through" : "text-gray-900"
                                    )}
                                  >
                                    {task.title}
                                  </label>
                                  {task.description && (
                                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                                  )}
                                </div>
                              </div>

                              {task.link && (
                                <Link href={task.link}>
                                  <Button
                                    size="sm"
                                    variant={isTaskCompleted ? "outline" : "default"}
                                    className={cn(
                                      "h-8 text-xs",
                                      !isTaskCompleted && "bg-indigo-600 hover:bg-indigo-700"
                                    )}
                                  >
                                    {isTaskCompleted ? "Revisit" : "Start"}
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Completion Message */}
          {overallProgress === 100 && (
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center">
              <Rocket className="h-12 w-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Congratulations! You've completed your roadmap!</h3>
              <p className="text-white/90">You're now ready to scale your dropshipping business to new heights.</p>
            </Card>
          )}

          {/* Onboarding Progress Overlay */}
          <OnboardingProgressOverlay pageName="My Roadmap" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
