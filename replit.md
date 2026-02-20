# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. It provides tools for product research, store management, marketing, and learning, aiming to streamline the dropshipping process for users. The platform is built to offer a comprehensive solution for e-commerce entrepreneurs.

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Keep images compressed and loading fast.

## System Architecture
The platform uses a Vite + Express + Wouter stack with React 19, TypeScript, and Tailwind CSS 4. Neon PostgreSQL (via Replit's built-in database) is used for the backend database, with local JWT authentication (bcrypt + jsonwebtoken). A Supabase-compatible query builder wraps the `postgres` library to provide the same `.from().select().eq()` API. UI components are built using Radix UI primitives and shadcn/ui, with animations powered by Framer Motion. State management is handled by TanStack React Query.

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
    auth.ts          # JWT auth middleware (requireAuth, requireAdmin, optionalAuth)
    supabase.ts      # Supabase client & admin instances
script/
  build.ts           # Production build (Vite client + esbuild server)
```

### Key Architectural Decisions
- **Stack**: Vite (frontend bundler) + Express (API server) + Wouter (client-side routing). Migrated from Next.js for faster compilation.
- **Authentication**: Local JWT authentication with bcrypt password hashing. The `apiFetch()` helper in `client/src/lib/supabase.ts` automatically attaches the Bearer token (stored in localStorage as `usdrop_auth_token`) to all API requests. Express middleware (`requireAuth`, `requireAdmin`, `optionalAuth`) validates JWT tokens server-side. Token generation uses `jsonwebtoken` with 7-day expiry.
- **Routing**: Wouter handles client-side routing. The `use-router` hook (`client/src/hooks/use-router.ts`) provides Next.js-compatible `useRouter()`, `useParams()`, `useSearchParams()` APIs.
- **API Pattern**: All API calls go through `apiFetch()` which handles auth headers. Express routes are organized in `server/routes/` (auth, admin, public).
- **Environment Variables**: Client-side vars must be prefixed with `VITE_` (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Server-side vars use standard `process.env`.
- **Framework & Navigation System**: The "Framework" acts as the user's personal hub for saved items, store, roadmap, profile, and credentials. Other pages serve as browsing libraries and tools. External users interact via a top-bar navigation, while admin/dev users retain a sidebar navigation.
- **Database Interaction**: Neon PostgreSQL (Replit built-in) is the primary database. Schema is defined in `shared/schema.ts` using Drizzle ORM. Server-side database operations use a Supabase-compatible query builder (`server/lib/supabase.ts`) that wraps the `postgres` library, providing the same `.from().select().eq().single()` API for minimal code changes during migration.
- **Design System**: Features an ethereal gradient background with ellipse SVGs, glass-morphism cards, specific typography with text-black headings and grey body text, and blue gradient accents for CTAs. Admin pages use a refined design system: subtle shadows (`shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]`), `hover-elevate` CSS utility, `--elevate-1`/`--elevate-2` CSS variables, consistent stat cards with 36x36 icon boxes and change badges, and `text-xl font-semibold leading-[1.35] tracking-tight` headings.
- **Admin Panel**: Features a professionally designed admin interface with 4 sidebar groups (Overview, Sales & Clients, Content Library, Team). Active sidebar items use solid primary fill (`bg-primary text-white`), group labels use `text-[11px] font-semibold uppercase tracking-[0.08em]`.
- **Banner System**: Consistent banners across sidebar pages, featuring a 4-layer grainy texture, dark gradient, 3D icon, and title/description. Icons are sourced from `/3d-ecom-icons-blue/`.
- **Learning System**: Courses are accessible via `/mentorship` and `/mentorship/[id]`, with an API (`/api/courses`) providing published course data.

### Dev Workflow
- `npm run dev` - Starts Express server with Vite dev middleware on port 5000
- `npm run build` - Builds client (Vite) and server (esbuild) to `dist/`
- Production: `node dist/index.cjs`

## External Dependencies
- **PostgreSQL (Neon)**: Database via Replit's built-in DATABASE_URL.
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
- **Feb 2026**: Migrated from Supabase to Replit's Neon PostgreSQL. Replaced Supabase Auth with local JWT auth (bcrypt + jsonwebtoken). Created Supabase-compatible query builder in `server/lib/supabase.ts` that wraps the `postgres` library. Database schema defined in `shared/schema.ts` with Drizzle ORM (30 tables). Client auth updated to use localStorage token storage.
- **Feb 2026**: Migrated from Next.js 16 to Vite + Express + Wouter stack for faster dev compilation. All 86 API routes migrated to Express, all 74 pages ported to client-side Wouter routing, auth system converted from SSR cookies to client-side JWT Bearer tokens.
