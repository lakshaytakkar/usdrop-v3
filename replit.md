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
- **Admin Panel:** Redesigned to match HR-Harmony-Hub reference. Uses Plus Jakarta Sans as primary `--font-sans` and `--font-heading`, blue primary (oklch 0.4099 0.2135 264.0522), radius 0.75rem. Layout: collapsible sidebar (`AdminSidebar` in `client/src/components/layout/admin-sidebar.tsx`) with SidebarProvider + `SidebarInset` + topbar with sidebar trigger, page title, search, notifications, user dropdown. Shared components in `client/src/components/admin-shared/`: PageShell (`px-16 py-6 lg:px-24`), PageHeader, HeroBanner, StatCard/StatGrid, SectionCard/SectionGrid, InfoRow/DetailSection, DataTable (rounded-xl bg-card, search/sort/filter/pagination/checkbox selection/row actions), StatusBadge, EmptyState, FormDialog. All admin pages rebuilt using DataTable pattern with working Add/Edit/Delete functionality. Nav groups: Overview (Dashboard), Users (Clients, Team, Leads), Catalog (Products, Categories, Suppliers), Content (Courses), Sales (Plans, Competitor Stores, Shopify Stores). Admin redirect after login handled by `getUserRedirectPath()` in `client/src/lib/utils/user-redirects.ts`.
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