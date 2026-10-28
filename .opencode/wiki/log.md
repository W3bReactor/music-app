# Wiki log

Append-only timeline. Newest entries at the bottom.

## [2026-10-18] seed | wiki created
Initial pages: [[wiki/entities/opencode-rag-plugin]], [[wiki/concepts/opencode-rag-tui-sidebar]].

## [2026-10-18] ingest | RAG tooling field notes
Evaluated the tooling on a real "find the sidebar component" task. Filed [[wiki/concepts/opencode-rag-tooling-notes]]: get_file_skeleton/search_semantic/describe_image are clear wins; quirk chunks outrank code in search (pathHints does not filter them), find_usages gives a false negative on `Sidebar` and double-counts files via `\` vs `/` path identity, and the read override re-emits the file it just returned.

## [2026-10-18] ingest | LLM descriptions (qwen3.5-4b)
Verified the `description` + `imageDescription` passes: chunk descriptions appear as the `>` line in search results
(e.g. `src/features/auth/index.ts` → "Exports RegisterForm and LoginForm components…"), image descriptions live in
`.opencode/rag_db/.desc-cache.json` and are regenerated on demand by `describe_image` (both repo JPGs described
successfully). Documented in [[wiki/entities/opencode-rag-plugin]].

## [2026-10-18] ingest | Sidebar component
Mapped the app's left nav: `src/shared/ui/Sidebar/Sidebar.tsx` (sections) → `SidebarItem/SidebarItem.tsx` (the clickable rows, `next/link` + `SvgIcon` sprite) → `SvgIcon`. Rendered by `MainLayout` under `app/(basic)` and `app/(intro)`. Filed as [[wiki/entities/sidebar]] with items table, props, and dead `hover` state noted.

## [2026-10-18] ingest | OpenCodeRAG TUI sidebar diagnosis
Investigated "where is the RAG button in the sidebar". Findings: the plugin has no GUI button, it appends a panel to the terminal TUI sidebar (`sidebar.content` slot, toggle `Ctrl+X` then `B`), and in this workspace it never loads because `@opentui/solid` is missing (upstream issue MrDoe/OpenCodeRAG#35).

## [2026-10-18] fix | Local plugin patches + TUI dependency
Fixed the measured failures instead of documenting around them. Patched 4 installed-plugin files (marker `[local patch]`):
(1) `retriever/keyword-index.js` stores forward-slash paths (one file no longer has `C:\` and `C:/` identities);
(2) `plugin.js` makes `search_semantic` pass `CODE_SEARCH_FILTER` so quirk chunks stop ranking as code;
(3) `opencode/tools.js` rewrites `find_usages` around an exact-token scan + disk-verified usage lines, honours `pathHint`,
caps output and fixes line numbers; (4) `opencode/create-read-tool.js` drops self-chunks already printed and compares paths
separator-insensitively. Normalized the existing `keyword-index.json`. Verified against the pristine 2.4.4 tarball
(patch reproduces the patched files byte-for-byte) and offline via direct module calls (`Sidebar` → 3 refs in 2 files,
`SidebarItem` → 12 refs in 1 file, `SvgIcon` → 14 refs in 7 files, nonexistent symbol → not found). Also installed
`@opentui/solid@0.5.17` into the plugin package so `.opencode/plugins/rag-tui.js` imports again, enabled
`openCode.autoIndex`, set `readRelatedFilesMax: 3`, and silenced the `decision.provider` warning. Everything is
reproducible via `.opencode/patches/apply-rag-patches.mjs`; both the code patches and the TUI dependency are wiped by a
plugin update/reinstall, and the running process needs a restart. Filed [[wiki/concepts/opencode-rag-local-patches]],
rewrote [[wiki/concepts/opencode-rag-tooling-notes]] (fixed vs still open) and updated
[[wiki/entities/opencode-rag-plugin]] + [[wiki/concepts/opencode-rag-tui-sidebar]].

## [2026-10-18] fix | Restart target: background server, not the TUI
After the plugin fixes, the UI still showed `Server plugin error … err_546f0d61`, while the log contained no new
`failed to load plugin` entry (the reference matches the 19:25 pre-fix WARN). Cause: opencode V2 keeps a long-lived
background server (`opencode service status` → `http://127.0.0.1:45278`) that imports the plugins and hosts the agent
tools; restarting the TUI/desktop only attaches a new `role=cli` run to that same `role=server` process, which still holds
the old modules and the cached error card. In-session `find_usages("Sidebar")` confirmed the stale server. Fix:
`opencode service restart`. Documented in [[wiki/concepts/opencode-rag-local-patches]],
[[wiki/concepts/opencode-rag-tui-sidebar]], [[wiki/entities/opencode-rag-plugin]] and `.opencode/patches/README.md`.

## [2026-10-18] verify | Patches live + MCP config cleanup
After `opencode service restart` (new server PIDs 23:22, run `b690fde7`) every fix is confirmed live: `find_usages("Sidebar")`
→ 3 refs/2 files with correct lines; `search_semantic` returns code only (no `kind: quirk`); whole-file `read` prints the
body once; the log shows `loading plugin … rag-tui.js` in the **server** role with no failure. Recorded in
[[wiki/concepts/opencode-rag-tooling-notes]].

