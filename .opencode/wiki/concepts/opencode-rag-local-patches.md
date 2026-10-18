---
title: OpenCodeRAG local patches (workspace fix set)
tags: [rag, plugin, patches, maintenance, windows, pinning]
sourceRefs: [".opencode/patches/README.md", ".opencode/patches/opencode-rag-plugin-2.4.4-local.diff", ".opencode/patches/apply-rag-patches.mjs", ".opencode/package.json", "opencode-rag.json"]
lastReviewed: 2026-10-18
---

# OpenCodeRAG local patches

This workspace patches `opencode-rag-plugin` (v2.4.4) to remove four behaviours that made the RAG tools actively
misleading for an editing agent. Since 2026-10-18 the plugin is a **pinned, workspace-local install** rather than a
junction to the global npm package, so an upstream update can no longer silently replace the patched code.

## Install model

```
.opencode/package.json      exact pins: opencode-rag-plugin 2.4.4, @opentui/solid 0.5.17, @opencode-ai/plugin 1.18.18
.opencode/package-lock.json committed (reproducible install)
.opencode/node_modules/     gitignored, ~600 packages, contains the patched plugin
.opencode/plugins/*.js      shims importing ../node_modules/opencode-rag-plugin/dist/…
```

`postinstall` runs the patch script, so `npm install` is self-healing:

```powershell
cd .opencode
npm install            # install + postinstall (patches)
npm run rag:check      # read-only: version, markers, keyword-index paths
npm run rag:patch      # explicit re-apply (idempotent)
```

Updating the plugin is now a deliberate act: bump the pin, regenerate the diff against the new tarball, re-verify the
four hunks. A global `npm update -g opencode-rag-plugin` no longer affects this workspace.

## What was broken → what the patch does

| # | File (plugin `dist/`) | Symptom before | Fix |
|---|---|---|---|
| 1 | `retriever/keyword-index.js` | One file had two identities: keyword index persisted `C:\…` while the vector store used `C:/…` → `find_usages` listed the same file twice with doubled counts, and the read tool dropped keyword-origin context | Normalize `filePath` to forward slashes when chunks enter the index (in place, so the later `description` mutation still lands) and when persisting |
| 2 | `plugin.js` | `search_semantic` returned quirk-memory chunks (`kind: "quirk"`) as code results, outranking the real files (quirk prose matches natural-language queries better than code) | Always pass `CODE_SEARCH_FILTER`, merged with `fileExtensions` — mirrors what `mcp/handlers.js` and the CLI already did |
| 3 | `opencode/tools.js` | `find_usages`: false negatives (`Sidebar` → "no reference lines found" although `MainLayout.tsx` imports and renders it), `pathHint` ignored, drifted line numbers for TS | Exact-token scan over every indexed chunk as phase 1 (retrieval only as fallback), usage lines re-derived from the file on disk, module-specifier matches skipped, `pathHint` honoured, output capped at 300 lines, deterministic file order, matched line shown verbatim |
| 4 | `opencode/create-read-tool.js` | Every `read` re-emitted the file's own chunks under "Related code chunks"; the requested file could also reappear in the "consider reading" list | Drop chunks fully contained in the range already printed (a whole-file read shows no self-chunks; a partial read keeps genuinely additional chunks), and compare paths separator/case-insensitively |

Data migration: `keyword-index.json` also needed its existing entries normalized (`apply-rag-patches.mjs` step 2; no
rebuild required). The diff was generated against the pristine `npm pack opencode-rag-plugin@2.4.4` tarball and verified
to reproduce the patched files byte-for-byte.

## Safety rails in `apply-rag-patches.mjs`

- **Version guard** — installed version must be exactly `2.4.4`, otherwise exit 1 and touch nothing (no half-applied
  diff written for another build).
- **All-or-nothing** — the whole diff is validated with `git apply --check` before writing.
- **Idempotent** — already patched → "nothing to do"; a *mixed* tree is refused.
- **Post-apply verification** — all four files must then contain the `[local patch]` marker, else exit 1. This is what
  catches the silent no-op below.
- `--check` is read-only and also flags `keyword-index.json` entries with backslash paths.

## Operational notes

- **Restart the background server, not the TUI.** `opencode service restart`; reopening the app attaches a new
  `role=cli` run to the same long-lived `role=server` process, which keeps the old modules and any cached plugin error.
- **`npm install --ignore-scripts`** skips the postinstall hook → run `npm run rag:patch`, or detect it with
  `npm run rag:check`.
- **Verify** by importing the modules directly (`node --input-type=module -e "await import(...)"`) or by calling
  `createFindUsagesTool(...).execute(...)` with stub deps — that is how the fix was validated offline.
- `node_modules` is gitignored; `package-lock.json` is committed on purpose (reproducible tree). `patches/backups/`
  holds a gitignored snapshot of `rag_db` for rollback.

## Gotchas learned the hard way

- `git apply` run from a subdirectory of a work tree resolves paths against the repository root, prints
  `Skipped patch 'dist/…'` for everything and **exits 0**. The script therefore runs git from the toplevel with
  `--directory=.opencode/node_modules/opencode-rag-plugin`, and verifies markers afterwards.
- `npm install --prefix .opencode` injected the parent package as `"music-app": "file:.."` (npm 10/Windows), created a
  symlink cycle and skipped postinstall as expected. Use `cd .opencode; npm install`.
- `@opentui/solid` must stay pinned to the version the installed opencode TUI expects — see
  [[wiki/concepts/opencode-rag-tui-sidebar]].

## Why patch instead of waiting

All four are portability/correctness bugs, not workspace preferences (item 2 is already fixed upstream in the MCP code
path; item 1 is arguably the root cause of the `\` vs `/` reports). They are worth upstream reports —
[[wiki/concepts/opencode-rag-tooling-notes]] tracks the status.

## Related

- [[wiki/entities/opencode-rag-plugin]] — wiring, config, index status
- [[wiki/concepts/opencode-rag-tooling-notes]] — measured tool behaviour before/after
- [[wiki/concepts/opencode-rag-tui-sidebar]] — where the panel lives, `@opentui/solid` pin
- [[wiki/concepts/opencode-config-locations]] — config/state paths, MCP servers
