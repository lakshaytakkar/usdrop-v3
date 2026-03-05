# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI, designed to streamline the dropshipping process. It offers comprehensive tools for product research, store management, marketing, and learning, guiding users from registration through to advanced mentorship and business formation (Elite LLC Package). The platform aims to be a complete solution for e-commerce entrepreneurs.

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Keep images compressed and loading fast.
- Never use the Sparkles icon from lucide-react. It looks AI-generated and gimmicky.
- Never use gradient buttons (e.g., `bg-gradient-to-r from-blue-500 to-indigo-500`). Always use solid `bg-blue-500 hover:bg-blue-600` for primary buttons. Gradients look artificial.

## System Architecture
The platform is built with a modern web stack: Vite for frontend, Express for the backend API, and Wouter for client-side routing. It leverages React 19, TypeScript, and Tailwind CSS 4.

**Data Management:** All data is exclusively stored in Supabase (`wecbybtxmkdkvqqahyuu`). The `supabase-remote.ts` client manages all database interactions.

**Authentication:** Local JWT tokens handle authentication, with user profiles stored in Supabase. bcrypt and jsonwebtoken are used for token management.

**UI/UX:**
- **Components:** Built using Radix UI primitives and shadcn/ui, with Framer Motion for animations.
- **State Management:** TanStack React Query is used for data fetching and state management.
- **Design System:** Emphasizes a clean aesthetic with a flat `#F5F5F7` background, white cards with subtle borders, and specific design tokens (`ds-*` utility classes). The primary font is General Sans. Glass-morphism elements have been replaced with a cleaner, Creatify-style design.
- **Navigation:** The "Framework" serves as the user's central hub. All logged-in user routes follow a `/menu/submenu` pattern.
- **Visuals:** Standardized loading with `BlueSpinner` and `Skeleton` components.
- **Admin Panel:** A streamlined control panel with 5 sections: Dashboard | Clients | Products | Courses | Team. It features a horizontal top navigation bar (`AdminTopNavigation`) and a shared component library for consistent UI elements. Admin client pages include detailed user views with 6 tabs (Overview, Journey, Learning, Access Control, Activity, Notes) and comprehensive editing capabilities. The Access Control tab is organized by nav groups (My Mentorship, Products, Videos & Ads, etc.) with collapsible sections, per-module dropdowns, "Apply All" group controls, and a live nav preview panel. The Journey tab shows onboarding progress, course enrollments, roadmap status, Shopify stores, products saved, and credentials. The course builder is a 2-panel layout for module/lesson management and content editing.
- **Learning System:** Courses are accessible via `/mentorship` and `/mentorship/[id]`, with dynamic content from the `/api/courses` endpoint. Free learning lessons are tracked via server-side progress and can lead to a mentorship activation flow.

**Project Structure:**
- `client/`: Frontend (Vite + React) including pages, components, contexts, hooks, and utilities.
- `server/`: Backend (Express) containing API routes for authentication, administration, and public access.
- `script/`: Build scripts.

**Key Architectural Decisions:**
- **Supabase as SOLE Database:** For all data, authentication, and user profiles.
- **Client-Side JWT Authentication:** Using JWT Bearer tokens for client-side authentication.
- **Wouter for Routing:** Lightweight client-side routing with Next.js-compatible `useRouter()` APIs.
- **Unified API Pattern:** All API calls use `apiFetch()` for consistent authentication.
- **Core Framework & Navigation:** "Framework" serves as the user's central and personalized hub.
- **Module Access Control:** Implemented server-side module access overrides for users, controlling navigation visibility and access based on plan or admin settings. Page-level enforcement via `ModuleAccessGuard` component (`client/src/components/auth/module-access-guard.tsx`) wraps user-facing pages to block access when modules are set to `hidden` or `locked`.

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