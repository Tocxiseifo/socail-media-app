<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project

Social media app built with Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript.

- All app code lives in `app/`. Currently has only the root layout and index page.
- No database, auth, API routes, or tests are wired up yet.

## Commands

Run from `my-socalmediaapp/`:

- `npm run dev` — dev server on localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals + typescript presets)
- No test script is configured yet

## Key conventions

- UI work follows the design system in `DESIGN.md` ("Vesper": dark minimalist theme, Inter typography, violet primary accent, 8px spacing grid). Its tokens are not yet wired into `app/globals.css`, which still has create-next-app defaults.
- Tailwind v4 uses `@import "tailwindcss"` + `@theme inline` in `app/globals.css` (not the v3 `tailwind.config` file).
- Path alias `@/*` maps to the project root.
- `layout.tsx` uses `LayoutProps<"/">` — Next.js 16 typed layout props.
