

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { motion, AnimatePresence, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

// Context for expandable state
interface ExpandableContextValue {
  isExpanded: boolean
  toggle: () => void
  expand: () => void
  collapse: () => void
}

const ExpandableContext = createContext<ExpandableContextValue | null>(null)

const useExpandable = () => {
  const context = useContext(ExpandableContext)
  if (!context) {
    throw new Error("Expandable components must be used within an Expandable provider")
  }
  return context
}

// Main Expandable Component
interface ExpandableProps {
  children: (props: { isExpanded: boolean }) => ReactNode
  expandDirection?: "both" | "down" | "up" | "left" | "right"
  expandBehavior?: "replace" | "push"
  initialDelay?: number
  onExpandStart?: () => void
  onExpandEnd?: () => void
  onCollapseStart?: () => void
  onCollapseEnd?: () => void
  defaultExpanded?: boolean
}

export function Expandable({
  children,
  expandDirection = "both",
  expandBehavior = "replace",
  initialDelay = 0,
  onExpandStart,
  onExpandEnd,
  onCollapseStart,
  onCollapseEnd,
  defaultExpanded = false,
}: ExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [isAnimating, setIsAnimating] = useState(false)

  const expand = useCallback(() => {
    if (isExpanded || isAnimating) return
    setIsAnimating(true)
    onExpandStart?.()
    
    setTimeout(() => {
      setIsExpanded(true)
      setTimeout(() => {
        setIsAnimating(false)
        onExpandEnd?.()
      }, initialDelay)
    }, initialDelay)
  }, [isExpanded, isAnimating, initialDelay, onExpandStart, onExpandEnd])

  const collapse = useCallback(() => {
    if (!isExpanded || isAnimating) return
    setIsAnimating(true)
    onCollapseStart?.()
    
    setTimeout(() => {
      setIsExpanded(false)
      setTimeout(() => {
        setIsAnimating(false)
        onCollapseEnd?.()
      }, initialDelay)
    }, initialDelay)
  }, [isExpanded, isAnimating, initialDelay, onCollapseStart, onCollapseEnd])

  const toggle = useCallback(() => {
    if (isExpanded) {
      collapse()
    } else {
      expand()
    }
  }, [isExpanded, expand, collapse])

  const value: ExpandableContextValue = {
    isExpanded,
    toggle,
    expand,
    collapse,
  }

  return (
    <ExpandableContext.Provider value={value}>
      {children({ isExpanded })}
    </ExpandableContext.Provider>
  )
}

// ExpandableTrigger Component
interface ExpandableTriggerProps {
  children: ReactNode
  className?: string
  asChild?: boolean
}

export function ExpandableTrigger({ children, className, asChild }: ExpandableTriggerProps) {
  const { toggle } = useExpandable()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  if (asChild && React.isValidElement<{ onClick?: (e: React.MouseEvent) => void; className?: string }>(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        handleClick(e)
        if (children.props.onClick) {
          children.props.onClick(e)
        }
      },
      className: cn(children.props.className, className),
    })
  }

  return (
    <div onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  )
}

// ExpandableCard Component
interface ExpandableCardProps {
  children: ReactNode
  className?: string
  collapsedSize?: { width?: number | string; height?: number | string }
  expandedSize?: { width?: number | string; height?: number | string }
  hoverToExpand?: boolean
  expandDelay?: number
  collapseDelay?: number
}

export function ExpandableCard({
  children,
  className,
  collapsedSize,
  expandedSize,
  hoverToExpand = false,
  expandDelay = 0,
  collapseDelay = 0,
}: ExpandableCardProps) {
  const { isExpanded } = useExpandable()

  const delay = isExpanded ? expandDelay : collapseDelay

  const getSizeValue = (size: number | string | undefined): string | undefined => {
    if (size === undefined) return undefined
    if (size === "auto") return "auto"
    return typeof size === "number" ? `${size}px` : size
  }

  const currentSize = isExpanded ? expandedSize : collapsedSize
  const width = getSizeValue(currentSize?.width)
  const height = getSizeValue(currentSize?.height)

  // Only apply height transition if it's not "auto"
  const heightTransition = height !== "auto" 
    ? `height ${delay}ms cubic-bezier(0.4, 0, 0.2, 1)` 
    : undefined

  const style: React.CSSProperties = {
    ...(width && { width }),
    ...(height && { height }),
    ...(width && {
      transition: `width ${delay}ms cubic-bezier(0.4, 0, 0.2, 1)${heightTransition ? `, ${heightTransition}` : ""}`,
    }),
    ...(heightTransition && !width && {
      transition: heightTransition,
    }),
  }

  return (
    <div className={cn("relative", className)} style={style}>
      {children}
    </div>
  )
}

// ExpandableCardHeader Component
export function ExpandableCardHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("p-4", className)}>{children}</div>
}

// ExpandableCardContent Component
export function ExpandableCardContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("p-4", className)}>{children}</div>
}

// ExpandableCardFooter Component
export function ExpandableCardFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("p-4 border-t", className)}>{children}</div>
}

// Animation presets
const animationPresets: Record<string, Variants> = {
  "fade": {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "blur-sm": {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
  },
  "blur-md": {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
}

// ExpandableContent Component
interface ExpandableContentProps {
  children: ReactNode
  className?: string
  preset?: "fade" | "blur-sm" | "blur-md" | "slide-up" | "slide-down"
  keepMounted?: boolean
  stagger?: boolean
  staggerChildren?: number
  animateIn?: {
    initial?: Record<string, any>
    animate?: Record<string, any>
    transition?: Record<string, any>
  }
}

export function ExpandableContent({
  children,
  className,
  preset = "fade",
  keepMounted = false,
  stagger = false,
  staggerChildren = 0.1,
  animateIn,
}: ExpandableContentProps) {
  const { isExpanded } = useExpandable()

  const variants: Variants = animateIn
    ? {
        initial: animateIn.initial || { opacity: 0 },
        animate: animateIn.animate || { opacity: 1 },
        exit: { opacity: 0 },
      }
    : animationPresets[preset] || animationPresets.fade

  const transitionConfig = animateIn?.transition || { duration: 0.3 }

  if (!isExpanded && !keepMounted) {
    return null
  }

  if (stagger && React.Children.count(children) > 1) {
    return (
      <AnimatePresence mode="wait">
        {isExpanded && (
          <div className={className}>
            {React.Children.map(children, (child, index) => (
              <motion.div
                key={index}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  ...transitionConfig,
                  delay: index * staggerChildren,
                }}
              >
                {child}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isExpanded && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitionConfig}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

