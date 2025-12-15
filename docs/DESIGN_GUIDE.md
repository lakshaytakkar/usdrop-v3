# Design System Guide

## Overview
This design guide defines the visual language, spacing system, typography, color palette, component styles, and interaction patterns for consistent UI/UX implementation. Use these guidelines when generating or modifying design elements.

---

## 1. SPACING SYSTEM

### Base Unit
- **Base spacing unit**: `0.25rem` (4px)
- **Spacing scale**: Multiples of 4px for consistency

### Spacing Scale
```
0.5rem  (8px)   - xs: Minimal spacing, tight elements
1rem    (16px)  - sm: Small spacing, related elements
1.5rem  (24px)  - md: Medium spacing, standard gaps
2rem    (32px)  - lg: Large spacing, section separation
3rem    (48px)  - xl: Extra large, major sections
4rem    (64px)  - 2xl: Hero sections, page-level spacing
6rem    (96px)  - 3xl: Maximum spacing, landing page sections
```

### Usage Guidelines
- **Padding**: Use for internal spacing within components
  - Cards: `p-4` to `p-6` (16px-24px)
  - Buttons: `px-4 py-2` to `px-8 py-3` (horizontal: 16-32px, vertical: 8-12px)
  - Inputs: `px-4 py-2` (16px horizontal, 8px vertical)
  
- **Margin**: Use for external spacing between components
  - Between cards: `mb-4` to `mb-6` (16px-24px)
  - Section spacing: `mt-12` to `mt-24` (48px-96px)
  - Element gaps: `gap-4` to `gap-6` (16px-24px)

- **Container Padding**: 
  - Mobile: `px-4` (16px)
  - Tablet: `px-5` (20px)
  - Desktop: `px-6` (24px)

---

## 2. BORDER RADIUS & CURVES

### Radius Scale
```
0px     - none: Sharp corners (rarely used)
0.25rem (4px)   - sm: Subtle rounding, small elements
0.5rem  (8px)   - md: Standard rounding, buttons, inputs
0.75rem (12px)  - lg: Cards, containers (default)
1rem    (16px)  - xl: Large cards, modals
1.5rem  (24px)  - 2xl: Hero sections, featured elements
9999px  - full: Pills, badges, fully rounded buttons
```

### Component-Specific Radius
- **Buttons**: 
  - Small/Medium: `rounded-full` (pill shape)
  - Large: `rounded-lg` (12px)
  
- **Cards**: `rounded-lg` (12px) or `rounded-xl` (16px)
- **Inputs**: `rounded-md` (8px) or `rounded-lg` (12px)
- **Badges**: `rounded-md` (8px) or `rounded-full` (pills)
- **Modals/Dialogs**: `rounded-xl` (16px) or `rounded-2xl` (24px)
- **Images**: `rounded-lg` (12px) or `rounded-xl` (16px)

### Design Philosophy
- Use rounded corners to create a modern, friendly aesthetic
- Pill-shaped buttons (rounded-full) for primary actions
- Consistent radius within component families
- Larger radius for larger components

---

## 3. CARDS

