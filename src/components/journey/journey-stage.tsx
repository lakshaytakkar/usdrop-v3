"use client"

import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { JourneyStage as JourneyStageType } from '@/data/journey-stages';

interface JourneyStageProps {
  stage: JourneyStageType;
  completedTasks: Set<string>;
  onTaskToggle: (taskId: string) => void;
  isLast?: boolean;
}

export function JourneyStage({ stage, completedTasks, onTaskToggle, isLast = false }: JourneyStageProps) {
  const completedCount = stage.tasks.filter(task => completedTasks.has(task.id)).length;
  const progressPercentage = stage.tasks.length > 0 ? (completedCount / stage.tasks.length) * 100 : 0;
  const isCompleted = progressPercentage === 100;
  const isInProgress = progressPercentage > 0 && progressPercentage < 100;

  return (
    <div className="relative">
      <Card className={cn(
        "transition-all duration-300 hover:shadow-sm h-full",
        isCompleted && "border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10",
        isInProgress && "border-blue-500/10 bg-blue-50/30 dark:bg-blue-950/5"
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Stage header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0 mt-0.5",
                  isCompleted 
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-blue-600 text-white" 
                    : isInProgress 
                    ? "bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-600" 
                    : "bg-background border-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{stage.number}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {stage.title}
                    </h3>
                    {isCompleted && (
                      <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                        Done
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {stage.description}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-foreground">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {completedCount}/{stage.tasks.length}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 ease-out",
                  isCompleted ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" : isInProgress ? "bg-gradient-to-r from-blue-600/70 via-blue-500/70 to-blue-600/70" : "bg-muted"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Tasks checklist */}
            <div className="space-y-1.5 pt-1">
              {stage.tasks.map((task) => {
                const isTaskCompleted = completedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                      className={cn(
                        "flex items-center justify-between gap-2 p-2 rounded transition-all duration-200",
                        isTaskCompleted 
                          ? "bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200/50 dark:border-blue-800/50" 
                          : "bg-muted/30 hover:bg-muted/50"
                      )}
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="mt-0.5 flex-shrink-0 [&>button[data-state=checked]]:bg-gradient-to-r [&>button[data-state=checked]]:from-blue-600 [&>button[data-state=checked]]:via-blue-500 [&>button[data-state=checked]]:to-blue-600 [&>button[data-state=checked]]:border-blue-600">
                        <Checkbox
                          id={task.id}
                          checked={isTaskCompleted}
                          onCheckedChange={() => onTaskToggle(task.id)}
                          className="h-3.5 w-3.5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={task.id}
                          className={cn(
                            "text-xs font-medium cursor-pointer block",
                            isTaskCompleted 
                              ? "text-muted-foreground line-through" 
                              : "text-foreground"
                          )}
                        >
                          {task.title}
                        </label>
                        {task.description && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {task.link && (
                      <Link href={task.link} target={task.link.startsWith('http') ? '_blank' : undefined}>
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs flex-shrink-0 bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

