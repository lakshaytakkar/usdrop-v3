# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. It provides tools for product research, store management, marketing, and learning, aiming to streamline the dropshipping process for users. The platform offers a comprehensive solution for e-commerce entrepreneurs, guiding them from registration to advanced mentorship and business formation (Elite LLC Package).

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Keep images compressed and loading fast.
- **Never use the Sparkles icon** from lucide-react. It looks AI-generated and gimmicky.
- **Never use gradient buttons** (e.g., `bg-gradient-to-r from-blue-500 to-indigo-500`). Always use solid `bg-blue-500 hover:bg-blue-600` for primary buttons. Gradients look artificial.

## System Architecture
The platform utilizes a modern web stack: Vite for frontend bundling, Express for the backend API, and Wouter for client-side routing. It is built with React 19, TypeScript, and Tailwind CSS 4.

**Data Management:** All data is exclusively stored in **Supabase** (project `wecbybtxmkdkvqqahyuu`). There is no local Neon/PostgreSQL database connection. The `supabase-remote.ts` client handles all database operations.

**Authentication:** Local JWT tokens are used for authentication, with profiles stored in Supabase. bcrypt + jsonwebtoken are used for token management.

**UI/UX:**
- Components are built using Radix UI primitives and shadcn/ui, with animations powered by Framer Motion.
- State management is handled by TanStack React Query.
- **Design System:** Uses DM Sans font family (with General Sans as the primary font via Fontshare CDN in later iterations). The design emphasizes a clean aesthetic with a flat `#F5F5F7` background, white cards with subtle borders, and specific design tokens (`ds-*` utility classes) for typography and spacing. Glass-morphism elements have been replaced with a cleaner, Creatify-style design.
- **Navigation:** The "Framework" serves as the user's personal hub. Other pages act as browsing libraries and tools. All logged-in user routes follow a `/menu/submenu` pattern.
- **Visuals:** Standardized loading with `BlueSpinner` and `Skeleton` components. Consistent blueish gradient backgrounds (later changed to flat `#F5F5F7`) and unified banner systems with 3D icons are applied across the application.
- **Admin Panel:** Redesigned to match HR-Harmony-Hub reference. Uses Plus Jakarta Sans as primary `--font-sans` and `--font-heading`, blue primary (oklch 0.4099 0.2135 264.0522), radius 0.75rem. Layout: horizontal two-level topbar navigation in `client/src/layouts/AdminLayout.tsx` — level-1 rounded bordered bar with category tabs (Dashboard, Users, Catalog, Content, Sales) with animated underline indicator + logo + search + notifications + user dropdown; level-2 blue `bg-primary` rounded sub-nav bar showing sub-items when category has multiple pages. Shared components in `client/src/components/admin-shared/`: PageShell (`px-16 py-6 lg:px-24`), PageHeader, HeroBanner, StatCard/StatGrid, SectionCard/SectionGrid, InfoRow/DetailSection, DataTable (rounded-xl bg-card, search/sort/filter/pagination/checkbox selection/row actions), StatusBadge, EmptyState, FormDialog. All admin pages rebuilt using DataTable pattern with working Add/Edit/Delete functionality. Nav groups: Dashboard, Users (Clients, Team, Leads), Catalog (Products, Categories, Suppliers), Content (Courses, Sessions, Enrollments), Sales (Plans, Competitor Stores, Shopify Stores), CRM (Pipeline, Payment Links), Settings (Access Control). Admin redirect after login handled by `getUserRedirectPath()` in `client/src/lib/utils/user-redirects.ts`.
- **Learning System:** Courses are accessible via `/mentorship` and `/mentorship/[id]`, with dynamic content retrieval from the `/api/courses` endpoint.

**Project Structure:**
- `client/`: Frontend (Vite + React) containing pages, components, contexts, hooks, and client utilities.
- `server/`: Backend (Express) containing `index.ts` and API routes (auth, admin, public).
- `script/`: Build scripts.

**Key Architectural Decisions:**
- **Supabase as SOLE Database:** All data, authentication, and user profiles reside in Supabase.
- **Client-Side JWT Authentication:** Replaced SSR cookies with client-side JWT Bearer tokens.
- **Wouter for Routing:** Lightweight client-side routing with Next.js-compatible `useRouter()` APIs via a custom hook.
- **Unified API Pattern:** All API calls use `apiFetch()` for consistent authentication.
- **Environment Variables:** `VITE_` prefix for client-side, no prefix for server-side variables.
- **Core Framework & Navigation:** "Framework" as the user's central hub, distinct from other tool/library pages.