### Card Structure
```
┌─────────────────────────────┐
│  Padding: 16px-24px (p-4-p-6)│
│  ┌─────────────────────────┐ │
│  │  Content Area           │ │
│  │                         │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

### Card Variants

#### Standard Card
- **Background**: White (`bg-white`) or card color token
- **Border**: `border border-slate-200` (light gray, 1px)
- **Radius**: `rounded-lg` (12px)
- **Shadow**: `shadow-sm` or `shadow-md`
- **Padding**: `p-4` to `p-6` (16px-24px)
- **Hover**: `hover:shadow-lg` (elevated shadow on hover)

#### Elevated Card
- **Background**: White
- **Border**: None or subtle
- **Radius**: `rounded-xl` (16px)
- **Shadow**: `shadow-lg` or `shadow-xl`
- **Padding**: `p-6` to `p-8` (24px-32px)

#### Glass Card (Glassmorphism)
- **Background**: `bg-white/80` or `bg-white/90` with backdrop blur
- **Backdrop**: `backdrop-blur-md` or `backdrop-blur-lg`
- **Border**: `border border-white/20`
- **Radius**: `rounded-xl` (16px)
- **Shadow**: Subtle shadow with transparency

#### Bordered Card
- **Background**: Transparent or subtle
- **Border**: `border-2 border-slate-300`
- **Radius**: `rounded-lg` (12px)
- **Shadow**: None or minimal

### Card Spacing
- **Between cards**: `gap-4` to `gap-6` (16px-24px)
- **Card grid**: Use CSS Grid with `gap-4` or `gap-6`
- **Card margin**: `mb-4` to `mb-6` when stacked

### Card Content Hierarchy
1. **Header** (optional): Title, badge, action button
2. **Body**: Main content, description, data
3. **Footer** (optional): Actions, metadata, links

---

## 4. BUTTONS

### Button Sizes

#### Small (`sm`)
- **Height**: `h-8` (32px)
- **Padding**: `px-4` (16px horizontal)
- **Font Size**: `text-xs` (12px)
- **Radius**: `rounded-full` (pill shape)
- **Use Case**: Compact spaces, secondary actions, inline buttons

#### Medium (`md`) - Default
- **Height**: `h-10` (40px)
- **Padding**: `px-6 py-2` (24px horizontal, 8px vertical)
- **Font Size**: `text-sm` (14px)
- **Radius**: `rounded-full` (pill shape)
- **Use Case**: Standard buttons, primary actions

#### Large (`lg`)
- **Height**: `h-12` (48px)
- **Padding**: `px-8` (32px horizontal)
- **Font Size**: `text-base` (16px)
- **Radius**: `rounded-lg` (12px) or `rounded-full`
- **Use Case**: Hero CTAs, prominent actions

### Button Variants

#### Primary
- **Background**: `bg-blue-600`
- **Text**: `text-white`
- **Hover**: `hover:bg-blue-700`
- **Shadow**: `shadow-lg shadow-blue-600/20`
- **Border**: `border border-transparent`
- **Use**: Main call-to-action, primary user actions

#### Secondary
- **Background**: `bg-white`
- **Text**: `text-slate-900`
- **Border**: `border border-slate-200`
- **Hover**: `hover:border-blue-600 hover:text-blue-600`
- **Shadow**: `shadow-sm`
- **Use**: Secondary actions, alternative options

#### Ghost
- **Background**: Transparent
- **Text**: `text-slate-600`
- **Hover**: `hover:bg-slate-100 hover:text-slate-900`
- **Border**: None
- **Use**: Tertiary actions, subtle interactions

#### Outline
- **Background**: Transparent
- **Text**: `text-slate-900`
- **Border**: `border border-slate-300`
- **Hover**: `hover:border-slate-900`
- **Use**: Alternative to secondary, outlined style

#### Accent (Gradient)
- **Background**: `bg-gradient-to-r from-blue-600 to-indigo-600`
- **Text**: `text-white`
- **Hover**: `hover:brightness-110`
- **Use**: Special promotions, featured actions

#### Destructive
- **Background**: `bg-red-600` or destructive color token
- **Text**: `text-white`
- **Hover**: `hover:bg-red-700`
- **Use**: Delete, remove, destructive actions

### Button States
- **Default**: Standard styling
- **Hover**: Slightly darker background, elevated shadow
- **Active**: Pressed state, slightly darker
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Loading**: Show spinner icon, disable interaction

### Button Best Practices
- Use pill shape (`rounded-full`) for small and medium buttons
- Maintain consistent padding ratios (horizontal:vertical ≈ 3:1)
- Ensure minimum touch target of 44x44px on mobile
- Use appropriate variant for action hierarchy
- Group related buttons with consistent spacing

---

## 5. COLOR SYSTEM

### Color Format
- **Primary Format**: OKLCH (for perceptual uniformity)
- **Fallback**: Hex codes for compatibility
- **CSS Variables**: Use design tokens for consistency

### Primary Colors

#### Primary (Brand)
- **Light Mode**: `oklch(0.4099 0.2135 264.0522)` - Blue-purple
- **Dark Mode**: `oklch(0.5945 0.2325 285.8306)` - Lighter blue-purple
- **Usage**: Primary buttons, links, brand elements, CTAs

#### Secondary
- **Light Mode**: `oklch(0.9601 0.0093 286.2229)` - Light gray-purple
- **Dark Mode**: `oklch(0.2512 0.0301 284.0237)` - Dark gray-purple
- **Usage**: Secondary buttons, backgrounds, subtle elements

### Semantic Colors

#### Success
- **Color**: Green (`#10b981` or `oklch(0.65 0.15 150)`)
- **Usage**: Success messages, positive indicators, checkmarks

