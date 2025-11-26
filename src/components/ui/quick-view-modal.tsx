'use client'

import { useEffect, useState, useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef?: React.RefObject<HTMLElement>
  children: React.ReactNode
  title?: string
  className?: string
}

export function QuickViewModal({
  open,
  onOpenChange,
  triggerRef,
  children,
  title,
  className,
}: QuickViewModalProps) {
  const [position, setPosition] = useState<{ top: number; left?: number; right?: number } | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !triggerRef?.current) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return

      requestAnimationFrame(() => {
        const triggerElement = triggerRef.current
        if (!triggerElement) return

        const rect = triggerElement.getBoundingClientRect()
        
        if (rect.width === 0 || rect.height === 0) {
          setTimeout(updatePosition, 50)
          return
        }

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const margin = 16
        const modalWidth = 280
        const modalHeight = 400
        const gap = 8

        let top = rect.bottom + gap
        let left: number | undefined = undefined
        let right: number | undefined = undefined

        const availableHeightBelow = viewportHeight - top - margin
        if (availableHeightBelow < modalHeight) {
          top = Math.max(margin, rect.top - modalHeight - gap)
        }

        if (top < margin) {
          top = margin
        }

        const leftAligned = rect.left
        const leftAlignedRightEdge = leftAligned + modalWidth

        if (leftAligned >= margin && leftAlignedRightEdge <= viewportWidth - margin) {
          left = leftAligned
        } else {
          const rightAligned = rect.right - modalWidth
          if (rightAligned >= margin && rect.right <= viewportWidth - margin) {
            left = rightAligned
          } else {
            const triggerCenter = rect.left + rect.width / 2
            const viewportCenter = viewportWidth / 2
            if (triggerCenter < viewportCenter) {
              left = margin
            } else {
              right = margin
            }
          }
        }

        if (left !== undefined) {
          if (left < margin) left = margin
          if (left + modalWidth > viewportWidth - margin) {
            right = margin
            left = undefined
          }
        }

        setPosition({ top, left, right })
      })
    }

    const timeoutId = setTimeout(updatePosition, 0)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, triggerRef])

  if (!open) return null

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Transparent overlay - doesn't darken screen */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-transparent pointer-events-none" />
        <DialogPrimitive.Content
          ref={contentRef}
          className={cn(
            'fixed z-50 flex flex-col overflow-hidden isolate p-0 bg-background border rounded-lg shadow-lg',
            className
          )}
          style={{
            top: position ? `${position.top}px` : '50%',
            ...(position?.left !== undefined ? { left: `${position.left}px`, right: 'auto', transform: 'none' } : {}),
            ...(position?.right !== undefined ? { right: `${position.right}px`, left: 'auto', transform: 'none' } : {}),
            width: '280px',
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: 'calc(100vh - 2rem)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault()
            onOpenChange(false)
          }}
        >
          <Card className="flex flex-col h-full overflow-hidden border-0 shadow-none">
            {title && (
              <div className="px-4 py-3 border-b shrink-0 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto min-h-0 p-4">
              {children}
            </div>
          </Card>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