## External Dependencies
- **Supabase**: Database, authentication, and storage (`@supabase/supabase-js`).
- **Vite**: Frontend build tool and dev server.
- **Express**: Backend API server.
- **Wouter**: Client-side routing.
- **React**: UI library.
- **TypeScript**: Programming language.
- **Tailwind CSS 4**: Styling framework.
- **Radix UI**: UI component primitives.
- **shadcn/ui**: UI component library.
- **Framer Motion**: Animation library.
- **TanStack React Query**: Data fetching and state management.
- **Tiptap**: Rich text editor.
- **Recharts**: Charting library.
- **Google Gemini API**: For AI features.

## Database Tables Utilized
- **products** (20,034 rows): Merged from `tradelle_bestsellers` (19,183) + original products. Has `in_stock`, `buy_price`, `sell_price`.
- **competitor_stores** (35 rows): Merged from `tradelle_stores` (12) + `tradelle_competitors`.
- **intelligence_articles** (6 rows): Seeded with dropshipping articles. API: `GET /api/articles`, `GET /api/articles/:slug`.
- **suppliers** (8 rows): Seeded with real supplier data. API: `GET /api/suppliers`.
- **tradelle_bestsellers** (19,183 rows): Raw scraped data. API: `GET /api/tradelle/bestsellers` (paginated, searchable).
- **tradelle_trends** (936 rows): Trending products. API: `GET /api/tradelle/trends` (paginated, searchable).
- **lead_scores**: Auto-calculated lead scores per user. Unique on user_id. Fields: score, engagement_level (cold/warm/hot), auto_stage (new_lead/engaged/hot/contacted/converted/lost), manual_stage_override, assigned_rep_id, notes. API: `GET/PATCH /api/admin/pipeline`, `POST /api/admin/pipeline/:userId/recalculate`.
- **user_activity_log**: Tracks page_view, lesson_complete, login, signup, feature_click per user. API: `POST /api/activity/track`, `GET /api/admin/pipeline/:userId/activity`.
- **payment_links**: Payment link tracking (no checkout). Fields: lead_user_id, amount, title, status (pending/paid/expired/cancelled), payment_url. API: CRUD at `/api/admin/payment-links`, public at `GET /api/payment/:id`.
- **access_rules**: Per-plan access level rules. Unique on (plan_slug, resource_key). Fields: plan_slug (free/pro/mentorship), resource_type (page/feature/content), access_level (hidden/locked/teaser/full), teaser_limit. API: CRUD at `/api/admin/access-rules`, `GET /api/access/check`.
- **user_content_access**: Per-user granular content unlocks. Unique on (user_id, content_type, content_id). Fields: content_type (chapter/video/session), is_unlocked, unlocked_by. API: CRUD at `/api/admin/users/:userId/content-access`.
- **mentorship_sessions** (40 rows): Live strategy session recordings with Google Drive URLs. Fields: title, description, url, category (Foundation & Onboarding, Strategy & Mentorship, Product Research, Sourcing & Suppliers, Meta Ads), duration, session_date, order_index, is_published. API: Admin CRUD at `/api/admin/sessions`, public `GET /api/sessions`, journey `GET /api/admin/users/:userId/journey`, `POST /api/admin/users/:userId/unlock-journey`.

