---
title: OpenCodeRAG local patches (workspace fix set)
tags: [rag, plugin, patches, maintenance, windows]
sourceRefs: [".opencode/patches/README.md", ".opencode/patches/opencode-rag-plugin-2.4.4-local.diff", ".opencode/patches/apply-rag-patches.mjs", "opencode-rag.json"]
lastReviewed: 2026-10-18
---

# OpenCodeRAG local patches

This workspace patches the **installed** copy of `opencode-rag-plugin` (v2.4.4) to remove four behaviours that made the
RAG tools actively misleading for an editing agent. Patches live in `.opencode/patches/`, apply to the global npm
install, and are lost on every plugin update — hence the re-apply script.

```
node .opencode/patches/apply-rag-patches.mjs     # idempotent; needs git on PATH
```

Everything is marked with `[local patch]` comments in the plugin `dist/`, so
`grep -rn "\[local patch\]" "<plugin dir>\dist"` shows the whole local footprint (4 files, 14 markers).

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

## Why patch instead of waiting

All four are portability/correctness bugs, not workspace preferences (item 2 is already fixed upstream in the MCP code
path; item 1 is arguably the root cause of the `\` vs `/` reports). They are worth upstream reports —
[[wiki/concepts/opencode-rag-tooling-notes]] tracks the status.

## Operational notes

- **Restart required — the *background server*, not the TUI.** Plugin modules are cached per process; the server process
  (`opencode service status` → `http://127.0.0.1:45278`) imports the plugins and hosts the agent tools, and it outlives
  TUI/desktop restarts. Reopening the app attaches a new `role=cli` run to the old `role=server` process, so patched code
  still has no effect — and the server's cached plugin-error card (e.g. the pre-fix `err_546f0d61` for `rag-tui.js`)
  keeps being displayed even though the plugin loads fine now. Use `opencode service restart`.
  Verified 2026-10-18: after a TUI restart the log had no new `failed to load plugin` entry, yet in-session
  `find_usages("Sidebar")` still returned the old failure while fresh `node` imports used the patched code.
- **Re-apply after every plugin update/reinstall**, plus the `@opentui/solid` install below.
- **Verify** by importing the modules directly (`node --input-type=module -e "await import(...)"`) or by calling
  `createFindUsagesTool(...).execute(...)` with stub deps — that is how the fix was validated offline.

## TUI sidebar (`@opentui/solid`)

Same maintenance cycle, separate cause ([[wiki/concepts/opencode-rag-tui-sidebar]]): install the missing peer into the
plugin package itself and restart.

```powershell
npm install --no-save --prefix "<plugin dir>" "@opentui/solid@^0.5.11"
```

Applied 2026-10-18 (resolved to 0.5.17 + `@opentui/core` + `solid-js`). The shim import now succeeds:
`node --input-type=module -e "await import('file:///C:/Users/W3bRe/Desktop/Projects/music-app/.opencode/plugins/rag-tui.js')"`.

## Related

- [[wiki/entities/opencode-rag-plugin]] — wiring, config, index status
- [[wiki/concepts/opencode-rag-tooling-notes]] — measured tool behaviour before/after
- [[wiki/concepts/opencode-rag-tui-sidebar]] — where the panel lives, how to open it
