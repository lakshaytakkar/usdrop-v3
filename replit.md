# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. It provides tools for product research, store management, marketing, and learning, aiming to streamline the dropshipping process for users. The platform is built to offer a comprehensive solution for e-commerce entrepreneurs.

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Keep images compressed and loading fast.

## User Journey (Core Business Flow)
1. **Public Pages** — Marketing/landing pages, feature pages (`/features/*`), What is Dropshipping, pricing info. No login required.
2. **Free User Registration** — Sign up via OTP email or Google OAuth. Gets `free` plan. Access to Framework (My Products, My Roadmap, My Learning basics, My Sessions, My R&D, My Profile, My Credentials, My Plan). Teaser access to products/stores (first 3-6 items visible, rest locked). AI Tools fully locked.
3. **Convert to Pro** — User enrolls in the mentorship dropshipping programme. Plan upgraded to `pro`. Unlocks all product research, competitor stores, suppliers, AI Studio tools, Meta Ads, Shopify integration, advanced learning content, and full sessions access.
4. **Elite LLC Package** — Pro users can purchase the Elite LLC package (via LegalNations partnership). Includes LLC formation, EIN, US mailing address, US phone, US bank account, ITIN assistance, resale certificate, Amazon/Shopify setup, dedicated account manager. Discount code `USDROP30` for 30% off. Resources and additional unlocks come with this tier.

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
- **Feb 2026**: Imported project to Replit environment. Supabase remains the sole database/auth/storage provider (project wecbybtxmkdkvqqahyuu). No local Neon database. Workflow configured to run `npm run dev` on port 5000 with webview output. All Supabase env vars (SUPABASE_URL, SUPABASE_ANON_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) set in shared environment.
- **Feb 2026**: Standardized loading system to exactly 2 types: BlueSpinner (round animated loader, blue-600) and Skeleton (pulse placeholder, 1s animation, blue-100 tint). Replaced 40+ raw Loader2/kokonutui loader instances across all user-facing and admin pages. Components: `BlueSpinner` (sizes sm/md/lg), `FullPageSpinner`, `InlineBlueSpinner`, `ButtonSpinner` in `blue-spinner.tsx`. Skeleton updated with faster 1s pulse in `skeleton.tsx`. Removed all `bg-gray-50/50` from 30 page wrappers for consistent blue gradient background inheritance.
- **Feb 2026**: Unified blueish gradient background across entire app. Applied `linear-gradient(135deg, #e8f4fd → #eaf5fc)` to AppLayout wrapper. Made topbar transparent with matching gradient + backdrop blur so it blends seamlessly instead of appearing as a separate white bar. Removed per-page background overrides (product-hunt, home) since they inherit from the layout.
- **Feb 2026**: Design system overhaul. Created comprehensive CSS design tokens (`ds-*` utility classes) in `index.css` for typography scale, text color roles, and spacing constants. Loaded DM Sans from Google Fonts. Applied tokens across all key pages: topbar navigation, sub-nav tabs, home page, product hunt, winning products, competitor stores, mentorship course cards, and store cards. Replaced scattered ad-hoc font sizes/weights/colors with semantic token classes for maintainability.
- **Feb 2026**: Complete Supabase migration. ALL database operations now go through Supabase (project wecbybtxmkdkvqqahyuu). Removed local Neon PostgreSQL connection entirely. Auth system reads/writes profiles from Supabase. Created 11 missing tables in Supabase (course_chapters, course_enrollments, chapter_completions, module_completions, quiz_attempts, competitor_store_products, dev_tasks, dev_task_attachments, dev_task_comments, dev_task_history, intelligence_articles). Dropped FK constraints to auth.users for custom JWT compatibility. Removed server/lib/db.ts and server/lib/supabase.ts (local query builder).
- **Feb 2026**: Added rhythmic gradient backgrounds to all marketing pages (landing, Shopify, What is Dropshipping). Each section has unique radial gradients using the palette colors (lavender, mint, pink, blue) that create visual flow as users scroll. MarketingLayout includes a subtle noise texture overlay at 3% opacity. GradientSection wrapper component in landing page for consistent section-level gradients.
- **Feb 2026**: Migrated from Next.js 16 to Vite + Express + Wouter stack for faster dev compilation. All 86 API routes migrated to Express, all 74 pages ported to client-side Wouter routing, auth system converted from SSR cookies to client-side JWT Bearer tokens.
- **Feb 2026**: Navigation restructuring. Renamed "Mentorship" to "My Learning". Added "My R&D" workspace page. Framework submenu items use numbered format "1) Item Name". All Framework pages routed under `/framework` prefix: `/framework` (home), `/framework/my-products`, `/framework/my-store`, `/framework/my-roadmap`, `/framework/my-learning`, `/framework/my-rnd`, `/framework/my-profile`, `/framework/my-credentials`. Legacy redirects from old paths (`/home`, `/my-products`, etc.) are in place.
- **Feb 2026**: My Roadmap page redesign. Increased font sizes throughout. Replaced team-controlled status dropdowns with user-controlled checkboxes (toggle between not_started/completed). Added generous side padding and page header with stats.
- **Feb 2026**: My R&D workspace page. Inline-editable spreadsheet with columns: date, category enum (Learning/Products/Ads/Store/Research/Fulfilment/Other), hours, and work summary/notes. Data persisted in Supabase `rnd_entries` table via GET/PUT `/api/rnd-entries` endpoints. Category summary pills shown below table.
- **Feb 2026**: Added "My Sessions" page replacing "Webinars". Shows 40 recorded live strategy sessions grouped by category (Foundation & Onboarding, Strategy & Mentorship, Product Research, Sourcing & Suppliers, Meta Ads). Accessible at `/framework/my-sessions` as Framework tab 6. Old `/webinars` route redirects to My Sessions. Sessions are strategy-focused recorded live working sessions by the mentor, distinct from "My Learning" which covers fundamentals. Features: search, category filters, collapsible groups, numbered session list, Watch buttons with lock overlay for free users.
- **Feb 2026**: Added colored tag pills to My Learning course cards showing course level (green=Beginner, amber=Intermediate, red=Advanced) and category (blue).
- **Feb 2026**: My Profile page redesign. Compressed layout with important fields first (Name, Email, Contact, Website), Business Details (LLC, EIN), and collapsible "More details" section for secondary fields (Social, Enrollment IDs, Tools). Removed Card wrappers, max-width 2xl, section icons.
- **Feb 2026**: Renamed "Fulfilment" to "Marketplaces" across all navigation surfaces (top nav, sidebar, sub-nav tabs, marketing mega menu, footer). Route URLs kept as-is.
- **Feb 2026**: Renamed landing page "My Dashboard" button to "My Framework" (desktop + mobile).
- **Feb 2026**: Moved "Private Supplier" from Marketplaces submenu to a top-level nav item. Redesigned the suppliers page from a card-listing into a professional static service page: explainer video section at top, green checkmark step-by-step process (6 steps), key stats row (rating, orders, min order, delivery), "Why Choose Us" 6-feature grid, account manager card with CTA, and gradient CTA banner. Sub-nav tabs hidden for single-item nav groups with no toolbar.
- **Feb 2026**: Moved LLC from Framework submenu to top-level nav item (like Private Supplier). Redesigned LLC page as marketing/conversion page: explainer video at top, locked/greyed-out fields section (LLC Name, EIN, Articles of Organization, Operating Agreement, Registered Agent, State of Formation) to create psychological urgency, 6 e-commerce benefit cards (Marketplace Approvals, US Bank Account, Payment Gateway, Asset Protection, US Credibility, Tax Benefits), "What You'll Get" checklist with green checkmarks, gradient CTA banner redirecting to sales page. Route: `/llc`. Sub-nav tabs hidden for single-item nav group.
- **Feb 2026**: Added "Free Learning" section to Framework homepage after welcome banner. Dynamically fetches all published courses from `/api/courses` endpoint (Supabase `courses` table). Shows each course as a preview card with thumbnail, title, module count, and duration. Each card links to `/framework/my-learning/{courseId}`. Replaced previous static hardcoded video list.
- **Feb 2026**: Reorganized AI Studio and Tools. **AI Studio** now contains only creative GenAI tools: Model Studio, Whitelabelling (image-based AI at `/ai-studio/*`). **Tools** consolidates all utility/template generators: Description Generator, Email Templates, Policy Generator, Invoice Generator, Profit Calculator, Shipping Calculator (6 items at `/tools/*`). Old `/ai-studio/*` routes kept as fallbacks. Removed search bars from AI Studio and Tools sub-navs (not needed). Added Video Tutorial action buttons to both AI Studio and Tools toolbars. Removed "More" dropdown from sub-nav — all tabs displayed inline with horizontal scroll. Resources page converted from card grid to list/table layout. Header nav font reduced to 14px.
- **Feb 2026**: Standardized all logged-in user routes to `/menu/submenu` pattern. Products: `/products/product-hunt`, `/products/winning-products`, `/products/categories`, `/products/seasonal-collections`, `/products/competitor-stores`. Ads: `/ads/meta-ads`. Private Supplier: `/private-supplier`. Framework, AI Studio, Tools already followed pattern. All old flat routes (`/product-hunt`, `/winning-products`, `/categories`, `/meta-ads`, `/suppliers`, etc.) redirect to new paths. Internal links updated across navigation, sidebar, home page, journey stages, and product detail breadcrumbs.
- **Feb 2026**: Marketing mega menu streamlined from 7 categories to 4: Products (Winning Products/Ads/Stores), Platform (Dashboard/Fulfilment/Shopify), Learn (Courses/Sessions/What is Dropshipping), LLC (standalone). Creatify-style text-only dropdowns with column headings, no icons or featured image cards. Nav items wrapped in a bordered pill container. 9 low-value marketing pages deleted (products-tracking, roadmap, blog, description-generator, email-templates, policy-generator, invoice-generator, profit-calculator, shipping-calculator).
- **Feb 2026**: Landing page redesign inspired by Creatify.ai. Hero rewritten to punchy "Find. Sell. Scale." headline (80px), one-line subtitle, clean black CTA button with "No credit card required" trust line. LogoMarquee upgraded with auto-scrolling CSS animation and "Supporting 10,000+ Sellers" headline. StatsBar reduced to 3 large stats (72px numbers). StepsSection condensed from 6 steps to 4 with text-only bullets (no icons). ProductShowcase removed from landing page. BentoFeatures heading upgraded to 64px bold. Testimonials metrics enlarged to 64px. FinalCTA widened with larger heading. Page background simplified from 10 radial gradients to 4. Section order: Hero → LogoMarquee → StatsBar → ImageCarousel → BentoFeatures → StepsSection → Testimonials → FinalCTA.
- **Feb 2026**: Feature page template redesign (Creatify URL-to-Video pattern). `FeaturePageTemplate` rebuilt with 5 sections: Hero (64px headline, black CTA, trust line, clean image without browser chrome), Pain Points (3-card grid with emoji + uppercase label + heading + description), Benefits (3 alternating image+text blocks, 55/45 split), How It Works (vertical numbered steps), Final CTA (dark wide banner with trust line). All 7 feature pages updated with contextual content: winning-products, winning-ads, winning-stores, live-dashboard, courses, live-sessions, fulfilment. Old horizontal scroll step cards replaced with vertical numbered layout.
