# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase for backend/auth.

## Project Architecture
- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Radix UI primitives + shadcn/ui + Framer Motion
- **Backend**: Supabase (auth, database, storage)
- **State Management**: TanStack React Query
- **Rich Text**: Tiptap editor
- **Charts**: Recharts
- **Animations**: motion/react (Framer Motion), custom MotionFadeIn/MotionCard primitives

## Project Structure
```
src/
  app/              - Next.js App Router pages and API routes
    (marketing)/    - Marketing/landing page components
      components/   - Hero, BentoFeatures, Workflow, StudioShowcase, etc.
  components/       - Reusable React components
    motion/         - Animation primitives (MotionFadeIn, MotionCard, MotionMarquee)
    ui/             - shadcn/ui components
  contexts/         - React context providers
  data/             - Static data/constants
  hooks/            - Custom React hooks
  lib/              - Utility libraries (Supabase client, motion constants)
  middleware.ts     - Auth middleware (Supabase SSR)
  types/            - TypeScript type definitions
public/
  images/
    hero/           - Hero section background assets (ellipses, overlays)
    landing/        - Landing page feature images, showcase photos
    logos/          - Brand/partner logos
  3d-characters-ecom/ - 3D character illustrations
docs/               - Project documentation
```

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_SITE_URL` - Site URL
- `NEXT_PUBLIC_GEMINI_API_KEY` - Google Gemini API key (optional, for AI features)

## Design System
- **Backgrounds**: Ethereal gradient with ellipse SVGs (EtherealBackground component), alternating white/translucent sections
- **Cards**: Glass-morphism (bg-white/80 backdrop-blur-xl border-white/60 rounded-[16px])
- **Typography**: text-black headings with tracking-[-0.04em], text-[#555555] body text
- **Accents**: Blue gradient (from-blue-500 to-blue-600) for highlights
- **CTA Buttons**: Dark gradient style matching hero section

## Development
- Dev server: `npm run dev` (runs on port 5000, bound to 0.0.0.0)
- Build: `npm run build`
- Start: `npm start`

## Recent Changes
- Configured for Replit environment (port 5000, allowed dev origins)
- Redesigned landing page sections: BentoFeatures (image-heavy bento grid), Workflow (alternating image+text), StudioShowcase (masonry image gallery), Testimonials (glass-morphism cards), PricingPreview (ethereal aesthetic), FinalCTA (split layout with dashboard image), Footer (dark with subtle glow effects)
- Generated AI showcase images for landing page (product discovery, AI studio, fulfillment dashboards, product photography)
- Added PricingPreview to main page.tsx
