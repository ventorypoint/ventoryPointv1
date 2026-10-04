# Working Rules

## Architecture
- This is a Next.js (App Router) + Supabase monolith.
- We use Turborepo + pnpm workspaces.
- `apps/web`: The Next.js frontend (UI + Server Actions).
- `packages/domain`: Zod schemas and core entities.
- `packages/services`: Business logic, third-party API adapters (WMS, ERP).
- `packages/data`: Database access and Supabase clients.

## Security
- Secrets only in environment stores.
- NO service-role keys in client components.
- Enforce RLS on all tables.

## Stack
- Next.js 15, Tailwind v4, Shadcn/ui.
- Supabase SSR, Zod.
- Lucide React icons.

## Data spine
- The `WarehouseEvent` is the core of the system.
