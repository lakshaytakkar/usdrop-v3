# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. It provides tools for product research, store management, marketing, and learning, aiming to streamline the dropshipping process for users. The platform is built to offer a comprehensive solution for e-commerce entrepreneurs.

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Keep images compressed and loading fast.

## System Architecture
The platform uses a Vite + Express + Wouter stack with React 19, TypeScript, and Tailwind CSS 4. **All data lives in Supabase** (project `wecbybtxmkdkvqqahyuu`). There is NO local Neon/PostgreSQL database connection. The Supabase client (`server/lib/supabase-remote.ts`) handles all database operations via `@supabase/supabase-js`. Authentication uses local JWT tokens (bcrypt + jsonwebtoken) with profiles stored in Supabase. UI components are built using Radix UI primitives and shadcn/ui, with animations powered by Framer Motion. State management is handled by TanStack React Query.

### Supabase Tables (project wecbybtxmkdkvqqahyuu)
- **Product data**: products (844), product_metadata (844), product_source (844), product_research (239), categories (11), suppliers, competitor_stores (23), competitor_store_products
- **User data**: profiles (4), subscription_plans (2), user_picklist, user_details, user_credentials, shopify_stores, orders, leads, roadmap_progress
- **Learning**: courses (10), course_modules (69), course_chapters, course_enrollments, chapter_completions, module_completions, quiz_attempts, course_notes, onboarding_modules (6), onboarding_videos (19), onboarding_progress
- **Dev**: dev_tasks, dev_task_attachments, dev_task_comments, dev_task_history, intelligence_articles

### Project Structure
```
client/              # Frontend (Vite + React)
  src/
    pages/           # All page components (routed via Wouter)
    components/      # Shared UI components
    contexts/        # React contexts (auth, user plan, onboarding, etc.)
    hooks/           # Custom hooks (use-router, use-toast, etc.)
    lib/             # Client utilities (supabase client, services, utils)
    data/            # Static data files (navigation, models library, etc.)
  public/            # Static assets (images, icons, fonts)
  index.html         # Vite entry HTML
server/              # Backend (Express)
  index.ts           # Express server with Vite dev middleware
  routes/
    auth.ts          # Auth API routes (16 endpoints)
    admin.ts         # Admin API routes (30+ endpoints, admin middleware)
    public.ts        # Public API routes (40+ endpoints)
  lib/
    auth.ts          # JWT auth middleware (requireAuth, requireAdmin, optionalAuth) - queries Supabase
    supabase-remote.ts  # Supabase client instance (single source of truth for all DB operations)
script/
  build.ts           # Production build (Vite client + esbuild server)
```