Also traced the unrelated `nextjs-mcp … 404` warning to `~/.opencode/opencode.json` (legacy V1 config, still read by V2):
an earlier session had added `@modelcontextprotocol/server-nextjs`, a package that does not exist on npm. Removed the
`mcp` block (backup `opencode.json.bak`); the working `next-devtools` server in `~/.config/opencode/opencode.jsonc` is
untouched. Filed [[wiki/concepts/opencode-config-locations]].

## [2026-10-18] decision | Local pinned plugin install + self-healing patches
Made the RAG tooling survive updates instead of relying on the global npm copy:

- Backed up `rag_db` to `.opencode/patches/backups/rag_db-2026-10-18` (gitignored) and committed the whole tooling set
  (`.opencode/{patches,plugins,skills,wiki,*.json}`, `opencode-rag.json`, `AGENTS.md`) as `6949dc9`.
- `.opencode/package.json` now pins `opencode-rag-plugin@2.4.4` and `@opentui/solid@0.5.17` exactly, with
  `postinstall: node patches/apply-rag-patches.mjs`; `.opencode/node_modules` replaced the old junction chain and
  `package-lock.json` is committed (no longer ignored).
- `apply-rag-patches.mjs` hardened: exact-version guard (exit 1, no writes), `git apply --check` all-or-nothing, mixed
  patch state refused, post-apply marker verification, `--check` read-only mode. It now resolves the local install and
  runs `git apply` from the repo toplevel with `--directory=…` because git silently *skips* patches from a subdirectory
  and still exits 0.
- Verified: local patched files hash-identical to the previously verified global copy (14 markers), shims import,
  `rag:check` green, postinstall idempotent, version-mismatch guard exits 1 without touching the fake target,
  `@opentui/solid` resolves from the plugin's `dist/tui.js`.

Updated [[wiki/concepts/opencode-rag-local-patches]], [[wiki/entities/opencode-rag-plugin]],
[[wiki/concepts/opencode-rag-tui-sidebar]] and `.opencode/patches/README.md`. Pending: one `opencode service restart`
so the server loads the local copy.

## [2026-10-18] verify | Local install live
After `opencode service restart` (new server 23:48, run `2435e61e`) the server loads the workspace shims; the relative
import resolves to `.opencode/node_modules/opencode-rag-plugin/dist/plugin-entry.js` (8 `[local patch]` markers in
`tools.js`), and `find_usages` returns the patched results: `Sidebar` 3/2, `SidebarItem` 12/1, `SvgIcon` 14/7 —
exactly the expected counts, compared against `MainLayout.tsx` L2/L14, `Sidebar.tsx` L2 + 11 render sites, and the seven
files using `SvgIcon`. `search_semantic` returns code/config chunks only (no quirks). `npm run rag:check` green
(4/4 files, 14 markers, index 313 chunks, 0 backslash paths); `opencode-rag status` confirms embedder
`text-embedding-qwen3-embedding-0.6b` @ 1024 dim = store dim. No `failed to load plugin` entries after 19:25 (all
historical). Working tree clean at `2be20e7`.

## [2026-10-19] refactor | Compiled `.js` duplicates removed
Accidental WebStorm compile (project `tsconfig.json` has `noEmit: false`, CommonJS, no `outDir`) had emitted six `.js`
files next to their `.ts/.tsx` sources. Removed on `refactor/remove-compiled-js` (`298e346`, 6 files / 270 deletions);
`npx tsc --noEmit` clean, nothing imports the deleted paths. Re-indexed: 307 chunks / 85 files / 0 orphans, CLI no longer
lists them. Note: the running server keeps the keyword index in memory, so `find_usages("SvgIcon")` kept returning the
deleted `LoginForm.js` until `opencode service restart` — after that 13 refs / 6 files, as recorded in
[[wiki/concepts/opencode-rag-tooling-notes]]. Owner does not want the tsconfig changed (one-off accident).

## [2026-10-20] ingest | The app itself: FSD + Next.js App Router
Read-only pass over the application code (branch `docs/upgrade-agents-md`) to write agent rules. Confirmed: router in
root `app/` with `(intro)`/`(basic)`/`(auth)` groups, every route file a thin `export default` wrapper around a
`src/pages/<slice>` component; FSD layers in `src/` (`app`, `pages`, `widgets`, `features`, `shared`, no `entities`,
no `api`/`lib` segments); `@/*` → `./src/*` so `@/app/...` is the FSD layer, not the router dir; dependency direction
respected, only slice-internal imports violate the public API (`RegisterForm` → `shared/ui/AccentInput`, `ProfileFavorite`
→ `MediaItem`/`GrayButton`, both because `src/shared/ui/index.ts` is incomplete). `"use client"` in exactly 3 files.
Measured: `npx tsc --noEmit --incremental false` → exit 0; `npx eslint .` → exit 1, 10 problems (7 errors / 3 warnings),
four of them from the two leftover compiled `app/(auth)/*.js`. Filed [[wiki/concepts/music-app-fsd-nextjs]] and
[[wiki/entities/svg-icon]] (sprite convention + dead `icons.tsx`); updated [[wiki/index]].

