---
title: OpenCodeRAG plugin
tags: [rag, plugin, tooling, opencode, search]
sourceRefs: [opencode-rag.json, .opencode/tui.json, .opencode/plugins/rag-plugin.js, .opencode/plugins/rag-tui.js, AGENTS.md]
lastReviewed: 2026-10-18
---

# OpenCodeRAG plugin

Local-first RAG plugin (`opencode-rag-plugin`, currently **v2.4.4**) that indexes this workspace into a vector DB and
exposes semantic retrieval tools to the agent. It exists to replace whole-file reads with targeted chunk retrieval
(token savings) and to answer "where is X" questions fast.

## How it is wired here

| Piece | Path | Role |
|---|---|---|
| Config | `opencode-rag.json` | Embedding, indexing, retrieval, image description, logging |
| Vector store | `.opencode/rag_db/` (LanceDB, 1024-dim) | Chunks + keyword index + manifest |
| Server plugin | `.opencode/plugins/rag-plugin.js` → `dist/plugin-entry.js` | Registers tools, read override, context injection |
| TUI plugin | `.opencode/plugins/rag-tui.js` → `dist/tui.js` | Registers the sidebar panel + keybinds |
| Skill | `.opencode/skills/opencode-rag/SKILL.md` | Tool-usage decision tree |
| Directive | `AGENTS.md` (between `<!-- BEGIN opencode-rag -->` markers) | Re-injected by `opencode-rag init` |

The package is a **pinned local install**: `.opencode/package.json` declares `opencode-rag-plugin` `2.4.4` (exact) plus
`@opentui/solid` `0.5.17`, the lockfile is committed and `node_modules` is gitignored. That replaced the old junction
chain (`.opencode/node_modules` → `~/.opencode/node_modules` → global npm install), which made dependency resolution and
updates fragile. `.opencode/node_modules/opencode-rag-plugin` is patched locally by `postinstall`. See
[[wiki/concepts/opencode-rag-local-patches]].

## Tools exposed to the agent

`search_semantic`, `get_file_skeleton`, `find_usages`, `describe_image`, `recall_quirks`, `add_quirk`, `update_quirk`,
`delete_quirk`, plus a RAG-backed `read` override. Registered in the server role only — they do not depend on the TUI
plugin.

## Embedding / models

Configured against an LM Studio-compatible endpoint (`http://26.102.192.223:1234/v1`): embeddings
`text-embedding-qwen3-embedding-0.6b`, vision/description `qwen3.5-4b`. `decision` (tev1) is disabled — the config also
emits a warning that `decision.provider: "openai"` is not supported.

## LLM-generated descriptions (qwen3.5-4b)

Two independent description passes, both on `qwen3.5-4b` over the same LM Studio endpoint:

| Config section | What it describes | Where the text lands |
|---|---|---|
| `description` | Every code/doc chunk during indexing (`numCtx` 4096, `maxContentChars` 4000) | Chunk metadata in LanceDB, cached in `.opencode/rag_db/.desc-cache.json` (key `"<fileHash>_<descHash>"`), per-file `descHash` in `manifest.json` |
| `imageDescription` | Image files (vision, `think: false`, `numCtx` 2048) | Same cache + chunk metadata, searchable as text |

These texts are **not** code comments — they are model output, and they participate in retrieval (which is how CSS files
match a query about "sidebar buttons"). Consumers surface them as the `>` line under a result in
`search_semantic` / `opencode-rag show` / the `read` override's context block.

## Status (2026-10-18)

`opencode-rag status`: 306 chunks (298 code + 8 quirks), 91 files, 0 orphans, store dim matches embedder dim, plugin
enabled. `openCode.autoIndex.enabled: true` (chokidar watcher, 2 s debounce / 5 min interval) so the index refreshes
while editing; the config warning about `decision.provider` is gone (`decision` is disabled and its provider is set to
`ollama`).

## Local patches

Four behaviours were fixed by patching the installed plugin `dist/` (keyword-index path normalization, `search_semantic`
kind filter, `find_usages` exact scan + disk-verified line numbers, read-tool self-chunk dedupe) plus the TUI
`@opentui/solid` install. All of it lives in `.opencode/patches/`, is lost on plugin updates, and needs
`opencode service restart` to take effect — see [[wiki/concepts/opencode-rag-local-patches]].

**Verified live 2026-10-18 23:48** (local pinned install, after `opencode service restart`): the shim resolves to
`.opencode/node_modules/opencode-rag-plugin` (8 `[local patch]` markers in `tools.js`); `find_usages` gives
`Sidebar` 3/2, `SidebarItem` 12/1, `SvgIcon` 14/7; `search_semantic` returns code only; whole-file `read` no longer
duplicates the body; the log records `loading plugin … rag-tui.js` with no failure.

## Config locations

Plugin config is `opencode-rag.json` at the repo root; the OpenCode-side registration lives in `.opencode/opencode.json`
and (for the TUI panel) `.opencode/tui.json`. Global config/state paths — including the legacy `~/.opencode/` directory
OpenCode V2 still reads for `mcp` — are mapped in [[wiki/concepts/opencode-config-locations]].

## Gotchas

- The patches live in the pinned local install, so `npm install` in `.opencode` re-applies them via `postinstall`; if
  scripts were skipped (`npm install --ignore-scripts`), run `npm run rag:patch` and check with `npm run rag:check`.
- The running opencode process caches plugin modules — patches only apply after restarting the **background server**
  (`opencode service restart`), not after reopening the TUI/desktop (it reattaches to the same server process).
- `autoIndex` now needs the LM Studio endpoint (`http://26.102.192.223:1234/v1`) to be reachable, otherwise re-embeds
  fail and the index silently goes stale again.
- Chunk content for TS/TSX is header-stripped, so chunk line ranges drift from the file — verify with `read`.
- [[wiki/concepts/opencode-rag-tui-sidebar]] — where the panel lives and how it was fixed.
