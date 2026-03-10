# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. It provides tools for product research, store management, marketing, and learning, aiming to streamline the dropshipping process for users. The platform offers a comprehensive solution for e-commerce entrepreneurs, guiding them from registration to advanced mentorship and business formation (Elite LLC Package).

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Keep images compressed and loading fast.
- **Never use the Sparkles icon** from lucide-react. It looks AI-generated and gimmicky.
- **Never use gradient buttons** (e.g., `bg-gradient-to-r from-blue-500 to-indigo-500`). Always use solid `bg-blue-500 hover:bg-blue-600` for primary buttons. Gradients look artificial.
- **Supabase is the sole database.** Do NOT use Replit Postgres. All data lives in Supabase project `wecbybtxmkdkvqqahyuu`.

## System Architecture
The platform utilizes a modern web stack: Vite for frontend bundling, Express for the backend API, and Wouter for client-side routing. It is built with React 19, TypeScript, and Tailwind CSS 4.

**Data Management:** All data is exclusively stored in **Supabase** (project `wecbybtxmkdkvqqahyuu`). The `supabaseRemote` client in `server/lib/supabase-remote.ts` handles all database operations using `@supabase/supabase-js`.

**Authentication:** Local JWT tokens are used for authentication, with profiles stored in Supabase. bcrypt + jsonwebtoken are used for token management. Supabase Auth is used for Google OAuth and OTP via `server/lib/supabase-auth.ts`. The `profiles` table `id` column has no server-side default — all inserts must explicitly provide a UUID. For email/password signup, `crypto.randomUUID()` is used. For Google OAuth and OTP flows, the Supabase Auth user ID (`supabaseUser.id`) is used to maintain linkage with `auth.users`.

**UI/UX:**
- Components are built using Radix UI primitives and shadcn/ui, with animations powered by Framer Motion.
- State management is handled by TanStack React Query.
- **Design System:** Uses DM Sans font family (with General Sans as the primary font via Fontshare CDN). The design emphasizes a clean aesthetic with a flat `#F5F5F7` background, white cards with subtle borders.
- **Navigation:** The "Framework" serves as the user's personal hub. Other pages act as browsing libraries and tools. All logged-in user routes follow a `/menu/submenu` pattern.
- **Admin Panel:** Redesigned to match HR-Harmony-Hub reference. Uses Plus Jakarta Sans as primary font, blue primary color. Horizontal two-level topbar navigation in `client/src/layouts/AdminLayout.tsx`. Shared components in `client/src/components/admin-shared/`.

**Project Structure:**
- `client/`: Frontend (Vite + React) containing pages, components, contexts, hooks, and client utilities.
- `server/`: Backend (Express) containing `index.ts` and API routes (auth, admin, public, etc).
- `server/lib/supabase-remote.ts`: Server-side Supabase client (service role key)
- `server/lib/supabase-auth.ts`: Supabase Auth client for OAuth/OTP
- `server/lib/auth.ts`: JWT authentication middleware
- `shared/schema.ts`: Drizzle ORM schema (kept for reference, not actively used for DB)
- `script/`: Build scripts.

**Key Architectural Decisions:**
- **Supabase as SOLE Database:** All data, authentication, storage, and user profiles reside in Supabase.
- **Client-Side JWT Authentication:** Bearer tokens via `apiFetch()`.
- **Wouter for Routing:** Lightweight client-side routing.
- **Environment Variables:** `VITE_` prefix for client-side, no prefix for server-side variables.

**Supabase Tables (custom):**
- `user_ad_logs`: Per-user ad campaign log data (audiences, adsets, creatives, results as JSONB). Keyed by `user_id` (unique, FK to profiles).
- `shopify_stores`: Connected Shopify stores per user. Columns: id, user_id, shop_domain, access_token, store_name, store_email, plan, is_active, currency, last_synced_at, created_at, updated_at.
- `shopify_store_products`: Synced products from connected Shopify stores. FK to shopify_stores. Unique on (store_id, shopify_product_id).
- `shopify_store_orders`: Synced orders from connected Shopify stores. FK to shopify_stores. Unique on (store_id, shopify_order_id).
- `store_claims`: Done-for-you store claims. Columns: id (UUID), user_id, store_name, niche, status (pending/processing/ready/claimed/cancelled/failed/awaiting_connection), shopify_store_url, shopify_admin_url, products_count, template_applied, notes, created_at, updated_at, claimed_at. RLS enabled.

