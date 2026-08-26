# PROJECT_RULES.md

> This document is the single source of truth for how this project is built. It governs architecture, coding standards, and AI agent behavior across all development sessions. Every contributor — human or AI — must read and follow these rules before writing code.

---

## 1. Project Overview

### What We Are Building
A modern social media platform combining photo/visual sharing with short-form text posts (a hybrid of Instagram-style media feeds and Twitter-style microblogging). This is a learning and portfolio project, meaning code quality, architectural clarity, and demonstrable best practices matter as much as feature completeness.

### Main Goals
- Build a production-quality, full-stack social media application.
- Demonstrate strong command of modern React/Next.js architecture.
- Produce a codebase that is clean, scalable, and easy for a reviewer (e.g., a hiring manager or senior engineer) to read and understand.
- Support an eventual database migration path (MongoDB → PostgreSQL) without a full rewrite.
- Treat this as a real product, not a tutorial project — no shortcuts that wouldn't survive a code review at a real company.

### Development Philosophy
- **Correctness and clarity over speed.** A slower, well-reasoned implementation beats a fast, fragile one.
- **Incremental progress.** Ship small, verifiable slices of functionality rather than large untested changes.
- **Maintainability over cleverness.** Code should be boring and predictable, not impressive.
- **Explicit over implicit.** Prefer clear types, clear names, and clear data flow over "magic."
- **Consistency across sessions.** Every session should look like it was written by the same disciplined engineer, even if built incrementally over time.

---

## 2. Architecture Rules

### Recommended Folder Structure
```
src/
├── app/                        # Next.js App Router routes only (thin, composition-focused)
│   ├── (auth)/                 # Route groups for auth-related pages
│   ├── (main)/                 # Route groups for core app pages
│   ├── api/                    # Route handlers (backend API layer)
│   └── layout.tsx
├── features/                   # Feature-based modules (core organizational unit)
│   ├── feed/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/                # React Query hooks + fetchers for this feature
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── posts/
│   ├── profile/
│   ├── auth/
│   └── notifications/
├── components/                 # Shared, cross-feature UI components
│   └── ui/                     # shadcn/ui primitives live here
├── lib/                        # Cross-cutting utilities (db client, api client, helpers)
│   ├── db/                     # Database connection + models/schemas
│   ├── api/                    # Shared fetch wrapper, error handling
│   ├── validation/             # Zod schemas shared between client/server
│   └── utils/
├── hooks/                      # Truly global, cross-feature hooks
├── stores/                     # Zustand stores (only for genuine global client state)
├── types/                      # Global/shared TypeScript types
├── config/                     # App-wide constants and configuration
└── middleware.ts
```

### Feature-Based Organization
- The `features/` directory is the primary organizational unit — not "pages" or "components" as flat top-level folders.
- Each feature folder is self-contained: it owns its components, hooks, API calls, and types.
- A feature should never reach into another feature's internals directly. Shared logic goes into `lib/`, `components/`, or `types/`.
- Route files under `app/` should be thin — they compose feature components, they don't contain business logic.

### Separation Between UI, Business Logic, and Data Layer
Every feature should respect three layers:
1. **UI layer** (`components/`) — presentational, receives data and callbacks via props, contains minimal logic.
2. **Logic layer** (`hooks/`) — custom hooks orchestrate state, side effects, and data transformations.
3. **Data layer** (`api/`) — React Query hooks and fetch functions; the only place that knows about endpoints and payload shapes.

Rule: **components never call `fetch` directly.** All data access flows through the data layer.

---

## 3. React / Next.js Rules

### When to Use Server Components (default)
- Any component that fetches data used only for initial render.
- Any component with no interactivity, state, or browser-only APIs.
- Layouts, static sections, SEO-relevant content.
- Default assumption: **a component is a Server Component unless it needs to be a Client Component.**

