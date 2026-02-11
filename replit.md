# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Replit PostgreSQL for backend with custom JWT authentication.

## Project Architecture
- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Radix UI primitives + shadcn/ui + Framer Motion
- **Database**: Replit PostgreSQL (Neon-backed), accessed via `postgres` package
- **Auth**: Custom JWT auth with bcrypt password hashing, httpOnly cookie sessions
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
    api/auth/       - Auth endpoints (signin, signup, signout, user, etc.)
    api/admin/      - Admin API routes
    api/courses/    - Course management routes
  components/       - Reusable React components
    auth/           - Auth forms (login, signup, reset password)
    motion/         - Animation primitives (MotionFadeIn, MotionCard, MotionMarquee)
    ui/             - shadcn/ui components
  contexts/         - React context providers (auth-context, user-plan-context)
  data/             - Static data/constants
  hooks/            - Custom React hooks
  lib/
    auth.ts         - JWT auth utilities (getCurrentUser, hashPassword, etc.)
    db/             - Database connection (index.ts), schema (schema.sql), seed (seed.ts)
    supabase/       - PostgreSQL query builder wrapper (Supabase-compatible API)
    utils/          - Utility functions
  middleware.ts     - JWT-based auth middleware (Node.js runtime)
  types/            - TypeScript type definitions
public/
  images/
    hero/           - Hero section background assets (ellipses, overlays)
    landing/        - Landing page feature images, showcase photos
    logos/          - Brand/partner logos
  3d-characters-ecom/ - 3D character illustrations
```

## Authentication System
- **Password hashing**: bcrypt with 12 salt rounds
- **Sessions**: JWT stored in httpOnly cookie (`usdrop_session`), 7-day expiry
- **Secret**: `SESSION_SECRET` environment variable
- **Middleware**: Node.js runtime, JWT-only verification, no database calls
- **Auth context**: Client-side via `/api/auth/user` endpoint

## Test Credentials
- Admin: `admin@usdrop.ai` / `Admin123!` (internal_role=admin)
- Pro Seller: `seller@usdrop.ai` / `Seller123!` (account_type=pro)
- Free User: `free@usdrop.ai` / `Free123!` (account_type=free)
- Existing admin: `parthiv.kataria@usdrop.ai` / `USDrop2024!`

## Database
- **Connection**: `DATABASE_URL` environment variable, `postgres` package with tagged template literals
- **Query Builder**: `src/lib/supabase/server.ts` wraps PostgreSQL with Supabase-compatible API (.from().select().eq() patterns)
- **Tables**: profiles, products, categories, courses, course_modules, subscription_plans, competitor_stores, onboarding_modules, onboarding_videos, orders, and more (18 total)
- **Seed script**: `npx tsx src/lib/db/seed.ts` - imports data from Supabase and creates test users

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
- `SESSION_SECRET` - JWT signing secret
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

## Recent Changes (Feb 2026)
- **Migrated from Supabase to Replit PostgreSQL**: 18 tables, all data imported
- **Custom JWT auth system**: Replaced Supabase Auth with bcrypt + JWT cookies
- **Simplified middleware**: JWT-only verification, no database calls
- **Fixed all API routes**: Removed all direct `@supabase/supabase-js` imports
- **Responsive landing page**: Mobile hamburger menu, responsive Hero section
- **SEO metadata**: Added to landing page
- **Fixed footer links**: Anchor links to landing page sections
