# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. It provides tools for product research, store management, marketing, and learning, aiming to streamline the dropshipping process for users. The platform is built to offer a comprehensive solution for e-commerce entrepreneurs.

## User Preferences
- Framework is the personal hub (everything related to the user). Other pages are libraries/tools. All saved things live inside Framework.
- Must use Supabase for auth, database, storage, and edge functions. Do NOT migrate to any other system.
- Keep images compressed and loading fast.

## System Architecture
The platform is built with Next.js 16 (App Router), React 19, TypeScript 5.9, and Tailwind CSS 4. Supabase is used for the backend, encompassing PostgreSQL database, authentication, and storage. UI components are built using Radix UI primitives and shadcn/ui, with animations powered by Framer Motion. State management is handled by TanStack React Query.

**Key Architectural Decisions:**
- **Framework & Navigation System**: The "Framework" acts as the user's personal hub for saved items, store, roadmap, profile, and credentials. Other pages serve as browsing libraries and tools. External users interact via a top-bar navigation, while admin/dev users retain a sidebar navigation.
- **Authentication**: Supabase Auth handles email/password sign-in, with sessions managed via `@supabase/ssr` cookies and token refreshing middleware.
- **Database Interaction**: Supabase PostgreSQL is the primary database. Server-side database operations predominantly use `supabaseAdmin` (service role client) for elevated permissions, while client-side operations respect Row Level Security (RLS).
- **Design System**: Features an ethereal gradient background with ellipse SVGs, glass-morphism cards, specific typography with text-black headings and grey body text, and blue gradient accents for CTAs. Admin pages use a refined design system inspired by Suprans Team Portal / Event Hub Planner: subtle shadows (`shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]`), `hover-elevate` CSS utility for interactive feedback, `--elevate-1`/`--elevate-2` CSS variables, consistent stat cards with 36x36 icon boxes and change badges, and `text-xl font-semibold leading-[1.35] tracking-tight` headings.
- **Admin Panel**: Features a professionally designed admin interface with 4 sidebar groups (Overview, Sales & Clients, Content Library, Team). Active sidebar items use solid primary fill (`bg-primary text-white`), group labels use `text-[11px] font-semibold uppercase tracking-[0.08em]`. Includes a polished dashboard with stat cards, user breakdown chart, and platform summary. Leads & Sales page with pipeline stage tabs, detailed lead table, and lead detail drawer. Dedicated lead detail page at `/admin/leads/[id]` with engagement metrics, stage progression, quick actions, and notes management.
- **Banner System**: Consistent banners across sidebar pages, featuring a 4-layer grainy texture, dark gradient, 3D icon, and title/description. Icons are sourced from `/3d-ecom-icons-blue/`.
- **Learning System**: Courses are accessible via `/mentorship` and `/mentorship/[id]`, with an API (`/api/courses`) providing published course data.

## External Dependencies
- **Supabase**: PostgreSQL database, Authentication, Storage (used for all backend services).
- **Next.js**: Web framework.
- **React**: UI library.
- **TypeScript**: Programming language.
- **Tailwind CSS**: Styling framework.
- **Radix UI**: UI component primitives.
- **shadcn/ui**: UI component library.
- **Framer Motion**: Animation library.
- **TanStack React Query**: Data fetching and state management.
- **Tiptap**: Rich text editor.
- **Recharts**: Charting library.
- **Google Gemini API**: (Optional) For AI features.