**Shopify Integration:**
- OAuth flow via `server/routes/shopify.ts` and `server/lib/shopify-oauth.ts`.
- Client ID stored in env var `SHOPIFY_CLIENT_ID`, secret in `SHOPIFY_CLIENT_SECRET`.
- OAuth callback: `/api/shopify-stores/oauth/callback` — exchanges code for access token, fetches store info, upserts in Supabase, redirects to `/framework/my-store`.
- Sync endpoint: `POST /api/shopify-stores/:id/sync` — pulls products and orders from Shopify Admin API and upserts into Supabase.
- Frontend: `client/src/pages/my-store/` — connect modal, store list with sync/disconnect, products/orders counts.
- Store detail page: `client/src/pages/my-store/[id]/page.tsx` with tabs (Overview/Products/Orders) and sub-components in `[id]/components/`. Route: `/framework/my-store/:id`.
- Important: The Shopify app's "Allowed redirection URL(s)" in Shopify Partner Dashboard must include the callback URL.
- **Claim Your Store**: Multi-step wizard at `/claim-store`. Backend: `server/routes/store-claims.ts`. Frontend: `client/src/pages/claim-store/page.tsx`. Navigation via user dropdown menu. Steps: Choose Plan → Store Details → Review → Awaiting Connection. After review, user is directed to sign up on Shopify via partner referral (`shopify.pxf.io/usdrop`), then connect their new store via the existing OAuth flow. On successful OAuth connect, `advanceAwaitingClaim` in `server/routes/shopify.ts` automatically transitions the claim from `awaiting_connection` to `claimed`.
- **Trending Products**: 106 trending products in Supabase (`product_metadata.is_trending=true`). Trending page at `/trending-products` uses infinite scroll (6 items per load, IntersectionObserver). Source type: `trending` in `product_source` table.
- **Push to Shopify**: `POST /api/shopify-stores/:storeId/products/push` — pushes a USDrop product to the user's connected Shopify store as a draft. Backend: `server/routes/shopify.ts` + `createShopifyProduct` in `server/lib/shopify-oauth.ts`. Frontend: Shopify button on My Products page with single/multi-store selection.
- **Shopify Embedded App**: Standalone HTML app served at `GET /shopify-app?shop=xxx.myshopify.com` for embedding inside Shopify Admin. Routes: `server/routes/shopify-app.ts`. Frontend: `server/shopify-app/index.html` (vanilla JS + Tailwind CDN, no React). Auth: HMAC verification + shop domain lookup in `shopify_stores`. Contains 3 tools: Profit Calculator (per-product revenue/profit/margin from orders), Price Editor (inline edit + bulk push to Shopify via `updateShopifyProductPrice`), SEO Scorer (product title/description/image/tags analysis with scores). API endpoints: `GET /shopify-app/api/products`, `GET /shopify-app/api/orders`, `PUT /shopify-app/api/products/:productId/price`.