#### Warning
- **Color**: Amber/Yellow (`#f59e0b` or `oklch(0.75 0.15 70)`)
- **Usage**: Warnings, caution messages, pending states

#### Error/Destructive
- **Light Mode**: `oklch(0.6292 0.1901 22.7134)` - Red
- **Dark Mode**: `oklch(0.5989 0.2000 22.9576)` - Lighter red
- **Usage**: Errors, destructive actions, delete buttons

#### Info
- **Color**: Blue (`#3b82f6` or `oklch(0.60 0.20 250)`)
- **Usage**: Information messages, tooltips, hints

### Neutral Colors

#### Background
- **Light Mode**: `oklch(1.0000 0 0)` - Pure white
- **Dark Mode**: `oklch(0.1008 0.0145 283.4814)` - Dark gray

#### Foreground (Text)
- **Light Mode**: `oklch(0.1206 0.0203 282.9203)` - Near black
- **Dark Mode**: `oklch(0.9791 0 0)` - Near white

#### Muted
- **Light Mode**: `oklch(0.9601 0.0093 286.2229)` - Light gray
- **Dark Mode**: `oklch(0.2007 0.0199 284.4646)` - Dark gray
- **Usage**: Subtle backgrounds, disabled states

#### Border
- **Light Mode**: `oklch(0.9209 0.0094 286.2133)` - Light gray border
- **Dark Mode**: `oklch(0.2187 0.0214 284.4903)` - Dark gray border

### Color Combinations

#### High Contrast (Accessibility)
- Primary text on white: `oklch(0.12 0.02 282)` on `oklch(1.0 0 0)`
- White text on primary: `oklch(0.98 0 0)` on `oklch(0.41 0.21 264)`
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text

#### Gradient Combinations
- **Primary Gradient**: `from-blue-600 to-indigo-600`
- **Accent Gradient**: `from-purple-600 to-pink-600`
- **Success Gradient**: `from-green-500 to-emerald-600`
- **Warm Gradient**: `from-orange-500 to-red-600`
- **Cool Gradient**: `from-cyan-500 to-blue-600`

#### Color Usage Rules
1. **Primary actions**: Use primary color
2. **Secondary actions**: Use secondary or outline variant
3. **Destructive actions**: Use red/destructive color
4. **Information**: Use blue/info color
5. **Success states**: Use green
6. **Warnings**: Use amber/yellow
7. **Text hierarchy**: Use foreground for primary, muted-foreground for secondary
8. **Backgrounds**: Use background for main, muted for subtle areas

---

## 6. TYPOGRAPHY

### Font Families

#### Primary Font (Sans-serif)
- **Font**: `DM Sans`
- **Fallback**: `ui-sans-serif, sans-serif, system-ui`
- **Usage**: Body text, headings, UI elements, buttons
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

#### Monospace Font
- **Font**: `Geist Mono`
- **Fallback**: `Fira Code, monospace`
- **Usage**: Code blocks, technical content, data display

