# USDrop AI Platform (usdrop-v3)

## Overview
USDrop is an all-in-one dropshipping platform powered by advanced AI. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase for backend/auth.

## Project Architecture
- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Radix UI primitives + shadcn/ui + Framer Motion
- **Backend**: Supabase (auth, database, storage)
- **State Management**: TanStack React Query
- **Rich Text**: Tiptap editor
- **Charts**: Recharts

## Project Structure
```
src/
  app/          - Next.js App Router pages and API routes
  components/   - Reusable React components
  contexts/     - React context providers
  data/         - Static data/constants
  hooks/        - Custom React hooks
  lib/          - Utility libraries (Supabase client, etc.)
  middleware.ts - Auth middleware (Supabase SSR)
  types/        - TypeScript type definitions
public/         - Static assets (images, icons)
docs/           - Project documentation
```

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_SITE_URL` - Site URL
- `NEXT_PUBLIC_GEMINI_API_KEY` - Google Gemini API key (optional, for AI features)

## Development
- Dev server: `npm run dev` (runs on port 5000, bound to 0.0.0.0)
- Build: `npm run build`
- Start: `npm start`

## Recent Changes
- Configured for Replit environment (port 5000, allowed dev origins)
