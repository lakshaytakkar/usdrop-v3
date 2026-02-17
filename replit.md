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
    api/auth/       - Auth endpoints (signin, signup, signout, user, etc.)
    api/admin/      - Admin API routes
    api/courses/    - Course management routes
    api/user-details/ - User profile details API
    api/user-credentials/ - User credentials vault API
    mentorship/     - Course learning pages (was /academy)
    my-roadmap/     - Journey progress tracker (was /my-journey)
    my-profile/     - User profile & business details
    my-credentials/ - Secure credentials vault
    my-store/       - Shopify store management (was /my-shopify-stores)
    my-products/    - User product management
    blogs/          - Articles & intelligence (was /intelligence)
    studio/         - Creative tools (whitelabelling, model-studio)
    tools/          - Utility tools (description-generator, email-templates, etc.)
    shipping-calculator/ - Shipping cost calculator
  components/       - Reusable React components
    auth/           - Auth forms (login, signup, reset password)
    motion/         - Animation primitives (MotionFadeIn, MotionCard, MotionMarquee)
    ui/             - shadcn/ui components
  contexts/         - React context providers (auth-context, user-plan-context)
  data/             - Static data/constants (navigation.ts, journey-stages.ts)
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
    hero/           - Hero section background assets
    landing/        - Landing page feature images
    logos/          - Brand/partner logos
  3d-characters-ecom/ - 3D character illustrations
  3d-ecom-icons-blue/ - Banner icons (blue/white 3D style)
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
- **Tables**: profiles, products, product_metadata, product_source, product_research, categories, courses, course_modules, subscription_plans, competitor_stores, onboarding_modules, onboarding_videos, orders, suppliers, user_picklist, shopify_stores, onboarding_progress, user_details, user_credentials (20+ tables)
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

## Navigation System & Framework Concept
- **Framework = Personal Hub**: Framework is the user's personal space. Everything related to the user (saved items, store, roadmap, profile, credentials) lives here. Other pages work as libraries, tools, and resources that users browse and interact with. Saved/collected items always go back to Framework.
- **External Users**: Top bar navigation (no sidebar) with `ExternalLayout` wrapper
  - `AppTopNavigation` (src/components/layout/app-top-navigation.tsx): Logo + 10 group links + user actions
  - `SubNavTabs` (src/components/layout/sub-nav-tabs.tsx): Horizontal tab strip showing child pages of active group
  - `ExternalLayout` (src/components/layout/external-layout.tsx): Combines both above + content area
  - Navigation config: `src/data/navigation.ts` (externalNavGroups array, findActiveGroup/findActiveItem helpers)
  - Mobile: Hamburger menu slides out full-screen nav overlay
  - **10 Top-Level Groups**:
    1. Framework → Home, My Products (saved), My Store, My Roadmap, My Profile, My Credentials
    2. Mentorship → /mentorship (courses)
    3. Product → Product Hunt, Winning Products, Categories, Seasonal Collections, Competitor Stores
    4. Videos & Ads → Meta Ads
    5. Order Fulfilment → Private Supplier, Selling Channels, Shipping Calculator
    6. Shopify → Shopify Integration
    7. Studio → Whitelabelling, Model Studio
    8. Important Tools → Description Generator, Email Templates, Policy Generator, Invoice Generator, Profit Calculator
    9. Blogs → /blogs (articles)
    10. Webinars → /webinars
- **Admin/Dev Users**: Original sidebar navigation (`AppSidebar` + `SidebarProvider`) preserved in `src/app/admin/layout.tsx` and `src/app/dev/layout.tsx`
- **Product Hunt**: Has dedicated left filter sidebar (category, sort, price range) with mobile toggle. Product cards have a save button that adds to user's My Products (in Framework).

## Recent Changes (Feb 2026)
- **Navigation restructured to 10 groups**: Framework, Mentorship, Product, Videos & Ads, Order Fulfilment, Shopify, Studio, Important Tools, Blogs, Webinars
- **Slug renames**: /academy→/mentorship, /my-journey→/my-roadmap, /intelligence→/blogs, /my-shopify-stores→/my-store, /ai-toolkit/*→/tools/*, /studio/*
- **New pages**: My Profile (/my-profile) for user business details, My Credentials (/my-credentials) for secure credential vault
- **New Supabase tables**: user_details (profile/business info), user_credentials (secure tool credential storage)
- **Campaign Studio deleted**: Removed from codebase
- **Navigation refactored**: Replaced sidebar with top bar navigation for all external user pages; admin/dev routes keep sidebar
- **Migrated to Supabase**: Full migration from Replit PostgreSQL + custom JWT auth to Supabase (database, auth, storage)
- **Data preserved**: 225 products, 11 categories, 2 subscription plans, 10 courses, 23 competitor stores, 4 test users (all in Supabase)

## Banner System
- **Consistent Format**: All sidebar pages use h-[154px] banners with 4-layer grainy texture, dark gradient background, 3D icon left, title/description center
- **Icon Set**: All banners use unique `/3d-ecom-icons-blue/` icons (no background, blue/white 3D style)
- **Icon Mapping**: winning-products=Trophy_Star, categories=Category_Grid, suppliers=Delivery_Truck, competitor-stores=Competitor_Search, blogs=Open_Board, selling-channels=Shopping_Cart, my-products=My_Products, my-store=My_Store, my-roadmap=Rocket_Launch, meta-ads=Megaphone_Ads, webinars=Webinar_Video
- **Exceptions**: product-hunt (no banner, uses tab layout), seasonal-collections (per-item banners), fulfillment (marketing page with Header/Footer), mentorship (white mentor portrait banner)

## Learning System
- **Routes**: `/mentorship` (course list with mentor banner), `/mentorship/[id]` (course viewer with video player)
- **API**: `/api/courses` (GET - returns published courses from `courses` table)
- **Home Page Widget**: CoursesWidget fetches latest 6 courses from `/api/courses` and displays them as cards linking to `/mentorship/[id]`
- **Framework group**: Personal hub with Home, My Products (saved items), My Store, My Roadmap, My Profile, My Credentials. All saved/collected items from other pages live here.

## User Preferences
- **Framework Concept**: Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- **Supabase Only**: Must use Supabase for auth, database, storage, and edge functions. Do NOT migrate to any other system.
- **Image Optimization**: Keep images compressed and loading fast.
