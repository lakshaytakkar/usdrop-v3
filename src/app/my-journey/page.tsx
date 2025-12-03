"use client"

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { Timeline } from "@/components/journey/timeline";
import { journeyStages } from "@/data/journey-stages";

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col p-4 bg-gray-50/50 min-h-0">
          <Timeline
            stages={journeyStages}
            completedTasks={completedTasks}
            onTaskToggle={handleTaskToggle}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

