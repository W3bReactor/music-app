---
title: Sidebar (shared/ui)
tags: [ui, navigation, shared, feature-sliced, component]
sourceRefs: [src/shared/ui/Sidebar/Sidebar.tsx, src/shared/ui/Sidebar/Sidebar.module.css, src/shared/ui/Sidebar/SidebarItem/SidebarItem.tsx, src/shared/ui/Sidebar/SidebarItem/SidebarItem.module.css, src/shared/ui/SvgIcon/SvgIcon.tsx, src/app/layouts/MainLayout/MainLayout.tsx, app/(basic)/layout.tsx, app/(intro)/layout.tsx]
lastReviewed: 2026-10-18
---

# Sidebar (shared/ui)

Left navigation rail of the app. Everything called a "sidebar button" lives in this pair of components.

## Component tree

```
app/(basic)/layout.tsx ─┐
app/(intro)/layout.tsx ─┴─► src/app/layouts/MainLayout/MainLayout.tsx
                              └─► src/shared/ui/Sidebar/Sidebar.tsx        ← <aside>, sections
                                    └─► src/shared/ui/Sidebar/SidebarItem/SidebarItem.tsx  ← one row = icon + label + link
                                          └─► src/shared/ui/SvgIcon/SvgIcon.tsx             ← <use href="/icons/sprite.svg#sprite-NAME">
```

| File | Responsibility |
|---|---|
| `src/shared/ui/Sidebar/Sidebar.tsx` | The `Sidebar` component: `<aside>` with the "Melodies" title link and four blocks — Menu, Library, Playlist and favorite, general — each a `<ul>` of `SidebarItem` |
| `src/shared/ui/Sidebar/SidebarItem/SidebarItem.tsx` | The clickable row: `<li>` + `next/link` + `SvgIcon` + `<h3>` label. Client component (`"use client"`) |
| `src/shared/ui/Sidebar/Sidebar.module.css` | Layout: `grid-column: 2 span`, column flex, `padding: 48px 16px`, right border. Blocks/list/item spacing |
| `src/shared/ui/Sidebar/SidebarItem/SidebarItem.module.css` | Hover/active states and the `playlist` / `logout` colour variants |

Both are re-exported from the barrel `src/shared/ui/index.ts`, which is why callers import `{ Sidebar } from "@/shared/ui"`.

## Items currently hardcoded in `Sidebar.tsx`

| Block | `text` | `href` | `svgIconName` |
|---|---|---|---|
| Menu | Home (active) | `/` | `home` |
| Menu | Discover | `/discover` | `discover` |
| Menu | Albums | `/albums` | `albums` |
| Menu | Artists | `/artists` | `artists` |
| Library | Recently Added | `/recently` | `recently` |
| Library | Most played | `/most` | `played` |
| Playlist and favorite | Your favorites | `/favorite` | `favorite` |
| Playlist and favorite | Your playlist | `/playlist` | `playlist` |
| Playlist and favorite | Add playlist | `/add-playlist` | `add_playlist` (variant `playlist`) |
| general | Setting | `/settings` | `settings` |
| general | Logout | `/logout` | `logout` (variant `logout`) |

## SidebarItem API

```ts
interface SidebarItemProps {
  className?: string;
  href: string;
  svgIconName: string;
  active?: boolean;
  variant?: "basic" | "logout" | "playlist";
  text: string;
}
```

- `variant` only toggles CSS classes (`sidebarItemPlaylist` → aqua-800 fill/secondary text, `sidebarItemLogout` → pink-500 stroke/accent text).
- `active` toggles `sidebarItemActive` (accent background, 20px/600 label) **and** the icon size (`size={active ? 24 : 16}`).

## Notes / gotchas

- The rows are `next/link` anchors, not `<button>` elements — there is no click handler anywhere in the sidebar; navigation is pure routing.
- `SidebarItem` declares `const [hover, setHover] = useState(false)` and wires `onMouseOver`/`onMouseOut`, but `hover` is never read. All hover styling comes from the CSS `:hover` rules, so the state is dead code (safe to delete).
- `active` is hardcoded `true` for the Home item only; there is no `usePathname()`-based active detection yet.
- Icons resolve through a single SVG sprite: `public/icons/sprite.svg` with `#sprite-<name>` ids (`<use>`), so a new item needs a matching sprite symbol, not an import.
- Colours come from CSS variables (`--action-accent-primary`, `--action-accent-primary-hover`, `--action-accent-secondary`, `--aqua-800`, `--pink-500`, `--text-primary`, `--white-100`).

## Related

- [[wiki/entities/opencode-rag-plugin]]
