---
title: OpenCodeRAG tooling — field notes (what helps, what hurts)
tags: [rag, tooling, evaluation, gotcha, workflow]
sourceRefs: ["opencode-rag.json", ".opencode/patches/README.md", "src/shared/ui/Sidebar/Sidebar.tsx", "src/app/layouts/MainLayout/MainLayout.tsx", ".opencode/rag_db/manifest.json", "https://github.com/MrDoe/OpenCodeRAG/issues/35"]
lastReviewed: 2026-10-18
---

# OpenCodeRAG tooling — field notes

Measured while answering "which component holds the sidebar buttons" (see [[wiki/entities/sidebar]]) and while fixing
the failures below ([[wiki/concepts/opencode-rag-local-patches]]).

## What genuinely earns its place

| Tool | Why it worked |
|---|---|
| `get_file_skeleton` | ~10 lines of output per file, exact line ranges for every symbol. Let me read `Sidebar.tsx` L5-104 and `SidebarItem.tsx` L8-51 and nothing else |
| `search_semantic` | One call located the sidebar (barrel `shared/ui/index.ts`, `Sidebar.module.css`, `SidebarItem.module.css`). LLM descriptions ([[wiki/entities/opencode-rag-plugin]]) make comment-less files findable — CSS matched a UI-behaviour query |
| `describe_image` | Only channel for image content here; returned usable descriptions of both repo JPGs without touching bytes |
| `recall_quirks` / `add_quirk` | Cheap cross-session memory. Works, ranked sensibly |
| `opencode-rag` CLI (`status`, `query`, `list`, `show`) | Independent of the plugin module cache, so it is the way to check the index/retrieval while the agent's own tools are stale |

## Fixed on 2026-10-18 (local patches — details in [[wiki/concepts/opencode-rag-local-patches]])

1. **Quirks competed with code in `search_semantic`.** Query `"sidebar buttons navigation"` with `pathHints: ["src/shared"]`
   returned the quirk *"music-app left nav: all sidebar buttons live in …"* at **rank 1 (score 1.00)** and an unrelated
   OpenCode-TUI quirk at 0.95 — and did **not** return `Sidebar.tsx`. Cause: the V1 tool path never passed
   `CODE_SEARCH_FILTER`, so `kind: "quirk"` chunks were searched as code. Now filtered at the source.
2. **`find_usages` could not be trusted to gate edits.** `find_usages("Sidebar")` → *"The symbol appears in indexed chunks
   but no reference lines were found"*, although `src/app/layouts/MainLayout/MainLayout.tsx` imports and renders it.
   Root causes: retrieval ranking (the referencing chunk sat below dozens of CSS chunks), `pathHint` declared but unused,
   and — for the duplicates — the keyword index persisting `C:\…` while the vector store used `C:/…`, so
   `find_usages("SidebarItem")` reported *"22 references across 2 files"* for one file with 11 usages. Now: exact-token
   scan + disk-verified line numbers (`Sidebar` → 3 refs in 2 files; `SidebarItem` → 12 refs in 1 file).
3. **The `read` override double-counted.** Reading a file emitted the full body and then the *same* chunk again under
   "Related code chunks". Now self-chunks contained in the printed range are dropped, and the requested file no longer
   reappears in the "consider reading" tail (count reduced to 3).
4. **Stale index.** `openCode.autoIndex.enabled` is now `true` (chokidar, 2 s debounce, 5 min interval) instead of off,
   so edits stop leaving silent stale chunks — provided the LM Studio embedder is reachable.

## Live verification after the local-install restart (2026-10-18 23:48)

The server now loads the pinned workspace copy (`.opencode/node_modules/opencode-rag-plugin`, verified realpath +
markers), so these are the numbers the agent actually gets:

| Check | Result |
|---|---|
| `find_usages("Sidebar")` | 3 references across 2 files (`MainLayout.tsx` L2/L14, `shared/ui/index.ts` L3) |
| `find_usages("SidebarItem")` | 12 references across 1 file (`Sidebar.tsx` L2 import + 11 `<SidebarItem` sites) |
| `find_usages("SvgIcon")` | 13 references across 6 files (`shared/ui/index.ts`, `SidebarItem`, `Footer` ×4, `AccentSelect`, `SearchInput`, `sprite.svg` comment) |
| `search_semantic("… @opentui/solid …")` | only code/config chunks, no `kind: quirk` |
| `read` whole file | body printed once, no self-chunk |
| `npm run rag:check` | 4/4 files, 14 markers, index 313 chunks, 0 backslash paths |
| `opencode-rag status` | `text-embedding-qwen3-embedding-0.6b` @ 1024 dim = store dim, 91 files, manifest ok |

## Still open (not fixable from the plugin `dist/`)

1. **Chunk text is not a faithful file slice for TS/TSX.** The chunker strips the import/declaration header, so stored
   `startLine`/`endLine` drift from the file (`MainLayout.tsx` is stored as `L6-9` + `L11-22` while its component body
   starts at L10) and references living only in the stripped imports are invisible to chunk-content tooling. Always
   confirm line numbers with `read`/`grep` before editing.
2. **Not reachable from Code Mode.** Inside `execute`, `tools.search_semantic` / `tools.recall_quirks` do not exist
   ("Unknown tool"), so retrieval cannot be scripted or parallelised programmatically.
3. **Big/minified files break `read`.** Attempts on the plugin's `dist/tui.js` aborted ("Tool execution interrupted") —
   note that file also sits behind the `node_modules` junction, which `resolveWorkspacePath` rejects by design
   (*"resolves outside the workspace (via symlink …)"*). Use `Get-Content -Skip/-First` for anything under a junction.
4. **No score breakdown in-tool.** `--explain` exists in the CLI but not in `search_semantic`, so "why did this match?"
   is unanswerable mid-task.
5. **Fusion scores are rank-based, not absolute.** A vector-only top hit scores ≈0.60 (`retrieval.minScore: 0.5` keeps
   only the top few ranks), so score values must be compared within one result set, never across queries.

## Working rules adopted

- `get_file_skeleton` before every read; skip the "consider reading" tail by default.
- Verify edit targets with a real read; treat any reported line number as a hint until read confirms it.
- Keep quirks short and project-specific; re-query with different wording if a quirk dominates a broad query.
- After a plugin update: re-apply `.opencode/patches/apply-rag-patches.mjs`, reinstall `@opentui/solid`, restart opencode.

## Upstream-relevant findings

- Path identity (`\` vs `/`) split between the keyword index and the vector store, inflating `find_usages` counts.
- `search_semantic` missing `CODE_SEARCH_FILTER` (fixed in the MCP handler, not in the V1 plugin path).
- `find_usages` ranking-based candidate set, ignoring its own `pathHint` argument.
- TS chunk ranges not mapping 1:1 onto the file.
- The `@opentui/solid` load failure — [[wiki/concepts/opencode-rag-tui-sidebar]] (MrDoe/OpenCodeRAG#35).
