"use client"

import React from 'react';
import { JourneyStage } from './journey-stage';
import type { JourneyStage as JourneyStageType } from '@/data/journey-stages';

interface TimelineProps {
  stages: JourneyStageType[];
  completedTasks: Set<string>;
  onTaskToggle: (taskId: string) => void;
}

export function Timeline({ stages, completedTasks, onTaskToggle }: TimelineProps) {
  const totalTasks = stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
  const completedTasksCount = completedTasks.size;
  const overallProgress = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  return (
    <div className="w-full">
      {/* Overall progress header */}
      <div className="mb-4 p-4 bg-card border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Journey Progress</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(overallProgress)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {completedTasksCount}/{totalTasks} tasks
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Timeline stages - 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stages.map((stage, index) => (
          <JourneyStage
            key={stage.id}
            stage={stage}
            completedTasks={completedTasks}
            onTaskToggle={onTaskToggle}
            isLast={false}
          />
        ))}
      </div>
    </div>
  );
}

