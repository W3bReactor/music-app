---
title: music-app: FSD + Next.js App Router layout
tags: [fsd, nextjs, architecture, conventions, music-app]
sourceRefs: [package.json, package-lock.json, tsconfig.json, eslint.config.mjs, next.config.ts, README.md, app/, src/, git log]
lastReviewed: 2026-10-20
---

# music-app: FSD + Next.js App Router layout

Read-only analysis of the app (branch `docs/upgrade-agents-md`, 2026-10-20). Companion pages:
[[wiki/entities/svg-icon]], [[wiki/entities/sidebar]]. Agent-facing summary of the same facts lives in the
`music-app:project-rules` block of `AGENTS.md`.

## Stack (verified by imports, not by the dependency list)

| Package | Version | Where it is actually used |
|---|---|---|
| `next` | `16.3.5` (exact) | `next/link` ×7, `next/image` ×3, `next/font/google` ×1 |
| `react` / `react-dom` | `19.2.8` (exact) | everywhere; `reactCompiler: true` in `next.config.ts` |
| `typescript` | `^5` | `tsconfig.json`; no `typecheck` script |
| `eslint` / `eslint-config-next` | `^9` / `16.3.5` | `eslint.config.mjs` (flat config) |
| `prettier` | `3.9.8` (exact) | `.prettierrc.json` only — no script, no CI, so formatting is IDE-driven |
| `classnames` | `^2.5.1` | 9 components, always as `import cn from "classnames"` |
| `react-hook-form` + `@hookform/resolvers` + `zod` | `^7.90.0` / `^5.9.2` / `^4.6.7` | `src/features/auth/ui/*Form.tsx` + `model/*Schema.ts` |
| `@types/node` | `^20` | nothing in the code — probably dead, unverified |

`package-lock.json`: `lockfileVersion 3`. Zod 4 API is in use (`z.email(...)` — not available in Zod 3).

## Routing

Router lives in the **repo-root `app/`** (not `src/app`), per `README.md` (fsd.how Next.js guide); root `pages/`
holds a single `README.md` placeholder.

| Route | File |
|---|---|
| `/` | `app/(intro)/page.tsx` → `@/pages/intro` |
| `/profile` | `app/(basic)/profile/page.tsx` → `@/pages/profile` |
| `/login` | `app/(auth)/login/page.tsx` → `@/pages/auth` |
| `/register` | `app/(auth)/register/page.tsx` → `@/pages/auth` |
| `/successfully` | `app/(auth)/successfully/page.tsx` → `@/pages/auth` |

Every route file is a thin `.tsx` with `export default` that renders a component from `src/`. Layouts:
`app/layout.tsx` (fonts + `metadata` + globals.css), then group layouts delegating to
`src/app/layouts/{AuthLayout,MainLayout}`. There is **no** root `app/page.tsx`, `error.tsx`, `loading.tsx` or
`not-found.tsx`; `app/page.module.css` exists but nothing imports it (dead).

Layouts use the Next-generated global type `LayoutProps<"/">`, declared in `.next/dev/types/routes.d.ts` and pulled
in by the gitignored `next-env.d.ts` — so on a clean clone typecheck fails until `next dev`/`next build` ran once.

## Layers, slices, segments

`@/*` → `./src/*` (the only path alias). Note `@/app/...` is the **FSD `app` layer inside `src/`**, not the router.

| Layer | Slices | Segments |
|---|---|---|
| `src/app` | `layouts/AuthLayout`, `layouts/MainLayout`, `styles/globals.css`, `ambient/assets.d.ts` | — |
| `src/pages` | `auth` (LoginPage, RegisterPage, RegisterSuccessfullyPage), `intro`, `profile` | `ui` |
| `src/widgets` | `header` (`Header`, `HeaderIntro`) | `ui` |
| `src/features` | `auth` (LoginForm, RegisterForm), `search` (SearchInput) | `ui`, `model` |
| `src/shared` | `ui` (10 component folders + `icons/avatar.svg`) | `ui` |

No `entities` layer, no `api`/`lib` segments anywhere. Dependency direction is respected (`app → widgets/pages →
features → shared`); the only violations are imports that reach **inside** a slice:

- `src/features/auth/ui/RegisterForm.tsx:6` → `@/shared/ui/AccentInput/AccentInput` — unnecessary, `AccentInput` is
  exported from the slice index already;
