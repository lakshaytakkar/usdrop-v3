# Responsive Design Rules

## Purpose
Standardized breakpoints, patterns, and rules for responsive design across USDrop.

---

## Breakpoints

### Tailwind Defaults (Use These)
| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops, small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Mobile-First Approach
```tsx
// Base styles = mobile
// Then add breakpoint modifiers
<div className="
  p-4           // Mobile: 16px padding
  md:p-6        // Tablet+: 24px padding
  lg:p-8        // Desktop+: 32px padding
">
```

---

## Layout Patterns

### Container
```tsx
// Standard container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

### Grid Patterns
```tsx
// 1 → 2 → 3 → 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// 1 → 2 columns (simpler)
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// Sidebar + Main (collapses on mobile)
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
```

### Stack to Row
```tsx
// Vertical on mobile, horizontal on desktop
<div className="flex flex-col md:flex-row gap-4">
```

---

## Component Responsive Rules

### Navigation
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Hamburger menu → slide-out drawer |
| Tablet | Collapsed icons or hamburger |
| Desktop | Full horizontal nav |

```tsx
// Mobile: hamburger
<div className="md:hidden">
  <HamburgerMenu />
</div>

// Desktop: full nav
<nav className="hidden md:flex">
  <NavLinks />
</nav>
```

### Sidebar
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Hidden or overlay drawer |
| Tablet | Collapsed icons (optional) |
| Desktop | Full sidebar visible |

```tsx
<aside className="
  fixed inset-y-0 left-0 z-50     // Position
  w-64                             // Width
  -translate-x-full lg:translate-x-0  // Hidden on mobile
  transition-transform             // Animate
">
```

### Cards
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full width, stacked |
| Tablet | 2 columns |
| Desktop | 3-4 columns |

### Tables
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Horizontal scroll OR card view |
| Tablet+ | Standard table |

```tsx
// Horizontal scroll approach
<div className="overflow-x-auto">
  <table className="min-w-full">
    ...
  </table>
</div>

// Card view on mobile
<div className="hidden md:block">
  <Table />
</div>
<div className="md:hidden">
  <CardList />
</div>
```

### Forms
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Single column, full-width inputs |
| Desktop | Multi-column where appropriate |

```tsx
<form className="space-y-4">
  {/* Always full width on mobile */}
  <input className="w-full" />

  {/* Side by side on desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input />
    <input />
  </div>
</form>
```

### Modals
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full screen or bottom sheet |
| Desktop | Centered modal |

```tsx
<Dialog className="
  fixed inset-0 md:inset-auto      // Full screen mobile
  md:top-1/2 md:left-1/2           // Centered desktop
  md:-translate-x-1/2 md:-translate-y-1/2
  md:max-w-lg md:rounded-lg
">
```

---

## Typography Scaling

```tsx
// Headings scale down on mobile
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">

// Body text stays consistent
<p className="text-base">  // 16px always

// Small text
<span className="text-sm"> // 14px always
```

### Minimum Readable Sizes
| Element | Min Size | Mobile | Desktop |
|---------|----------|--------|---------|
| Body text | 16px | `text-base` | `text-base` |
| Small text | 14px | `text-sm` | `text-sm` |
| Labels | 12px | `text-xs` | `text-xs` |
| H1 | 24px | `text-2xl` | `text-4xl` |
| H2 | 20px | `text-xl` | `text-2xl` |

---

## Touch Targets

### Minimum Sizes
| Element | Minimum | Tailwind |
|---------|---------|----------|
| Buttons | 44×44px | `min-h-[44px] min-w-[44px]` |
| Links | 44×44px tap area | `py-2 px-3` minimum |
| Icons | 44×44px tap area | Wrap in button with padding |
| Checkboxes | 44×44px | Use larger hit area |

### Spacing Between Targets
```tsx
// Enough space to avoid mis-taps
<div className="space-y-2">  // Minimum 8px between
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

---

## Hide/Show Utilities

```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="md:hidden">Mobile only</div>

// Hide on specific breakpoint only
<div className="hidden lg:block xl:hidden">Large only</div>
```

---

## Testing Checklist

### For Every Component
- [ ] No horizontal scroll at any breakpoint
- [ ] Text is readable (min 16px body)
- [ ] Touch targets are 44px minimum
- [ ] Content doesn't overlap
- [ ] Images scale appropriately
- [ ] Forms are usable on mobile

### Breakpoints to Test
- [ ] 320px (small phone)
- [ ] 375px (iPhone)
- [ ] 768px (tablet)
- [ ] 1024px (laptop)
- [ ] 1440px (desktop)

---

## Constraints

### DO
- Design mobile-first, enhance for larger screens
- Use Tailwind's responsive prefixes consistently
- Test on real devices, not just browser resize
- Ensure touch targets are adequate

### DON'T
- Hide critical functionality on mobile
- Use fixed widths that break on small screens
- Forget to test landscape orientation
- Assume hover states work on touch devices

---

## References
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- [COMPONENT_PATTERNS.md](../code/COMPONENT_PATTERNS.md)
