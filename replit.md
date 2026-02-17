# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase for backend (database, auth, storage).

## Project Architecture
- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Radix UI primitives + shadcn/ui + Framer Motion
- **Database**: Supabase PostgreSQL (project: wecbybtxmkdkvqqahyuu)
- **Auth**: Supabase Auth (email/password), session managed via `@supabase/ssr` cookies
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
    auth.ts         - Auth utilities (getCurrentUser via Supabase Auth, getUserWithPlan)
    supabase/
      client.ts     - Browser Supabase client (createBrowserClient from @supabase/ssr)
      server.ts     - Server Supabase client + admin client (service role key)
      middleware.ts  - Session refresh middleware helper (updateSession)
    utils/          - Utility functions
  middleware.ts     - Supabase Auth session refresh + route protection
  types/            - TypeScript type definitions
public/
  images/
    hero/           - Hero section background assets (ellipses, overlays)
    landing/        - Landing page feature images, showcase photos
    logos/          - Brand/partner logos
  3d-characters-ecom/ - 3D character illustrations
```

## Authentication System
- **Provider**: Supabase Auth (email/password sign-in)
- **Session**: Managed by `@supabase/ssr` via cookies (automatic token refresh)
- **Middleware**: `src/middleware.ts` calls `updateSession()` to refresh tokens on every request
- **Server-side auth**: `getCurrentUser()` from `src/lib/auth.ts` uses `supabase.auth.getUser()` + profile lookup
- **Client-side auth**: `AuthProvider` context uses `supabase.auth.onAuthStateChange()` + `/api/auth/user` endpoint
- **Admin auth**: `requireAdmin()` from `src/lib/admin-auth.ts` checks `internal_role` in profiles table

## Test Credentials
- Admin: `admin@usdrop.ai` / `Admin123!` (internal_role=admin)
- Pro Seller: `seller@usdrop.ai` / `Seller123!` (account_type=pro)
- Free User: `free@usdrop.ai` / `Free123!` (account_type=free)
- Existing admin: `parthiv.kataria@usdrop.ai` / `USDrop2024!`

## Database
- **Provider**: Supabase PostgreSQL (project: wecbybtxmkdkvqqahyuu.supabase.co)
- **Client**: `supabaseAdmin` from `src/lib/supabase/server.ts` (service role, bypasses RLS)
- **Server client**: `createClient()` from `src/lib/supabase/server.ts` (user-scoped, respects RLS)
- **Browser client**: `createClient()` from `src/lib/supabase/client.ts`
- **Tables**: profiles, products, product_metadata, product_source, product_research, categories, courses, course_modules, subscription_plans, competitor_stores, onboarding_modules, onboarding_videos, orders, suppliers, user_picklist, shopify_stores, onboarding_progress (18+ tables)
- **All API routes use supabaseAdmin** for database queries (service role client)

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase publishable/anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret)
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

## Admin Panel
- **Admin Auth**: All admin API routes protected via `requireAdmin()` helper from `src/lib/admin-auth.ts`
- **Admin Roles**: admin, super_admin, editor, moderator
- **Admin API Routes**: All use supabaseAdmin for database queries
- **Working Admin APIs**: products, categories, courses, competitor-stores, internal-users, external-users, plans, shopify-stores, orders, suppliers
- **Admin Pages with Real Data**: products, categories, courses, competitor stores, users, plans
- **Admin Pages with Mock Data**: orders, suppliers, intelligence, email-automation, knowledge-base, store-research, permissions (use local sample data files)
- **Known Limitation**: course_chapters and course_resources tables don't exist yet; chapter-related course operations will fail until tables are created

## Supabase Query Patterns
- Use `supabaseAdmin` (service role) for all server-side database operations
- JOINs via foreign key syntax: `.select('*, categories(name)')` or `.select('*, profiles!fk_name(full_name)')`
- Pagination: `.range(offset, offset + limit - 1)` with `{ count: 'exact' }`
- Search: `.ilike('column', '%search%')` or `.or('col1.ilike.%s%,col2.ilike.%s%')`
- Upsert: `.upsert({...}, { onConflict: 'col1,col2' })`

## Recent Changes (Feb 2026)
- **Migrated to Supabase**: Full migration from Replit PostgreSQL + custom JWT auth to Supabase (database, auth, storage)
- **Supabase Auth**: Replaced bcrypt + JWT cookies with Supabase Auth email/password sign-in
- **Supabase SSR**: Using `@supabase/ssr` for cookie-based session management with middleware token refresh
- **All API routes migrated**: 50+ API routes converted from raw SQL (`postgres` package) to Supabase client queries
- **Auth context updated**: Client-side auth now uses `supabase.auth.onAuthStateChange()` for real-time session tracking
- **Admin panel preserved**: All admin auth, role checks, and API routes working with Supabase
- **Data preserved**: 225 products, 11 categories, 2 subscription plans, 10 courses, 23 competitor stores, 4 test users (all in Supabase)

## Banner System
- **Consistent Format**: All sidebar pages use h-[154px] banners with 4-layer grainy texture, dark gradient background, 3D icon left, title/description center
- **Icon Set**: All banners use unique `/3d-ecom-icons-blue/` icons (no background, blue/white 3D style)
- **Icon Mapping**: winning-products=Trophy_Star, categories=Category_Grid, suppliers=Delivery_Truck, competitor-stores=Competitor_Search, intelligence=Open_Board, selling-channels=Shopping_Cart, my-products=My_Products, my-shopify-stores=My_Store, my-journey=Rocket_Launch, meta-ads=Megaphone_Ads, webinars=Webinar_Video
- **Exceptions**: product-hunt (no banner, uses tab layout), seasonal-collections (per-item banners), fulfillment (marketing page with Header/Footer), academy (white mentor portrait banner)

## Learning System
- **Routes**: `/academy` (course list with mentor banner), `/academy/[id]` (course viewer with video player)
- **API**: `/api/courses` (GET - returns published courses from `courses` table)
- **Home Page Widget**: CoursesWidget fetches latest 6 courses from `/api/courses` and displays them as cards linking to `/academy/[id]`
- **Sidebar**: "My Mentor" links to `/academy` (free access for all users)
