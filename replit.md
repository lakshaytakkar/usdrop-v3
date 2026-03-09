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

**Data Management:** The database is **Replit's built-in PostgreSQL** via `pg` package and Drizzle ORM. The schema is defined in `shared/schema.ts`. A Supabase-compatible query builder layer (`server/lib/supabase-compat.ts`) wraps the local pg Pool, providing a drop-in Supabase-like API (`from().select().eq()...`) so all existing route files work without code changes. The `supabaseRemote` export from `server/lib/supabase-remote.ts` re-exports this local client.

**Supabase (External):** Supabase project `wecbybtxmkdkvqqahyuu` is still used for:
- **Auth Admin operations** (create/update/delete users via admin API) - routed through the compat layer
- **Storage** (file uploads, signed URLs) - routed through the compat layer's StorageCompat class
- **Client-side auth** (Google OAuth, OTP) via `server/lib/supabase-auth.ts`

**Authentication:** Local JWT tokens are used for authentication, with profiles stored in local Postgres. bcrypt + jsonwebtoken are used for token management.

**UI/UX:**
- Components are built using Radix UI primitives and shadcn/ui, with animations powered by Framer Motion.
- State management is handled by TanStack React Query.
- **Design System:** Uses DM Sans font family (with General Sans as the primary font via Fontshare CDN in later iterations). The design emphasizes a clean aesthetic with a flat `#F5F5F7` background, white cards with subtle borders, and specific design tokens (`ds-*` utility classes) for typography and spacing.
- **Navigation:** The "Framework" serves as the user's personal hub. Other pages act as browsing libraries and tools. All logged-in user routes follow a `/menu/submenu` pattern.
- **Visuals:** Standardized loading with `BlueSpinner` and `Skeleton` components.
- **Admin Panel:** Redesigned to match HR-Harmony-Hub reference. Uses Plus Jakarta Sans as primary font, blue primary color. Layout: horizontal two-level topbar navigation in `client/src/layouts/AdminLayout.tsx`. Shared components in `client/src/components/admin-shared/`.

**Project Structure:**
- `client/`: Frontend (Vite + React) containing pages, components, contexts, hooks, and client utilities.
- `server/`: Backend (Express) containing `index.ts` and API routes (auth, admin, public, etc).
- `server/lib/db.ts`: pg Pool connection to Replit Postgres
- `server/lib/supabase-compat.ts`: Supabase-compatible query builder wrapping local pg Pool
- `server/lib/supabase-remote.ts`: Re-exports localClient from supabase-compat
- `shared/schema.ts`: Drizzle ORM schema (~60 tables)
- `script/`: Build scripts.

**Key Architectural Decisions:**
- **Replit Postgres as primary database** with Supabase-compat drop-in layer for seamless migration
- **Client-Side JWT Authentication:** Bearer tokens via `apiFetch()`.
- **Wouter for Routing:** Lightweight client-side routing.
- **Environment Variables:** `VITE_` prefix for client-side, no prefix for server-side variables.

## External Dependencies
- **Replit PostgreSQL**: Primary database via `pg` + Drizzle ORM.
- **Supabase**: Auth admin operations and file storage only (`@supabase/supabase-js`).
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
- **Drizzle ORM + drizzle-kit**: Database ORM and schema management.
