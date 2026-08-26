# Vesper

A calm, curated social platform — social media after dark. Portfolio-grade build: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui (Base UI primitives), Inter.

## Status

**Frontend milestone complete.** All screens render against typed in-memory fixtures (`features/*/data.ts` → `fixtures.ts`); the backend (Next.js route handlers + MongoDB) is specified but not yet wired. Auth is simulated — every visitor sees the demo member (`@mira`).

- Product spec: `../PRODUCT_SPEC.md`
- Architecture: `../ARCHITECTURE.md`
- Database design: `../DATABASE.md`
- Engineering rules: `../PROJECT_RULES.md`
- Design system: `../doc/design.md`

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

No environment variables are required until the backend lands.

## Screens

| Route | Description |
|---|---|
| `/welcome` | Guest landing |
| `/signup`, `/login` | Auth forms (zod-validated, demo submit) |
| `/` | Home feed: composer, posts, likes, load-more |
| `/u/[username]` | Profile with Posts / Followers / Following tabs |
| `/post/[id]` | Post detail with comment thread |
| `/settings/profile` | Edit display name and bio |

## Conventions

Feature-based structure under `features/`; shared composites in `components/`; all visual values come from the Vesper token set in `app/globals.css`. See `../PROJECT_RULES.md` before contributing.
