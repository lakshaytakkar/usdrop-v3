import { type ReactNode, type CSSProperties } from "react";
import {
  motion,
  AnimatePresence,
  type Transition,
  type Variants,
} from "motion/react";

const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
};

type Direction = "up" | "down" | "left" | "right";

interface FadeProps {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
}

const directionOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
  }
};

export function Fade({
  children,
  direction,
  distance = 12,
  delay = 0,
  duration,
  transition,
  className,
  style,
}: FadeProps) {
  const offset = direction ? directionOffset(direction, distance) : {};

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ ...defaultTransition, delay, ...(duration ? { duration } : {}), ...transition }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface ScaleProps {
  children: ReactNode;
  initialScale?: number;
  delay?: number;
  duration?: number;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
}

export function Scale({
  children,
  initialScale = 0.95,
  delay = 0,
  duration,
  transition,
  className,
  style,
}: ScaleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...defaultTransition, delay, ...(duration ? { duration } : {}), ...transition }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = (staggerInterval: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerInterval,
      delayChildren: delay,
    },
  },
});

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
};

interface StaggerProps {
  children: ReactNode;
  staggerInterval?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export function Stagger({
  children,
  staggerInterval = 0.05,
  delay = 0,
  className,
  style,
}: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer(staggerInterval, delay)}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div variants={staggerItem} className={className} style={style}>
      {children}
    </motion.div>
  );
}

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PageTransition({ children, className, style }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedList({
  children,
  staggerInterval = 0.03,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode[];
  staggerInterval?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      variants={staggerContainer(staggerInterval, delay)}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export { AnimatePresence, motion };