**Email System (Resend Integration):**
- `server/lib/resend.ts`: Resend email client via Replit connector pattern (getUncachableResendClient). Includes `sendEmail()` wrapper that sends and logs to Supabase.
- `server/lib/email-templates.ts`: 34+ on-brand HTML email templates (responsive, DM Sans, blue accent, mobile-optimized) covering full user journey: Signup, Onboarding, Free Learning, Mentorship, Store Setup, LLC Formation, Re-engagement, Retention, Marketing.
- `server/lib/email-automation.ts`: Automation engine — `triggerAutomation(event, userId, metadata)` fires on user events. Seeds default automations on startup. Supports 24 trigger types including `onboarding_completed`, `course_started`, `course_completed`, `lesson_completed`, `mentorship_assigned`, `mentorship_week_advanced`, `store_connected`, `store_claimed`, `products_uploaded`, `llc_status_changed`, `user_inactive`, `milestone_reached`.
- `server/routes/email.ts`: Admin-only API routes for templates, automations, and logs CRUD.
- Admin pages: `client/src/pages/admin/email/templates/`, `automations/`, `logs/`
- Admin nav: "Communications" category in `AdminLayout.tsx` topbar.
- Supabase tables: `email_templates`, `email_automations`, `email_logs`, `email_otps`
- Triggers integrated into: auth signup, plan changes, store connection, store claims, LLC status, mentorship, course/lesson progress, onboarding
- **Send Email Drawer**: Admin user detail page (`client/src/pages/admin/users/[id]/`) includes a slide-out Sheet drawer (`send-email-drawer.tsx`) to send templated or custom emails to users via Resend. Features: template picker with category grouping, auto-fill user profile variables (name, email, plan), HTML preview via sandboxed iframe, custom HTML composition. Triggered via "Email" quick action button in user header.
- **Email OTP Signup Flow**: Email/password signup is now 2-step: (1) `POST /api/auth/signup` validates input, hashes password, sends 6-digit OTP via Resend from `admin@usdrop.ai`, stores OTP + hashed password in `email_otps` table. (2) `POST /api/auth/signup/verify` verifies OTP, creates profile, issues JWT, triggers `user_signup` welcome automation. Resend endpoint: `POST /api/auth/signup/resend`. OTPs expire in 10 minutes, max 5 attempts. Frontend: `signup-form.tsx` handles both steps (form → OTP input).
- **Mobile OTP Signup Flow**: Phone number signup with +91 default prefix. Routes: `POST /api/auth/signup/mobile` (send OTP via Twilio SMS), `POST /api/auth/signup/mobile/verify` (verify + create account), `POST /api/auth/signup/mobile/resend`. OTP stored in `email_otps` table (email column stores phone number). Profile created with `phone_number` and placeholder email (`{digits}@phone.usdrop.ai`). Frontend: `signup-form.tsx` has Mobile/Email toggle, Mobile is default tab. Phone input restricted to 10 digits with fixed +91 prefix.

**SMS System (Twilio Integration):**
- `server/lib/twilio.ts`: Twilio client via Replit connector pattern. Exports `getTwilioClient()`, `getTwilioFromPhoneNumber()`, `sendSms(to, body)`. Connected via Replit integration (account SID + API key auth). From number: `+15015222136`. Paid account active.
- `server/lib/sms-automation.ts`: SMS automation engine — `triggerSmsAutomation(event, userId, metadata)` fires on user events (same triggers as email). Seeds 31 default SMS templates and automations on startup via `seedSmsTemplatesAndAutomations()`.
- `server/routes/sms.ts`: Admin-only API routes for SMS templates, automations, and logs CRUD (mirrors email.ts structure).
- Admin pages: `client/src/pages/admin/sms/templates/`, `automations/`, `logs/`
- Supabase tables: `sms_templates`, `sms_automations`, `sms_logs`
- SMS templates cover full user journey: Signup, Onboarding, Free Learning, Plan Upgrade, Mentorship, Store Setup, LLC Formation, Re-engagement, Retention (31 templates total).
- Triggers integrated alongside email automations in: auth signup, plan changes, store connection, store claims, LLC status changes, mentorship assignment, course/lesson progress, onboarding completion.

**User Routing:**
- Free users default to `/free-learning` after login/signup (via `getUserRedirectPath` in `client/src/lib/utils/user-redirects.ts`)
- Pro users default to `/home`
- Internal/admin users default to `/admin`
- Login fallback for unknown plan: `/free-learning`

## External Dependencies
- **Supabase**: Database, authentication, and storage (`@supabase/supabase-js`).
- **Vite**: Frontend build tool and dev server.
- **Express**: Backend API server.
- **Wouter**: Client-side routing.
- **React 19**: UI library.
- **TypeScript**: Programming language.
- **Tailwind CSS 4**: Styling framework.
- **Radix UI**: UI component primitives.
- **shadcn/ui**: UI component library.
- **Framer Motion**: Animations.
- **TanStack React Query**: Data fetching / state management.
- **Twilio**: SMS messaging via Replit connector integration (`twilio` npm package).