#### Serif Font
- **Font**: `Georgia`
- **Usage**: Special typography, decorative text (rare)

#### Custom Font
- **Font**: `Happy Face` (SemiBold, 600)
- **Usage**: Special branding, decorative elements

### Font Sizes

```
text-xs    (12px)   - Small labels, captions, badges
text-sm    (14px)   - Body text, secondary content, buttons
text-base  (16px)   - Default body text, standard content
text-lg    (18px)   - Large body text, emphasized content
text-xl    (20px)   - Subheadings, section titles
text-2xl   (24px)   - Small headings
text-3xl   (30px)   - Medium headings
text-4xl   (36px)   - Large headings
text-5xl   (48px)   - Hero headings
text-6xl   (60px)   - Extra large hero text
text-7xl   (72px)   - Maximum display size
```

### Font Weights
- **Light**: 300 (rarely used)
- **Regular**: 400 (body text)
- **Medium**: 500 (emphasis, buttons)
- **Semibold**: 600 (headings, important text)
- **Bold**: 700 (strong emphasis, hero text)

### Line Height
- **Tight**: `leading-tight` (1.25) - Headings
- **Normal**: `leading-normal` (1.5) - Body text
- **Relaxed**: `leading-relaxed` (1.75) - Long-form content
- **Loose**: `leading-loose` (2) - Spacious layouts

### Letter Spacing
- **Tighter**: `tracking-tighter` (-0.05em) - Large headings
- **Tight**: `tracking-tight` (-0.025em) - Headings
- **Normal**: `tracking-normal` (0em) - Body text
- **Wide**: `tracking-wide` (+0.025em) - Uppercase text
- **Wider**: `tracking-wider` (+0.05em) - Labels, badges
- **Widest**: `tracking-widest` (+0.1em) - Uppercase labels

### Typography Hierarchy

#### Heading 1 (H1)
- **Size**: `text-4xl` to `text-6xl` (36px-60px)
- **Weight**: `font-bold` (700)
- **Line Height**: `leading-tight`
- **Letter Spacing**: `tracking-tight`
- **Use**: Page titles, hero headings

#### Heading 2 (H2)
- **Size**: `text-3xl` to `text-4xl` (30px-36px)
- **Weight**: `font-semibold` (600) or `font-bold` (700)
- **Line Height**: `leading-tight`
- **Use**: Section titles, major headings

#### Heading 3 (H3)
- **Size**: `text-2xl` to `text-3xl` (24px-30px)
- **Weight**: `font-semibold` (600)
- **Use**: Subsection titles

#### Heading 4 (H4)
- **Size**: `text-xl` to `text-2xl` (20px-24px)
- **Weight**: `font-semibold` (600)
- **Use**: Card titles, component headings

#### Body Text
- **Size**: `text-base` (16px) or `text-lg` (18px)
- **Weight**: `font-normal` (400)
- **Line Height**: `leading-relaxed` (1.75)
- **Use**: Paragraphs, descriptions, content

#### Small Text
- **Size**: `text-sm` (14px) or `text-xs` (12px)
- **Weight**: `font-normal` (400)
- **Use**: Captions, metadata, helper text

### Text Colors
- **Primary Text**: `text-foreground` (high contrast)
- **Secondary Text**: `text-muted-foreground` (medium contrast)
- **Tertiary Text**: `text-slate-500` or `text-slate-400` (low contrast)
- **Links**: `text-blue-600` or `text-primary`
- **Hover Links**: `hover:text-blue-700` or `hover:text-primary`

---

## 7. SHADOWS & ELEVATION

### Shadow Scale

