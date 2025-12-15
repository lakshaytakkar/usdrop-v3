# Design System - LLM Training Prompt

## Core Design Principles

**Spacing System**: Base unit is 4px (0.25rem). Use multiples: 8px (xs), 16px (sm), 24px (md), 32px (lg), 48px (xl), 64px (2xl), 96px (3xl).

**Border Radius**: 
- Buttons (sm/md): `rounded-full` (pill shape)
- Buttons (lg): `rounded-lg` (12px)
- Cards: `rounded-lg` (12px) or `rounded-xl` (16px)
- Inputs: `rounded-md` (8px) or `rounded-lg` (12px)
- Badges: `rounded-md` (8px) or `rounded-full`

**Cards**:
- Standard: `rounded-lg border border-slate-200 bg-white p-4 to p-6 shadow-md hover:shadow-lg`
- Padding: 16px-24px (p-4 to p-6)
- Spacing between: 16px-24px (gap-4 to gap-6)
- Structure: Header (optional) → Body → Footer (optional)

**Buttons**:
- Sizes: sm (`h-8 px-4 text-xs`), md (`h-10 px-6 py-2 text-sm`), lg (`h-12 px-8 text-base`)
- Shape: `rounded-full` for sm/md, `rounded-lg` for lg
- Variants:
  - Primary: `bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20`
  - Secondary: `bg-white text-slate-900 border border-slate-200 hover:border-blue-600`
  - Ghost: `hover:bg-slate-100 text-slate-600`
  - Outline: `border border-slate-300 bg-transparent hover:border-slate-900`
  - Accent: `bg-gradient-to-r from-blue-600 to-indigo-600 text-white`

**Colors**:
- Primary: `oklch(0.4099 0.2135 264.0522)` (blue-purple) - Use for CTAs, primary actions
- Background: White (light) / Dark gray (dark mode)
- Text: Near black (light) / Near white (dark)
- Muted: Light gray for subtle backgrounds
- Success: Green (`#10b981`)
- Warning: Amber (`#f59e0b`)
- Error: Red (`oklch(0.6292 0.1901 22.7134)`)
- Use design tokens: `bg-primary`, `text-foreground`, `bg-muted`, etc.

**Typography**:
- Font: `DM Sans` (primary), `Geist Mono` (code)
- Sizes: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px), `text-3xl` (30px), `text-4xl` (36px), `text-5xl` (48px), `text-6xl` (60px)
- Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- Headings: H1 (`text-4xl to text-6xl font-bold`), H2 (`text-3xl to text-4xl font-semibold`), H3 (`text-2xl to text-3xl font-semibold`)
- Body: `text-base font-normal leading-relaxed`
- Letter spacing: `tracking-tight` for headings, `tracking-wider` for uppercase labels

**Shadows**:
- Cards: `shadow-sm` to `shadow-md`
- Buttons: `shadow-lg` with color tint (e.g., `shadow-blue-600/20`)
- Modals: `shadow-xl` to `shadow-2xl`
- Hover: Increase shadow (`hover:shadow-lg`)

**Inputs**:
- Size: `h-10 px-4 text-sm` (medium default)
- Style: `rounded-md border border-input bg-background focus:ring-2 focus:ring-ring`
- Spacing: `mb-4` to `mb-6` between inputs

**Badges**:
- Size: `px-2 py-1 text-xs` (small), `px-2.5 py-1 text-xs` (medium)
- Style: `rounded-md border` or `rounded-full` for pills
- Variants: Default (slate), Hot (red), New (blue), Outline (transparent)

**Layout**:
- Container: `max-w-7xl mx-auto px-4 sm:px-5 lg:px-6`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 to gap-6`
- Section spacing: `py-12 md:py-24` (48px-96px vertical)

**Transitions**:
- Duration: `duration-200` (standard), `duration-300` (smooth)
- Properties: `transition-all` or `transition-colors`
- Hover effects: `hover:scale-105`, `hover:-translate-y-1`, `hover:shadow-lg`

**Responsive**:
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile-first: Design for mobile, enhance for larger screens
- Patterns: `text-base md:text-lg`, `p-4 md:p-6`, `grid-cols-1 md:grid-cols-2`

**Accessibility**:
- Contrast: 4.5:1 for normal text, 3:1 for large text
- Focus: `focus-visible:outline-2 focus-visible:outline-ring`
- Touch targets: Minimum 44x44px

## Implementation Rules

1. **Always use spacing multiples of 4px** (0.25rem)
2. **Buttons**: Pill shape (`rounded-full`) for sm/md sizes
3. **Cards**: `rounded-lg`, border, shadow, padding 16-24px
4. **Colors**: Use design tokens or semantic colors (primary, success, error)
5. **Typography**: DM Sans, appropriate size hierarchy
6. **Shadows**: Subtle for cards, prominent for buttons with color tint
7. **Consistency**: Maintain visual consistency across components
8. **Responsive**: Mobile-first approach with responsive utilities
9. **Accessibility**: Proper contrast, focus states, semantic HTML
10. **Modern aesthetic**: Rounded corners, subtle shadows, smooth transitions

## Quick Reference

- Spacing: `p-4` (16px), `m-6` (24px), `gap-4` (16px)
- Radius: `rounded-lg` (12px), `rounded-full` (pills)
- Colors: `bg-primary`, `text-foreground`, `bg-muted`
- Shadows: `shadow-md` (cards), `shadow-lg` (buttons)
- Typography: `text-base` (body), `text-xl` (headings), `font-semibold`
