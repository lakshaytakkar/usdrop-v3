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

**Authentication:** Local JWT tokens are used for authentication, with profiles stored in Supabase. bcrypt + jsonwebtoken are used for token management. Supabase Auth is used for Google OAuth and OTP via `server/lib/supabase-auth.ts`.

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