```
shadow-2xs: 0px 1px 2px 0px (minimal, subtle borders)
shadow-xs:  0px 1px 2px 0px (very subtle)
shadow-sm:  0px 1px 2px + 0px 1px 2px -1px (small elevation)
shadow:     0px 1px 2px + 0px 1px 2px -1px (default)
shadow-md:  0px 1px 2px + 0px 2px 4px -1px (medium elevation)
shadow-lg:  0px 1px 2px + 0px 4px 6px -1px (large elevation)
shadow-xl:  0px 1px 2px + 0px 8px 10px -1px (extra large)
shadow-2xl: 0px 1px 2px (maximum elevation)
```

### Shadow Usage
- **Cards**: `shadow-sm` to `shadow-md`
- **Buttons**: `shadow-lg` with color tint (e.g., `shadow-blue-600/20`)
- **Modals**: `shadow-xl` or `shadow-2xl`
- **Hover States**: Increase shadow on hover (`hover:shadow-lg`)
- **Floating Elements**: Use `shadow-xl` or `shadow-2xl`

### Shadow Colors
- **Default**: Black with opacity (`hsl(0 0% 0% / 0.18)`)
- **Colored Shadows**: Use color with opacity (e.g., `shadow-blue-600/20`)
- **Light Mode**: Subtle black shadows
- **Dark Mode**: Slightly more prominent shadows

---

## 8. INPUTS & FORMS

### Input Sizes
- **Small**: `h-8` (32px), `px-3` (12px), `text-sm`
- **Medium**: `h-10` (40px), `px-4` (16px), `text-sm` (default)
- **Large**: `h-12` (48px), `px-4` (16px), `text-base`

### Input Styles
- **Background**: `bg-background` or `bg-white`
- **Border**: `border border-input` (1px solid)
- **Radius**: `rounded-md` (8px) or `rounded-lg` (12px)
- **Focus**: `focus:ring-2 focus:ring-ring focus:ring-offset-2`
- **Padding**: `px-4 py-2` (16px horizontal, 8px vertical)

### Input States
- **Default**: Standard border, white background
- **Focus**: Ring with primary color, elevated appearance
- **Error**: Red border (`border-red-500`), error message
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Placeholder**: `placeholder:text-muted-foreground`

### Form Spacing
- **Label to Input**: `mb-2` (8px)
- **Input to Input**: `mb-4` to `mb-6` (16px-24px)
- **Form Groups**: `space-y-4` or `space-y-6`

---

## 9. BADGES & TAGS

### Badge Sizes
- **Small**: `px-2 py-1` (8px horizontal, 4px vertical), `text-[10px]`
- **Medium**: `px-2.5 py-1` (10px horizontal, 4px vertical), `text-xs`
- **Large**: `px-3 py-1.5` (12px horizontal, 6px vertical), `text-sm`

### Badge Variants
- **Default**: `bg-slate-100 text-slate-700 border-slate-200`
- **Hot**: `bg-red-50 text-red-600 border-red-100 font-bold`
- **New**: `bg-blue-50 text-blue-600 border-blue-100 font-bold`
- **Outline**: `bg-transparent border-slate-200 text-slate-600`
- **Success**: `bg-green-50 text-green-600 border-green-100`
- **Warning**: `bg-amber-50 text-amber-600 border-amber-100`

### Badge Styling
- **Radius**: `rounded-md` (8px) or `rounded-full` (pills)
- **Border**: `border` (1px solid)
- **Letter Spacing**: `tracking-wider` or `tracking-widest` for uppercase
- **Font Weight**: `font-semibold` or `font-bold` for emphasis

---

## 10. LAYOUT & CONTAINERS

### Container Widths
- **Full Width**: `w-full`
- **Small**: `max-w-sm` (384px)
- **Medium**: `max-w-md` (448px)
- **Large**: `max-w-lg` (512px)
- **XL**: `max-w-xl` (576px)
- **2XL**: `max-w-2xl` (672px)
- **4XL**: `max-w-4xl` (896px)
- **6XL**: `max-w-6xl` (1152px)
- **7XL**: `max-w-7xl` (1280px) - Standard container

