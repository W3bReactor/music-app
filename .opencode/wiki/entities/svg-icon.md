---
title: SvgIcon
tags: [shared-ui, icons, svg, music-app]
sourceRefs: [src/shared/ui/SvgIcon/SvgIcon.tsx, public/icons/sprite.svg, src/shared/ui/index.ts]
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
- The old `src/shared/ui/SvgIcon/icons.tsx` JSX `icons` object was **deleted on 2026-10-29** — nothing imported it
  and `SvgIcon` renders the sprite. Add new glyphs to `public/icons/sprite.svg` only, not as a JSX object.
- `AvatarIcon` and `edit.svg` are separate raster/vector imports via `next/image`, not part of the sprite; SVG
  imports rely on the loose `declare module "*.svg" { const content: any }` in `src/app/ambient/assets.d.ts`.

Related: [[wiki/concepts/music-app-fsd-nextjs]], [[wiki/entities/sidebar]].