### When to Use Client Components
- Component uses `useState`, `useEffect`, `useContext`, or any React hook that requires the client runtime.
- Component uses browser-only APIs (localStorage equivalents, window, etc.).
- Component requires interactivity: forms, buttons with handlers, modals, drag-and-drop.
- Component uses React Query or Zustand directly.
- Mark with `"use client"` at the top, and keep these components as small and low as possible in the tree ("push client components to the leaves").

### Component Design Principles
- One component = one responsibility. If a component needs a comment to explain "and also it does X," split it.
- Prefer composition over configuration — many small components combined, rather than one component with a dozen boolean props.
- Presentational components must be pure functions of their props; no side effects or data fetching inside them.
- Container/orchestrating components (hooks-driven) are separated from presentational components.
- No component file should exceed ~200 lines as a soft ceiling — if it does, extract subcomponents or hooks.

### Hooks Rules
- Custom hooks encapsulate all non-trivial logic — components should read like a summary, not an implementation.
- One hook = one concern (e.g., `useFeedPosts`, not `useFeedEverything`).
- Data-fetching hooks live in the feature's `api/` folder and wrap React Query (`useQuery`/`useMutation`).
- Hooks must not violate the Rules of Hooks — no conditional hook calls, no hooks inside loops.

### State Management Rules
- **Server state** (anything from the API/DB) → always React Query. Never duplicate server state into `useState` or Zustand.
- **Local UI state** (form inputs, toggles, modal open/close) → `useState`/`useReducer`, scoped to the component that owns it.
- **Global client state** (theme, current user session info, UI-wide flags like "compose modal open") → Zustand, and only when the state is genuinely needed across unrelated parts of the tree.
- Default assumption: **if in doubt, it's not global state.** Zustand stores must be justified, not reached for by default.
- Never store server data (posts, users, comments) in Zustand — that is React Query's job.

---

## 4. TypeScript Rules

### Strict Typing
- `strict: true` in `tsconfig.json` is non-negotiable.
- All function parameters, return types on exported functions, and component props must be explicitly typed.
- No implicit `any` anywhere in the codebase.

### Avoid `any`
- `any` is banned except in narrowly justified, commented edge cases (e.g., third-party library with no types), and even then prefer `unknown` with type narrowing.
- If a type is genuinely unknown, model it explicitly rather than escaping typing.

### Type Organization
- Feature-specific types live in that feature's `types.ts`.
- Shared/global types (e.g., `User`, `Post`, `PaginatedResponse<T>`) live in `src/types/`.
- Database schema types and API response types are kept distinct — a Mongo document shape is not automatically the API response shape or the UI prop shape. Map explicitly between layers.

### API Response Types
- Every API route must have an explicit response type, shared between backend and frontend via `src/types/api/`.
- Use a consistent response envelope, e.g.:
  ```ts
  type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: { code: string; message: string } };
  ```
- Validate untrusted input (API request bodies) with Zod, and derive TypeScript types from the Zod schema (`z.infer<>`) to avoid drift between validation and types.

---

## 5. UI Rules

### Reusable Components
- Anything used in 2+ places must be extracted into `components/` (shared) or the relevant feature's `components/` (feature-scoped).
- Base primitives (Button, Input, Dialog, Avatar, etc.) come from shadcn/ui and live in `components/ui/` — do not hand-roll primitives shadcn already provides.
- Compose feature-specific components (e.g., `PostCard`, `ComposeModal`) on top of shadcn primitives rather than modifying primitives in place.

### Tailwind Conventions
- Utility-first; avoid custom CSS files unless something cannot be expressed with Tailwind.
- Use a consistent spacing scale (Tailwind defaults) — no arbitrary magic-number values (`mt-[13px]`) except for rare, justified pixel-perfect needs.
- Long className strings should be organized logically (layout → spacing → typography → color → state) for readability; consider `clsx`/`cn()` for conditional classes.
- Shared design tokens (colors, radii) should be defined once in `tailwind.config.ts`, not repeated as raw hex values in components.

### shadcn/ui Usage
- Install components via the shadcn CLI rather than copy-pasting to keep them upgradable.
- Customize shadcn components through the provided variant/className APIs, not by forking their internals unless there's a hard blocker.
- Keep a single consistent theme configuration (colors, radius, fonts) as the source of truth for both shadcn and Tailwind.