### Container Padding
- **Mobile**: `px-4` (16px)
- **Tablet**: `px-5` (20px)
- **Desktop**: `px-6` (24px)
- **Full Container**: `mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6`

### Grid Systems
- **2 Columns**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **3 Columns**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **4 Columns**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- **Gap**: `gap-4` to `gap-6` (16px-24px)

---

## 11. ANIMATIONS & TRANSITIONS

### Transition Durations
- **Fast**: `duration-150` (150ms) - Hover states, quick interactions
- **Normal**: `duration-200` (200ms) - Standard transitions
- **Slow**: `duration-300` (300ms) - Smooth animations
- **Very Slow**: `duration-500` (500ms) - Complex animations

### Transition Properties
- **All**: `transition-all` - All properties
- **Colors**: `transition-colors` - Color changes
- **Transform**: `transition-transform` - Transform animations
- **Opacity**: `transition-opacity` - Fade effects

### Easing Functions
- **Default**: `ease` - Standard easing
- **In**: `ease-in` - Slow start
- **Out**: `ease-out` - Slow end
- **In-Out**: `ease-in-out` - Slow start and end

### Common Animations
- **Hover Scale**: `hover:scale-105` or `hover:scale-110`
- **Hover Lift**: `hover:-translate-y-1` with shadow increase
- **Fade In**: `animate-fade-in` or opacity transition
- **Shimmer**: Gradient animation for loading states
- **Pulse**: `animate-pulse` for loading indicators

---

## 12. RESPONSIVE DESIGN

### Breakpoints
```
sm:  640px  - Small devices (mobile landscape)
md:  768px  - Medium devices (tablets)
lg:  1024px - Large devices (desktops)
xl:  1280px - Extra large devices
2xl: 1536px - 2X large devices
```

### Mobile-First Approach
- Design for mobile first, then enhance for larger screens
- Use responsive utilities: `text-base md:text-lg lg:text-xl`
- Stack elements on mobile, use grid on desktop
- Touch targets: Minimum 44x44px

### Responsive Patterns
- **Text**: `text-sm md:text-base lg:text-lg`
- **Spacing**: `p-4 md:p-6 lg:p-8`
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Visibility**: `hidden md:block` (hide on mobile, show on desktop)

---

## 13. ACCESSIBILITY

### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: High contrast for visibility

### Focus States
- **Visible Focus**: `focus-visible:outline-2 focus-visible:outline-ring`
- **Focus Ring**: Use primary color with offset
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible

### ARIA Labels
- Use semantic HTML elements
- Add ARIA labels for icon-only buttons
- Provide alt text for images
- Use proper heading hierarchy (h1-h6)

---

## 14. DARK MODE

### Dark Mode Colors
- **Background**: Dark gray (`oklch(0.1008 0.0145 283.4814)`)
- **Foreground**: Light text (`oklch(0.9791 0 0)`)
- **Cards**: Slightly lighter than background
- **Borders**: Subtle dark borders
- **Shadows**: More prominent for depth

### Dark Mode Best Practices
- Use CSS variables for color tokens
- Test contrast in both modes
- Adjust shadow opacity for dark backgrounds
- Ensure interactive elements are clearly visible

---

## 15. DESIGN TOKENS SUMMARY

### Spacing Tokens
```css
--spacing: 0.25rem (4px base unit)
```

### Radius Tokens
```css
--radius: 0.75rem (12px default)
--radius-sm: calc(var(--radius) - 4px) = 8px
--radius-md: calc(var(--radius) - 2px) = 10px
--radius-lg: var(--radius) = 12px
--radius-xl: calc(var(--radius) + 4px) = 16px
```

### Shadow Tokens
```css
--shadow-sm, --shadow, --shadow-md, --shadow-lg, --shadow-xl, --shadow-2xl
```

### Color Tokens
```css
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
```

---

## 16. COMPONENT PATTERNS

