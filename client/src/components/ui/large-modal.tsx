

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LargeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string | React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  maxWidth?: string
}

export function LargeModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
  maxWidth = '90vw',
}: LargeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[90vw] w-full max-h-[90vh] overflow-hidden flex flex-col p-0',
          className
        )}
        style={{ maxWidth }}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0 px-6 py-4">
          {children}
        </div>

        {footer && (
          <DialogFooter className="px-6 py-4 border-t shrink-0">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