### Responsive Design
- Mobile-first: base styles target mobile, breakpoints (`sm:`, `md:`, `lg:`) layer on enhancements for larger screens.
- Every screen must be designed and verified at three reference widths minimum: ~375px (mobile), ~768px (tablet), ~1440px (desktop).
- Navigation patterns should adapt structurally (e.g., sidebar → bottom nav), not just shrink.

### Accessibility Requirements
- All interactive elements must be reachable and operable via keyboard (tab order, Enter/Space activation).
- Use semantic HTML elements first; ARIA attributes only to fill genuine gaps.
- All images require meaningful `alt` text (or `alt=""` for decorative images).
- Color contrast must meet WCAG AA at minimum, especially important given a dark theme.
- Forms require associated `<label>`s, clear error messaging, and focus management on validation errors.
- Modals/dialogs must trap focus and be dismissible via Escape.

---

## 6. Backend Rules

### API Structure
- API routes live under `app/api/`, organized by resource (`/api/posts`, `/api/users`, `/api/comments`).
- Each route handler is thin: validate input → call a service/repository function → return a typed response. No business logic embedded directly in route handlers.
- Business logic lives in a `services/` layer (or within `lib/db/` repository functions) that route handlers call into — this keeps logic testable independent of the HTTP layer.

### Error Handling
- All API routes use a consistent try/catch pattern and return the shared `ApiResponse<T>` envelope, including on errors.
- Distinguish error types: validation errors (400), auth errors (401/403), not-found (404), and server errors (500) — never return a generic 500 for a client mistake.
- Never leak internal error details (stack traces, DB error messages) to the client in production responses; log them server-side instead.

### Validation
- All incoming request bodies and query params are validated with Zod before touching business logic.
- Validation schemas are colocated with the feature (e.g., `features/posts/schemas.ts`) and reused for both API validation and frontend form validation where applicable.

### Authentication Patterns
- Session/auth state is resolved once per request (e.g., in middleware or a shared `getCurrentUser()` helper) — never re-implemented per route.
- Protected routes verify auth before any data access, not after.
- Passwords (if using credentials auth) are always hashed (bcrypt/argon2) — never stored or logged in plain text.
- Prefer battle-tested auth solutions (e.g., NextAuth/Auth.js) over hand-rolled session/token logic unless there's a specific learning goal to build it manually — if so, state that explicitly.

### Database Interaction Rules
- All database access goes through a repository/data-access layer (`lib/db/`) — no raw MongoDB queries scattered inside route handlers or components.
- Design MongoDB schemas with future PostgreSQL migration in mind: prefer normalized, ID-referenced relationships over deeply nested documents where the data is relational in nature (e.g., posts referencing a `userId`, not embedding full user objects).
- Suggested core entities:
  - `User` (id, username, email, passwordHash, displayName, bio, avatarUrl, createdAt)
  - `Post` (id, authorId, type: "image" | "text", content, mediaUrl(s), createdAt, updatedAt)
  - `Comment` (id, postId, authorId, content, createdAt)
  - `Like` (id, postId, userId, createdAt) — or an embedded like-count + separate like-ledger for uniqueness enforcement
  - `Follow` (id, followerId, followingId, createdAt)
  - `Notification` (id, recipientId, actorId, type, entityId, read, createdAt)
- Index fields used in frequent queries (e.g., `authorId`, `postId`, `followerId`) from the start.

---

## 7. Code Quality Rules

- **Avoid duplicated code**: if logic is copy-pasted more than once, extract it into a shared function/hook/component immediately — don't wait for a third occurrence.
- **Keep files maintainable**: one primary export per file where practical; files should be scannable top-to-bottom without excessive scrolling.
- **Prefer composition**: build complex UI/logic by combining small, well-named pieces rather than large monolithic functions or components.
- **Clear naming conventions**:
  - Components: `PascalCase` (`PostCard.tsx`)
  - Hooks: `camelCase` prefixed with `use` (`useFeedPosts.ts`)
  - Utility functions: `camelCase` (`formatTimestamp.ts`)
  - Types/interfaces: `PascalCase` (`type PostResponse`)
  - Constants: `SCREAMING_SNAKE_CASE` for true constants (`MAX_POST_LENGTH`)
  - Files generally match their default export's name.
