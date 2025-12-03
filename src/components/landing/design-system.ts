/**
 * Standardized Design System for Landing Page
 * Ensures consistent sizing, spacing, typography, and effects across all sections
 */

// Section Spacing
export const SECTION_SPACING = {
  SMALL: "py-12 md:py-16",
  MEDIUM: "py-16 md:py-20",
  LARGE: "py-20 md:py-28",
  XL: "py-24 md:py-32",
} as const;

// Background Variants
export const BACKGROUND_VARIANTS = {
  WHITE: "bg-white",
  SLATE_50: "bg-slate-50",
  SLATE_900: "bg-slate-900",
  BLUE_600: "bg-blue-600",
  GRADIENT_BLUE: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600",
} as const;

// Heading Sizes (Standardized)
export const HEADING_SIZES = {
  H1: "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]",
  H2: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
  H3: "text-2xl md:text-3xl font-bold",
  H4: "text-xl md:text-2xl font-bold",
  SECTION_TITLE: "text-3xl md:text-4xl font-bold text-slate-900",
  SECTION_SUBTITLE: "text-lg md:text-xl text-slate-600 leading-relaxed",
} as const;

// Text Colors
export const TEXT_COLORS = {
  PRIMARY: "text-slate-900",
  SECONDARY: "text-slate-600",
  TERTIARY: "text-slate-500",
  WHITE: "text-white",
  BLUE: "text-blue-600",
} as const;

// Section Labels (Badges)
export const SECTION_LABEL = "text-xs font-bold text-blue-600 uppercase tracking-widest mb-3";

// Container Max Width
export const CONTAINER_MAX_WIDTH = "max-w-7xl mx-auto px-4 sm:px-5 lg:px-6";

// Border Radius
export const BORDER_RADIUS = {
  SMALL: "rounded-xl",
  MEDIUM: "rounded-2xl",
  LARGE: "rounded-3xl",
  XL: "rounded-[2.5rem]",
} as const;

// Shadows
export const SHADOWS = {
  SMALL: "shadow-sm",
  MEDIUM: "shadow-md",
  LARGE: "shadow-lg",
  XL: "shadow-xl",
  XXL: "shadow-2xl",
} as const;

// Transitions
export const TRANSITIONS = {
  DEFAULT: "transition-all duration-300",
  SLOW: "transition-all duration-500",
  FAST: "transition-all duration-200",
} as const;

// Hover Effects
export const HOVER_EFFECTS = {
  LIFT: "hover:-translate-y-1 hover:shadow-xl",
  SCALE: "hover:scale-105",
  BRIGHTEN: "hover:brightness-110",
} as const;

