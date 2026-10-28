---
title: SvgIcon
tags: [shared-ui, icons, svg, music-app]
sourceRefs: [src/shared/ui/SvgIcon/SvgIcon.tsx, src/shared/ui/SvgIcon/icons.tsx, public/icons/sprite.svg, src/shared/ui/index.ts]
lastReviewed: 2026-10-29
---

# SvgIcon

`src/shared/ui/SvgIcon/SvgIcon.tsx` — the single icon primitive of the app, exported from `@/shared/ui` and used by
`SidebarItem`, `Footer`, `SearchInput`, `AccentSelect` and `Header`.

```tsx
<SvgIcon name="chevron" size={20} className={styles.icon} />
```

It renders `<svg><use href={`/icons/sprite.svg#sprite-${name}`} /></svg>`, so every icon is a symbol inside the
public sprite `public/icons/sprite.svg` with an id of the form `sprite-<name>`.

## Traits worth remembering

- `SvgIconProps.name` is a plain `string` — a typo produces no error and no icon, only an empty `<svg>`.
- The sprite ids currently available: `add_playlist`, `albums`, `arrow-down`, `artists`, `chevron`, `discover`,
  `facebook`, `favorite`, `github`, `home`, `instagram`, `logout`, `next`, `phone`, `play`, `played`, `playing`,
  `playlist`, `recently`, `search`, `settings`, `twitter` (22 ids; checked 2026-10-29). Every name used in code exists
  in the sprite.
- `src/shared/ui/SvgIcon/icons.tsx` exports a JSX `icons` object with a subset of the same glyphs. It is **dead
  code** — nothing imports it, and `SvgIcon` does not use it (the sprite wins). It is still compiled: an unquoted
  `arrow-down:` object key there failed `tsc` and ESLint on 2026-10-29 (fixed by quoting it). Its `clip0_597_*` ids
  would also collide with the sprite's internal `<clipPath>` ids if both were rendered.
- `AvatarIcon` and `edit.svg` are separate raster/vector imports via `next/image`, not part of the sprite; SVG
  imports rely on the loose `declare module "*.svg" { const content: any }` in `src/app/ambient/assets.d.ts`.

Related: [[wiki/concepts/music-app-fsd-nextjs]], [[wiki/entities/sidebar]].