- **Comments only when necessary**: comments explain *why*, not *what*. Well-named code should make the "what" self-evident. Add comments for non-obvious business rules, workarounds, or intentional trade-offs.

---

## 8. AI Agent Behavior Rules

These rules apply specifically to the AI coding agent (OpenCode) working on this project:

1. **Always analyze before coding.** Read relevant existing files and understand current patterns before writing new code. Do not assume — verify by reading the actual codebase.
2. **Ask questions when requirements are unclear.** If a request is ambiguous or missing key details (data shape, expected behavior, edge cases), ask before implementing rather than guessing silently.
3. **Create a plan before large features.** For any non-trivial feature, outline the approach (files to touch, new components/hooks/routes, data flow) before writing code, and get confirmation if the change is architecturally significant.
4. **Implement features incrementally.** Break large features into small, independently verifiable steps rather than generating an entire feature in one pass.
5. **Verify changes before saying "completed."** Re-check the modified files, confirm types compile conceptually, and confirm the change actually satisfies the original request before declaring it done.
6. **Never modify unrelated files.** Touch only what the current task requires. Do not "drive-by refactor" unrelated code without explicit approval.
7. **Explain important architectural decisions.** When a non-obvious choice is made (e.g., choosing a data-fetching pattern, denormalizing a schema, introducing a new dependency), briefly explain the reasoning.
8. **Think in terms of a senior engineer**, not a code generator: consider maintainability, edge cases, error states, and future extensibility — not just "does it run."
9. **Respect this document as binding.** If a request conflicts with these rules, flag the conflict rather than silently ignoring the rules.

---

## 9. Development Workflow

### Planning Phase
- Restate the goal of the task in your own words.
- Identify affected features/files and any new entities, routes, or components needed.
- Note open questions or assumptions before proceeding.

### Implementation Phase
- Build in the smallest coherent increments (e.g., schema → API route → data hook → UI component, in that order for a new feature).
- Follow existing patterns in the codebase for consistency; if no pattern exists yet, establish one deliberately and note it for reuse.
- Keep commits/changes scoped to a single logical unit of work.

### Testing Phase
- Manually verify the happy path and at least one failure/edge case (empty state, invalid input, unauthorized access) for each feature.
- For any logic-heavy function (validation, data transformation, business rules), prefer writing a unit test.
- Confirm responsive behavior and basic accessibility (keyboard nav, labels) for new UI.

### Review Phase
- Re-read the diff/changes as if reviewing a colleague's PR: check naming, duplication, type safety, and adherence to this document.
- Confirm no unrelated files were touched.
- Summarize what changed and why, and flag any follow-up work or known limitations.

---

## 10. Rules for a Portfolio-Quality Application

- **No dead code, no commented-out blocks, no TODOs left unresolved** in the final state of a feature — either finish it, track it explicitly in an issues list, or remove it.
- **Consistent visual polish**: loading states, empty states, and error states must be designed for every screen, not just the happy path.
- **Realistic data handling**: pagination/infinite scroll for feeds, optimistic updates for likes/comments where appropriate, proper loading skeletons instead of blank screens.
- **Meaningful README**: the project should include a README explaining the stack, architecture decisions, and how to run it locally — written as if a stranger (recruiter or engineer) will read it.
- **No secrets or credentials committed** — environment variables only, with a `.env.example` provided.
- **Demonstrate depth over breadth**: a smaller feature set implemented to a high standard (proper auth, clean data model, polished UI, sensible error handling) is more valuable for a portfolio than many half-finished features.
- **Document trade-offs**: where a shortcut was deliberately taken (e.g., MongoDB now vs. PostgreSQL later), note it and why — this signals engineering maturity to anyone reviewing the project.