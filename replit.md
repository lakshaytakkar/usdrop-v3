# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. It provides tools for product research, store management, marketing, and learning, aiming to streamline the dropshipping process for users. The platform offers a comprehensive solution for e-commerce entrepreneurs, guiding them from registration to advanced mentorship and business formation (Elite LLC Package).

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Keep images compressed and loading fast.

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
- **Admin Panel:** Features a professionally designed interface with a distinct sidebar navigation and specific styling for active items and group labels.
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