# Animation Standards & Guidelines

This document outlines the standardized animation system using Motion Primitives for consistent micro-interactions, hover effects, and scroll animations across the application.

## Table of Contents

1. [Overview](#overview)
2. [Animation Principles](#animation-principles)
3. [Component Usage](#component-usage)
4. [Context-Based Rules](#context-based-rules)
5. [Performance Considerations](#performance-considerations)
6. [Accessibility](#accessibility)
7. [Standard Patterns](#standard-patterns)

## Overview

We use **Motion Primitives** (`motion/react`) as our animation library for all motion effects. This ensures consistency, performance, and accessibility across the application.

### Key Files

- **Constants**: `src/lib/motion/constants.ts` - Standard timing, easing, and distance values
- **Variants**: `src/lib/motion/variants.ts` - Predefined animation variants
- **Hover Utilities**: `src/lib/motion/hover.ts` - Standardized hover effects
- **Components**: `src/components/motion/` - Reusable motion components

## Animation Principles

### 1. Subtlety First
Animations should enhance the user experience without being distracting. Keep them subtle and purposeful.

### 2. Performance
- Always use `transform` and `opacity` properties (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes layout reflow)
- Keep animation durations short (0.2-0.5s for most interactions)

### 3. Consistency
- Use standardized timing values from `constants.ts`
- Follow context-based rules for different page types
- Maintain consistent hover effects across similar components

### 4. Accessibility
- Always respect `prefers-reduced-motion`
- Provide alternative feedback for users who disable animations
- Ensure animations don't interfere with focus indicators

## Component Usage

### MotionCard

Standardized card component with hover effects.

```tsx
import { MotionCard } from "@/components/motion/MotionCard"

<MotionCard
  hoverLift={true}
  hoverShadow={true}
  hoverScale={1.02}
  delay={0.1}
  className="rounded-xl border bg-card p-6"
>
  {/* Card content */}
</MotionCard>
```

**Props:**
- `hoverLift` (boolean): Enable lift effect on hover (default: true)
- `hoverShadow` (boolean): Enable shadow enhancement (default: true)
- `hoverScale` (number): Scale factor on hover (default: 1.02)
- `delay` (number): Animation delay in seconds (default: 0)
- `reducedMotion` (boolean): Override reduced motion detection

### MotionFadeIn

Scroll-triggered fade-in component.

```tsx
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"

<MotionFadeIn
  direction="up"
  distance={16}
  duration={0.3}
  delay={0.1}
  once={true}
>
  {/* Content */}
</MotionFadeIn>
```

**Props:**
- `direction` ("up" | "down" | "left" | "right" | "none"): Animation direction
- `distance` (number): Distance to animate from in pixels (default: 16)
- `duration` (number): Animation duration in seconds (default: 0.3)
- `delay` (number): Animation delay in seconds (default: 0)
- `once` (boolean): Animate only once (default: true)

### MotionStagger

Container for staggered animations.

```tsx
import { MotionStagger } from "@/components/motion/MotionStagger"

<MotionStagger staggerDelay={0.1}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</MotionStagger>
```

**Props:**
- `staggerDelay` (number): Delay between each child (default: 0.1s)
- `once` (boolean): Animate only once (default: true)

### MotionImage

Image wrapper with hover effects.

```tsx
import { MotionImage } from "@/components/motion/MotionImage"

<MotionImage
  src="/image.png"
  alt="Description"
  width={64}
  height={64}
  hoverScale={1.05}
  className="object-contain"
/>
```

**Props:**
- `hoverScale` (number): Scale factor on hover (default: 1.05)
- `hoverOpacity` (boolean): Enable opacity change (default: false)

## Context-Based Rules

### Dashboard/Home Pages
- **Duration**: 0.2-0.3s (subtle, professional)
- **Easing**: `easeOut`
- **Distance**: 8-16px
- **Use Cases**: Card hovers, section reveals, loading states

### Landing Pages
- **Duration**: 0.3-0.5s (more dynamic, attention-grabbing)
- **Easing**: `easeOutExpo`
- **Distance**: 16-32px
- **Use Cases**: Hero animations, feature reveals, CTA highlights

### Forms
- **Duration**: 0.15-0.2s (minimal, functional)
- **Easing**: `easeOut`
- **Distance**: 4-8px
- **Use Cases**: Input focus, validation feedback, error states

### Data Tables
- **Duration**: 0.1-0.2s (very subtle)
- **Easing**: `easeOut`
- **Distance**: 4-8px
- **Use Cases**: Row hovers, sort indicators, pagination

## Performance Considerations

### Best Practices

1. **Use Transform & Opacity**
   ```tsx
   // ✅ Good - GPU accelerated
   { transform: "translateY(-4px)", opacity: 0.9 }
   
   // ❌ Bad - Causes layout reflow
   { top: "-4px", height: "100px" }
   ```

2. **Limit Simultaneous Animations**
   - Avoid animating more than 20-30 elements simultaneously
   - Use `staggerDelay` to spread animations over time

3. **Lazy Load Heavy Animations**
   - Use `once={true}` for scroll-triggered animations
   - Consider `IntersectionObserver` for complex animations

4. **Optimize Re-renders**
   - Use `useMemo` for animation variants
   - Avoid creating new objects in render functions

### Performance Monitoring

- Target: 60fps for all animations
- Use browser DevTools Performance tab to identify bottlenecks
- Test on lower-end devices

## Accessibility

### Prefers-Reduced-Motion

All motion components automatically detect and respect `prefers-reduced-motion`. You can also manually override:

```tsx
<MotionCard reducedMotion={true}>
  {/* No animations */}
</MotionCard>
```

### Focus Indicators

Animations should never interfere with focus indicators. Ensure:
- Focus states remain visible during animations
- Keyboard navigation works smoothly
- Screen readers can access animated content

### Alternative Feedback

For users with reduced motion, provide alternative feedback:
- Color changes instead of animations
- Static states that convey the same information
- Text labels for icon-only interactions

## Standard Patterns

### Cards

**Pattern**: Lift + Shadow + Scale
```tsx
<MotionCard hoverLift hoverShadow hoverScale={1.02}>
  {/* Card content */}
</MotionCard>
```

### Buttons

**Pattern**: Scale + Glow
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
  Click me
</motion.button>
```

### Images

**Pattern**: Scale + Opacity
```tsx
<MotionImage
  hoverScale={1.05}
  hoverOpacity={false}
  src="..."
/>
```

### Lists

**Pattern**: Stagger Fade-In
```tsx
<MotionStagger staggerDelay={0.1}>
  {items.map(item => <Item key={item.id} />)}
</MotionStagger>
```

### Modals

**Pattern**: Scale + Fade
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
>
  {/* Modal content */}
</motion.div>
```

### Loading States

**Pattern**: Subtle Pulse or Skeleton
```tsx
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  Loading...
</motion.div>
```

## Constants Reference

### Durations
- `DURATION.fast`: 0.2s
- `DURATION.normal`: 0.3s
- `DURATION.slow`: 0.5s
- `DURATION.slower`: 0.7s

### Distances
- `DISTANCE.sm`: 8px
- `DISTANCE.md`: 16px
- `DISTANCE.lg`: 24px
- `DISTANCE.xl`: 32px

### Easing Functions
- `EASING.easeOut`: [0, 0, 0.2, 1]
- `EASING.easeOutExpo`: [0.16, 1, 0.3, 1]
- `EASING.spring`: [0.34, 1.56, 0.64, 1]

## Migration from Framer Motion

When migrating existing Framer Motion code:

1. Replace `framer-motion` imports with `motion/react`
2. Update component usage to use our standardized components
3. Replace custom variants with predefined ones from `variants.ts`
4. Test with `prefers-reduced-motion` enabled

## Examples

See the home page (`src/app/home/page.tsx`) for a complete implementation example using all motion components.

## Questions?

For questions or suggestions about animation standards, please refer to the main project documentation or contact the development team.