- `src/pages/profile/ui/ProfileFavorite/ProfileFavorite.tsx:2-3` → `MediaItem`, `GrayButton` — forced, they are
  missing from `src/shared/ui/index.ts` (as is `SidebarItem`);
- `src/shared/ui/Sidebar/Sidebar.tsx:2` and `src/widgets/header/ui/Header.tsx:7` — same-slice imports (allowed, but
  the `@/…` alias instead of `./…` is inconsistent);
- `src/shared/ui/index.ts:4` mixes `@/shared/ui/PinkButton/PinkButton` with relative `./…` neighbours.

## Server vs client

`"use client"` appears in exactly three files: `src/features/auth/ui/LoginForm.tsx`, `RegisterForm.tsx`,
`src/shared/ui/Sidebar/SidebarItem/SidebarItem.tsx`. All layouts/pages are server components. React Compiler is
enabled, so manual memoization is redundant; ESLint flags `watch()` from `react-hook-form` as an "incompatible
library" for the compiler in `RegisterForm.tsx:28`.

## Conventions confirmed by code

- Named exports, arrow components (`export const X = ({...}: XProps) => …`); `export default` only in router files.
- Props: local `interface XProps` in the same file, optional ones via destructuring defaults; `React.FC` unused.
- One folder per component, `PascalCase.tsx` + `X.module.css`, always `import styles from "./X.module.css"`.
- CSS Modules + design tokens from `src/app/styles/globals.css`; conditional classes via `cn`.
- Forms: schema in `model/*.ts` exporting the schema and the `z.infer` type, `SubmitHandler<T>`, placeholder data
  marked `TODO: GET DATA` + `console.log`.
- Comments/docs in Russian; identifiers, UI copy, commit subjects in English.
- Branches `type/kebab-name` (`feature/`, `refactor/`, `chore/`, `docs/`); conventional commits (`feat:`,
  `refactor:`, `chore(rag):`). No CI, no test runner, `__tests__` is listed in `tsconfig.include` but does not exist.
- **Not** conventions: import order (differs between `Header.tsx` and `ProfileInfo.tsx`, no `import/order` rule) and
  asset casing (`AvatarIcon` from `icons/avatar.svg` vs `edit.svg`, `avatar.svg`).

## Commands, measured 2026-10-20

- `npx tsc --noEmit --incremental false` → **exit 0**, no output. The extra flag matters: `incremental: true` in
  `tsconfig.json` makes plain `--noEmit` write `tsconfig.tsbuildinfo` (verified: mtime unchanged with the flag).
- `npx eslint .` (== `npm run lint`) → **exit 1**, `10 problems (7 errors, 3 warnings)`: 2× `no-require-imports` in
  each leftover `app/(auth)/layout.js` and `app/(auth)/register/page.js`, `no-explicit-any` in
  `src/app/ambient/assets.d.ts:2`, unused `hover` in `SidebarItem.tsx:25`, unused `MARKER` in
  `.opencode/patches/apply-rag-patches.mjs:32`, plus the React Compiler warning. ESLint lints `.opencode/**` too, and
  the base `no-unused-vars: error` next to `@typescript-eslint/no-unused-vars` reports each unused variable twice.
- Not run (forbidden read-only task): `next build`, `next dev`, `prettier`, tests.
- `tsconfig.json` hazards: `noEmit: false` + `allowJs: true` emit `.js` next to sources (that is how the compiled
  duplicates appeared); `module: commonjs` / `moduleResolution: node` and `lib: ["ES2022"]` without DOM are unusual
  for Next 16 but currently pass. Owner does not want this file changed.

## Gaps / open issues

1. Two tracked CommonJS duplicates in the router — `app/(auth)/layout.js`, `app/(auth)/register/page.js` — the last
   leftovers of the WebStorm compile (six `src/` twins were removed in `298e346`). They are the bulk of the red lint
   and a possible route-resolution conflict (unverified: build was not run). Cleanup deliberately deferred to a
   separate issue.
2. Incomplete `src/shared/ui/index.ts` (`GrayButton`, `MediaItem`, `SidebarItem` missing) → forced deep imports.
3. Weak typing: `assets.d.ts` declares `*.svg` as `any`; `SvgIconProps.name` is a bare `string`, so a wrong icon
   name fails silently (see [[wiki/entities/svg-icon]]).
4. Dead code: `app/page.module.css`, `src/shared/ui/SvgIcon/icons.tsx` (the `icons` object — the component renders
   the public sprite instead), `sprites-trash/` (gitignored).
5. No tests, no CI, no `typecheck`/`format` scripts.
