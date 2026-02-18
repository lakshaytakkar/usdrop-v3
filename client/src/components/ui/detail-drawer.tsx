

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DetailDrawerTab {
  value: string
  label: string
  content: React.ReactNode
}

interface DetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  tabs: DetailDrawerTab[]
  defaultTab?: string
  headerActions?: React.ReactNode
  className?: string
}

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  tabs,
  defaultTab,
  headerActions,
  className,
}: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || '')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn('w-full sm:max-w-2xl overflow-hidden flex flex-col p-0', className)}>
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">{title}</SheetTitle>
            {headerActions && (
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="shrink-0 h-9 w-fit mx-6 mt-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0 space-y-4">
                  {tab.content}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