## Recent Changes
- **Free Learning Page** (`/free-learning`): Public-facing course page with 6 modules and 25 lessons covering dropshipping fundamentals. Lesson viewer at `/free-learning/:lessonId` with sidebar navigation, video player (YouTube embed or native), prev/next controls. Accessible without login. Added to app nav (before My Mentorship) and landing mega menu. Files: `client/src/pages/free-learning/` (page, data, [lessonId] viewer). Video URLs are placeholder — user will provide links.
- **Navigation Rename**: "Framework" top-level nav renamed to "My Mentorship". Sub-tab kept as "Framework".
- **DB Data Wiring**: All pages now fetch real data from Supabase APIs instead of hardcoded arrays. Hot Products page has 3 tabs (Hot Products, Bestsellers with 19K products, Trending with 936 products). Blogs/Intelligence Hub pages fetch from `/api/articles`. Suppliers page shows Partner Suppliers section with real DB data.
- **My Products Full CRUD**: Search bar (white bg) + "Add Product" button. Add Product choice modal (Import URL / Enter Manually). View Product centered modal shows image, title, description, buy/sell/profit cards, In Stock badge, added date, source. Edit Product modal with all fields + In Stock toggle (Switch). Table columns: Product, Category, Buy Price, Sell Price, Status (green "In Stock" / red "Out of Stock" badge), Added On, Actions (View, Shopify, Edit, Remove). Backend: `POST /api/products/create-manual`, `POST /api/products/import-url`, `PATCH /api/products/:id` (supports `in_stock`). DB: `in_stock` boolean column added to `products` table (default true), `source` column added to `user_picklist`.
- **LLC Page Redesign**: Major visual upgrade to match landing page premium design. Added: SVG gradient orbs behind hero, gradient "US LLC" accent text, animated gradient-bordered CTA buttons, Watch Video button, hero documents image, auto-scrolling logo marquee (Amazon, Walmart, Shopify, eBay, TikTok, Stripe, PayPal), stats bar, video thumbnail with overlay, image-enriched benefit cards with hover effects, indigo-accented pricing section, dark CTA section with noise texture. All sections wrapped in `MotionFadeIn` scroll animations. Images in `client/public/images/llc/`. FrameworkBanner added at top.
- **Private Supplier**: Removed from Marketplaces sub-nav tabs; now a standalone page with its own FrameworkBanner.
- **CRO Checklist**: Replaced lucide icons with 3D PNG icons (`client/public/images/cro-icons/`), added autosave to Supabase (`cro_checklist_state` table), removed export/reset buttons. API route: `server/routes/cro-checklist.ts`.
- **Shopify Stores page**: Added FrameworkBanner, Connect Store button in header, and a green gradient cross-sell banner promoting Shopify Website Development (links to `/llc` Elite plan).
- **LLC Elite plan**: Renamed "Shopify Store Setup" to "Shopify Website Development" with green highlight row and "New" badge in the comparison table.
- **Dashboard background**: Removed pastel gradient overlay to match the clean `#F5F5F7` app background.
- **Videos Page** (`/ads/videos`): Product video library in reels format (9:16 portrait cards). 30 sample videos with dropshipping product titles. Hover-to-play VideoCard component. Category filter pills + search. 5-column responsive grid. Registered under the "Ads" nav group alongside Meta Ads. Files: `client/src/pages/videos/` (page, data, components).
- **Logo Loader**: Animated text-based loader component (`client/src/components/ui/logo-loader.tsx`) with "USDrop AI" pulsing text and bouncing dots. No background, uses the logo font. Configurable message with animated ellipsis.
- **Mentorship Activation Flow**: After completing all 25 free learning lessons, "Start Course" button becomes "Activate Mentorship" on both listing and lesson viewer pages. Opens a 6-step MCQ modal (Contact Info → Experience → Goal → Budget → Referral → Confirm). Submits to `POST /api/mentorship-leads` (public, no auth). Data stored in Supabase `mentorship_leads` table. Lesson completion tracked via localStorage (`free-learning-completed` key). Files: `client/src/pages/free-learning/components/mentorship-activation-modal.tsx`, `server/routes/mentorship-leads.ts`.
- **Trending Products Page** (`/products/trending`): New page under the Products nav group. Shows products marked as `is_trending=true` in `product_metadata` table. 2-column grid layout with cards showing product image (left), trend line chart (right), product title (top), and dark "Show details" bar with chevron (bottom). Uses the same `/api/products?is_trending=true` endpoint. Admin product form has a "Mark as Trending" checkbox to toggle the flag. DB: `is_trending BOOLEAN NOT NULL DEFAULT false` column added to `product_metadata` table. Files: `client/src/pages/trending-products/page.tsx`, navigation in `client/src/data/navigation.ts`.
- **CRM & Sales Pipeline**: Full CRM system with automatic lead scoring. DB tables: `lead_scores` (auto-scored via formula: lessons×10 + page_views×1 + days_active×2; thresholds: 0-20=cold/new, 21-50=warm/engaged, 51+=hot), `user_activity_log`, `payment_links`. Activity tracking fires on page_view (per-session deduplicated), lesson_complete, and mentorship lead submission. Admin Pipeline page (`/admin/pipeline`) with Kanban board + table view, 6 stages (New/Engaged/Hot/Contacted/Converted/Lost), slide-over detail panel with stage override, rep assignment, notes, and recalculate. Stats bar with total/hot/conversion/avg. Admin Payment Links page (`/admin/payment-links`) with CRUD, status management (pending/paid/expired/cancelled), public payment page at `/payment/:id`. Nav: CRM category (Pipeline, Payment Links). Files: `server/routes/lead-scoring.ts`, `server/routes/activity-tracking.ts`, `server/routes/payment-links.ts`, `client/src/pages/admin/pipeline/page.tsx`, `client/src/pages/admin/payment-links/page.tsx`, `client/src/pages/payment/[id]/page.tsx`, `client/src/lib/activity-tracker.ts`.
- **Plan-Based Access Control (3 Tiers)**: Free/Pro/Mentorship plans with hidden/locked/teaser/full access levels. DB tables: `access_rules` (plan_slug + resource_key unique), `user_content_access` (per-user content unlocks). Admin Access Control page (`/admin/access-control`) with 3 tabs, rule CRUD, inline editing, pre-seeded known pages. Access check API at `GET /api/access/check` returns user's access map. Frontend hooks: `useAccessControl()` (canAccessPage, getAccessLevel, getTeaserLimit, isContentUnlocked), updated `useFeatureAccess()` with `isMentorship` flag. TeaserLockOverlay + TeaserItemOverlay components. Nav: Settings category (Access Control). Files: `server/routes/access-control.ts`, `client/src/pages/admin/access-control/page.tsx`, `client/src/hooks/use-access-control.ts`, `client/src/hooks/use-feature-access.ts`, `client/src/components/ui/teaser-lock-overlay.tsx`.
- **Per-User Content Control Panel**: Admin external user detail page (`/admin/external-users/:id`) rewritten with 4 tabs: Overview (existing user info), Content Access (toggle individual free learning lessons per user, bulk unlock/lock), Activity Log (chronological feed from user_activity_log, paginated), Lead Info (score, engagement, stage override, rep assignment, notes, recalculate). Files: `client/src/pages/admin/external-users/[id]/page.tsx`.
- **Admin Sessions Management**: Full CRUD page (`/admin/sessions`) for managing mentorship sessions. DB: `mentorship_sessions` table (40 sessions seeded from previously hardcoded data). DataTable with title, category badge, duration, date, published toggle, URL, actions. Stats cards, add/edit/delete forms, category filters. Files: `client/src/pages/admin/sessions/page.tsx`, `server/routes/admin-sessions.ts`. Nav: Content > Sessions.
- **Admin Enrollments Management**: Full page (`/admin/enrollments`) for managing course enrollments. DataTable with user avatar/name, course, enrolled date, progress bar, status badge, actions (Mark Complete, Reset Progress, Unenroll). Enroll User dialog with user/course selects. Stats: Total, Active, Completed, Avg Progress. Files: `client/src/pages/admin/enrollments/page.tsx`. Nav: Content > Enrollments.
- **My Sessions DB Migration**: Sessions page (`/framework/my-sessions`) now fetches from DB via `GET /api/sessions` instead of hardcoded array. Respects per-session unlock status from `user_content_access` (content_type='session').
- **Enhanced User Journey Control**: Content Access tab in user detail page now includes: Journey Control Bar (Unlock/Lock Everything, Upgrade to Mentorship buttons with status badges), Course Enrollments section (toggle enroll/unenroll per course with progress bars), Mentorship Sessions section (grouped by category with per-session unlock toggles and bulk category unlock), Learning Chapters section (existing free-learning toggles). Powered by `GET /api/admin/users/:userId/journey` and `POST /api/admin/users/:userId/unlock-journey` endpoints.
- **1-on-1 Mentorship Marketing Page** (`/1on1-mentorship`): Public landing page for upselling mentorship. Redesigned to match FeaturePageTemplate brand patterns (black CTAs, #FAFAFA cards, tight tracking, alternating image/text layout). Sections: Hero with workspace image + black CTA, animated stats bar, emoji pain points (3 cards), alternating image/text benefits (4 items with AI-generated realistic images), DIY vs Mentorship comparison table, testimonials (3 cards with revenue), bonuses checklist, FAQ accordion (6 items), final CTA with background image overlay. 6 AI-generated realistic images in `public/images/mentorship/`. Pricing intentionally hidden. Files: `client/src/pages/(marketing)/mentorship/page.tsx`.
- **My Products Source Tabs**: Added tabs (All Products, Saved from USDrop, Added by Me) to `/framework/my-products` page. Filters products by `source` field in `user_picklist` (winning-products/product-hunt = USDrop tab, manual/url-import/other = Added by Me tab). Tab-aware empty states and counts.
- **My Learning Page Redesign** (`/framework/my-learning`): Redesigned from grid of course cards to accordion-based layout matching Free Learning page style. Each course is a collapsible accordion showing course thumbnail, title, description, module count, lesson count, and duration. Expanding reveals module cards with thumbnails, descriptions, chapter counts, and "Watch" buttons linking to `/framework/my-learning/:id?module=:moduleId`. Teaser lock (first 3 free) preserved. Standardized spacing (`py-6 md:py-8`, `gap-6`).
- **My Apps Page** (`/framework/my-apps`): Framework page for managing external apps and their credentials. DB: `user_apps` table (app_name, app_url, app_icon, category, api_key, api_secret, access_token, client_id, client_secret, webhook_url, notes, status). Search + category filter, card grid with masked credential fields (show/hide/copy), Popular Apps quick-add dialog (Shopify, Stripe, Amazon, Meta, Google Ads, TikTok, PayPal, Mailchimp, Zapier, Slack). Full CRUD. API: `GET/POST/PUT/DELETE /api/user-apps`. Nav: My Mentorship > My Apps (item 11). Files: `client/src/pages/my-apps/page.tsx`.
- **LLC Page as Marketing Page**: `/llc` route changed from authenticated `UserGuard+AppLayout` to public `MarketingLayout`. Page now renders with the marketing header/footer, accessible without login.