## [2026-10-20] decision | AGENTS.md gets a project-rules block
Added `<!-- BEGIN music-app:project-rules --> … <!-- END music-app:project-rules -->` between the managed
`nextjs-agent-rules` block and the `opencode-rag` block, keeping both managed blocks byte-identical (36 insertions,
0 deletions). Owner's calls: project block in Russian (managed blocks stay English); lint line stays qualitative
("no new errors", no counts); public-API import phrased as a preference; no ban on `"use client"`; type check is
`npx tsc --noEmit --incremental false`; new rules for "no dependency/config changes without an explicit request" and
for recording knowledge in `.opencode/wiki`. Existing `app/(auth)/*.js` duplicates are declared out of scope (separate
issue) and must not be deleted as part of unrelated work. The literal `<!-- BEGIN:nextjs-agent-rules -->` mention inside
the prose was rephrased to «managed-блок в начале файла», so the file now contains exactly the six real markers and no
marker text elsewhere (a future regex-based scan in `next dev` could otherwise corrupt the file). Committed as two
commits on `docs/upgrade-agents-md`: `2fc1c66 docs: add project rules block for the app to AGENTS.md` and
`3701a95 docs(rag): record app FSD/conventions analysis in the wiki` — agent rules and agent notes stay reviewable and
revertable separately.

## [2026-10-20] decision | Wiki and quirk noise policy
A test session (new component in `shared/ui`) passed the AGENTS.md checks but also filed a wiki page and a quirk for a
routine task. Owner's rule: write only when the decision is not recoverable from code (why this way, which alternative
was rejected), when it is a trap that already cost more than one attempt, or when the architecture changed (new layer,
slice pattern, import rule). Routine components, style tweaks and bugfixes need neither a page nor a quirk; log.md gets
one entry per significant decision, not per task. The rules live in [[wiki/index]] so they load only when an agent
actually opens the wiki — AGENTS.md is at the 100-line cap. AGENTS.md keeps one pointer line plus
«Квирк только для неочевидной ловушки, не для описания добавленного кода» in the project block, because the
`opencode-rag` block is generated (`dist/cli/commands/init-helpers.js` → `mergeAgentsMdContent` rewrites the region
between its own markers, first-occurrence `indexOf`, and preserves everything outside them) and must not be edited by
hand.

## [2026-10-20] refactor | Compiled app-router duplicates removed, `noEmit` turned on
`app/(auth)/layout.js` and `app/(auth)/register/page.js` deleted — verified compiled twins of the sibling `.tsx`
(same component, CommonJS `require`) — and `tsconfig.json` `noEmit` flipped `false → true`; `allowJs` untouched.
`next build` → exit 0, 6 static routes, no route conflict; typecheck still exit 0; lint drops from 10 to 6 problems
(3 errors / 3 warnings), all unrelated. AGENTS.md loses the obsolete "don't run `tsc` without `--noEmit`" rule and the
duplicate-deletion carve-out, keeps "no new `.js`/`.d.ts` twins next to sources". See
[[wiki/concepts/music-app-fsd-nextjs]]. Committed on `refactor/remove-app-compiled-js`.

## [2026-10-29] architecture | entities layer, player and track mocks
`src/entities/track` (`TrackCard`, `TrackInfo`) is the first `entities` slice; the `Track` type stayed in
`pages/intro/model/mockTracks.ts` and duplicates `TrackCardProps`. `swiper@14` drives `shared/ui/CardSlider`;
`shared/libs` holds the mock WAV (`Blob` URL), the peaks and the rAF-based `useAudioPlayer`; `Player` is mounted in
`MainLayout`, so it appears on every `(intro)` and `(basic)` page. `/music/[id]` renders `pages/track` but ignores
`params` (static demo). `84cbb03` also added `DOM` to `lib` and swapped ESLint's base `no-unused-vars` for the TS
rule. Re-measured after the `arrow-down` fix and tracking the missing cover: `tsc` exit 0, `next build` exit 0 (7
routes, `/music/[id]` dynamic), lint 4 problems (3 errors / 1 warning). See
[[wiki/concepts/music-app-fsd-nextjs]].

## [2026-10-29] refactor | `Track` moves into the entities model, dead icons object removed
`Track` now lives in `entities/track/model/types.ts` and is re-exported from the slice index; `TrackCard` takes a
single `track: Track` prop (its flat props duplicated the type) and `mockTracks` imports the type instead of
declaring it. The dead `SvgIcon/icons.tsx` JSX object was deleted (nothing imported it; icons come from the sprite).
Feature work for issue #26 landed as `feat: implement track cards in the intro slider` — the earlier `cf51bcc` had
committed those files empty. tsc exit 0, `next build` exit 0.