### Key Architectural Decisions
- **Stack**: Vite (frontend bundler) + Express (API server) + Wouter (client-side routing). Migrated from Next.js for faster compilation.
- **Database**: Supabase is the ONLY database. All tables, auth data, and user data live in Supabase project `wecbybtxmkdkvqqahyuu`. No local Neon/PostgreSQL connection exists.
- **Authentication**: Local JWT authentication with bcrypt password hashing. Profiles stored in Supabase `profiles` table. The `apiFetch()` helper in `client/src/lib/supabase.ts` automatically attaches the Bearer token (stored in localStorage as `usdrop_auth_token`) to all API requests. Express middleware (`requireAuth`, `requireAdmin`, `optionalAuth`) validates JWT tokens server-side and loads user profile from Supabase. Token generation uses `jsonwebtoken` with 7-day expiry.
- **Routing**: Wouter handles client-side routing. The `use-router` hook (`client/src/hooks/use-router.ts`) provides Next.js-compatible `useRouter()`, `useParams()`, `useSearchParams()` APIs.
- **API Pattern**: All API calls go through `apiFetch()` which handles auth headers. Express routes are organized in `server/routes/` (auth, admin, public). All routes use `supabaseRemote` for database operations.
- **Environment Variables**: Client-side vars must be prefixed with `VITE_` (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Server-side vars use `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- **Framework & Navigation System**: The "Framework" acts as the user's personal hub for saved items, store, roadmap, profile, and credentials. Other pages serve as browsing libraries and tools. External users interact via a top-bar navigation, while admin/dev users retain a sidebar navigation.
- **Design System**: DM Sans font family loaded from Google Fonts (weights 400, 500, 600, 700). White background base with continuous flowing radial-gradient overlays (lavender, mint, pink, blue). Glass-morphism cards with blue gradient accents for CTAs. Design tokens defined in `index.css` as CSS utility classes: typography scale (`ds-page-title`, `ds-section-title`, `ds-card-title`, `ds-body`, `ds-label`, `ds-caption`, `ds-overline`, `ds-stat`), text color roles (`ds-text-heading`, `ds-text-body`, `ds-text-muted`, `ds-text-faint`, `ds-text-primary`), and spacing constants (`ds-page-padding`, `ds-card-padding`, `ds-section-gap`). Admin pages use a refined design system: subtle shadows, `hover-elevate` CSS utility, `--elevate-1`/`--elevate-2` CSS variables.
- **Admin Panel**: Features a professionally designed admin interface with 4 sidebar groups (Overview, Sales & Clients, Content Library, Team). Active sidebar items use solid primary fill (`bg-primary text-white`), group labels use `text-[11px] font-semibold uppercase tracking-[0.08em]`.
- **Banner System**: Consistent banners across sidebar pages, featuring a 4-layer grainy texture, dark gradient, 3D icon, and title/description. Icons are sourced from `/3d-ecom-icons-blue/`.
- **Learning System**: Courses are accessible via `/mentorship` and `/mentorship/[id]`, with an API (`/api/courses`) providing published course data.

### Dev Workflow
- `npm run dev` - Starts Express server with Vite dev middleware on port 5000
- `npm run build` - Builds client (Vite) and server (esbuild) to `dist/`
- Production: `node dist/index.cjs`

## External Dependencies
- **Supabase**: All database operations via `@supabase/supabase-js` (project `wecbybtxmkdkvqqahyuu`).
- **Vite**: Frontend build tool and dev server.
- **Express**: Backend API server.
- **Wouter**: Client-side routing (lightweight React router).
- **React**: UI library.
- **TypeScript**: Programming language.
- **Tailwind CSS 4**: Styling framework (with @tailwindcss/vite plugin).
- **Radix UI**: UI component primitives.
- **shadcn/ui**: UI component library.
- **Framer Motion**: Animation library.
- **TanStack React Query**: Data fetching and state management.
- **Tiptap**: Rich text editor.
- **Recharts**: Charting library.
- **Google Gemini API**: (Optional) For AI features.

## Recent Changes
- **Feb 2026**: Unified blueish gradient background across entire app. Applied `linear-gradient(135deg, #e8f4fd → #eaf5fc)` to AppLayout wrapper. Made topbar transparent with matching gradient + backdrop blur so it blends seamlessly instead of appearing as a separate white bar. Removed per-page background overrides (product-hunt, home) since they inherit from the layout.
- **Feb 2026**: Design system overhaul. Created comprehensive CSS design tokens (`ds-*` utility classes) in `index.css` for typography scale, text color roles, and spacing constants. Loaded DM Sans from Google Fonts. Applied tokens across all key pages: topbar navigation, sub-nav tabs, home page, product hunt, winning products, competitor stores, mentorship course cards, and store cards. Replaced scattered ad-hoc font sizes/weights/colors with semantic token classes for maintainability.
- **Feb 2026**: Complete Supabase migration. ALL database operations now go through Supabase (project wecbybtxmkdkvqqahyuu). Removed local Neon PostgreSQL connection entirely. Auth system reads/writes profiles from Supabase. Created 11 missing tables in Supabase (course_chapters, course_enrollments, chapter_completions, module_completions, quiz_attempts, competitor_store_products, dev_tasks, dev_task_attachments, dev_task_comments, dev_task_history, intelligence_articles). Dropped FK constraints to auth.users for custom JWT compatibility. Removed server/lib/db.ts and server/lib/supabase.ts (local query builder).
- **Feb 2026**: Added rhythmic gradient backgrounds to all marketing pages (landing, Shopify, What is Dropshipping). Each section has unique radial gradients using the palette colors (lavender, mint, pink, blue) that create visual flow as users scroll. MarketingLayout includes a subtle noise texture overlay at 3% opacity. GradientSection wrapper component in landing page for consistent section-level gradients.
- **Feb 2026**: Migrated from Next.js 16 to Vite + Express + Wouter stack for faster dev compilation. All 86 API routes migrated to Express, all 74 pages ported to client-side Wouter routing, auth system converted from SSR cookies to client-side JWT Bearer tokens.