### Hero Section
- **Padding**: `py-12 md:py-24` (48px-96px vertical)
- **Text**: Large headings (`text-4xl` to `text-6xl`)
- **CTA**: Large primary button
- **Spacing**: Generous spacing between elements

### Feature Cards
- **Layout**: Grid with 2-3 columns on desktop
- **Spacing**: `gap-6` (24px)
- **Cards**: Standard card with `rounded-lg`, `shadow-md`
- **Icons**: Large icons (48px-64px) with brand color

### Navigation
- **Height**: `h-16` to `h-20` (64px-80px)
- **Padding**: `px-4 md:px-6` (16px-24px)
- **Links**: Medium weight, hover states
- **Active**: Primary color or underline

### Footer
- **Background**: Muted or dark background
- **Text**: Smaller text, muted colors
- **Links**: Subtle hover effects
- **Padding**: `py-12` to `py-16` (48px-64px)

---

## 17. DESIGN PRINCIPLES

### Consistency
- Use design tokens consistently across all components
- Maintain spacing rhythm (multiples of 4px)
- Follow established patterns for similar elements

### Hierarchy
- Use size, weight, and color to establish visual hierarchy
- Primary actions should be most prominent
- Secondary information should be subtle

### Clarity
- Ensure sufficient contrast for readability
- Use clear, concise labels and text
- Provide visual feedback for all interactions

### Modern Aesthetic
- Rounded corners for friendly appearance
- Subtle shadows for depth
- Smooth transitions for polish
- Clean, minimal design

---

## 18. USAGE EXAMPLES

### Button Example
```tsx
<Button 
  variant="primary" 
  size="md" 
  className="rounded-full"
>
  Get Started
</Button>
```

### Card Example
```tsx
<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-slate-600">Card content goes here.</p>
</div>
```

### Typography Example
```tsx
<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
  Main Heading
</h1>
<p className="text-base text-muted-foreground leading-relaxed mt-4">
  Body text with proper spacing and readability.
</p>
```

---

## 19. QUICK REFERENCE

### Spacing Quick Ref
- `p-4` = 16px padding
- `m-6` = 24px margin
- `gap-4` = 16px gap
- `space-y-4` = 16px vertical spacing

### Radius Quick Ref
- `rounded-md` = 8px
- `rounded-lg` = 12px (default)
- `rounded-xl` = 16px
- `rounded-full` = Pill shape

### Color Quick Ref
- Primary: `bg-blue-600 text-white`
- Secondary: `bg-white text-slate-900 border`
- Muted: `bg-slate-100 text-slate-600`
- Success: `bg-green-50 text-green-600`
- Error: `bg-red-50 text-red-600`

---

## 20. TRAINING PROMPT FOR LLM

When generating or modifying UI components, follow these guidelines:

1. **Spacing**: Always use multiples of 4px (0.25rem). Use `p-4`, `m-6`, `gap-4` patterns.
2. **Radius**: Use `rounded-lg` (12px) for cards, `rounded-full` for buttons (sm/md).
3. **Colors**: Use design tokens (`bg-primary`, `text-foreground`) or semantic colors.
4. **Typography**: Use DM Sans font, appropriate sizes (`text-base` for body, `text-xl` for headings).
5. **Shadows**: Use `shadow-md` for cards, `shadow-lg` for buttons with color tint.
6. **Buttons**: Pill shape for sm/md (`rounded-full`), appropriate padding (`px-6 py-2`).
7. **Cards**: `rounded-lg`, `border border-slate-200`, `shadow-md`, `p-4` to `p-6`.
8. **Consistency**: Maintain visual consistency across similar components.
9. **Responsive**: Design mobile-first, use responsive utilities (`md:`, `lg:`).
10. **Accessibility**: Ensure proper contrast, focus states, and semantic HTML.

Always prioritize:
- Visual consistency
- Proper spacing rhythm
- Clear hierarchy
- Modern, clean aesthetic
- Accessibility and usability
