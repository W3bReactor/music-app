---
title: OpenCode config locations (V2 + legacy) and MCP cleanup
tags: [opencode, config, mcp, gotcha, environment]
sourceRefs: ["C:/Users/W3bRe/.config/opencode/opencode.jsonc", "C:/Users/W3bRe/.opencode/opencode.json", "C:/Users/W3bRe/.local/share/opencode/opencode.db", "C:/Users/W3bRe/.local/share/opencode/log/opencode.log"]
lastReviewed: 2026-10-18
---

# OpenCode config locations (V2 + legacy)

OpenCode V2 reads **more than one** global config directory on this machine. Two files that both look "global" exist,
and MCP servers in the legacy one are still loaded:

| Path | Role |
|---|---|
| `~/.config/opencode/` | V2 config home. `opencode.jsonc` (providers, active `mcp`), `cli.json` (CLI/session UI prefs), `service.json` (background-service password), `package.json` + `node_modules` for `@opencode-ai/plugin` |
| `~/.opencode/` | Legacy (V1) config home, still read. `opencode.json` + `opencode.jsonc`, its own `node_modules` |
| `~/.local/share/opencode/` | State: `opencode.db` (SQLite: sessions/messages/parts), `log/opencode.log`, `storage/`, `snapshot/`, `shell/`, `tool-output/` |

Project-level config, in resolution order of relevance: `opencode.json` (repo root, absent here) →
`.opencode/opencode.json` (schema only here) → `.opencode/tui.json` (registers `./plugins/rag-tui.js`). The RAG plugin
itself is a pinned workspace dependency in `.opencode/package.json` — see
[[wiki/concepts/opencode-rag-local-patches]].

## The `nextjs-mcp` incident (fixed 2026-10-18)

`opencode mcp list` reported:

```
✓ next-devtools  connected
✗ nextjs-mcp     failed: … 404 '@modelcontextprotocol/server-nextjs@*' is not in this registry
```

The package `@modelcontextprotocol/server-nextjs` **does not exist on npm** — the real Next.js MCP server is
`next-devtools-mcp` (already configured and connected). The entry came from an earlier assistant session, which had
appended it to **both** `~/.opencode/opencode.json` (picked up by opencode) and `~/.lmstudio/mcp.json` (LM Studio's own
config, unrelated to opencode).

Fix: removed the `mcp` block from `~/.opencode/opencode.json` (backup: `opencode.json.bak`), leaving it identical to the
adjacent `opencode.jsonc`; the working `next-devtools` MCP in `~/.config/opencode/opencode.jsonc` is untouched. Takes
effect at the next server start — no need to restart immediately, since the failed server only costs a few warnings.

Diagnostic that found the source: the state DB stores every tool call, so the originating edit was visible without
guessing —

```powershell
node --experimental-sqlite -e "…select * from part where data like '%server-nextjs%'…"
```

## Gotchas

- A config key duplicated across `~/.config/opencode` and `~/.opencode` is **not** obviously merged or overridden —
  check both before concluding "the setting is ignored".
- `opencode mcp` has `list`, `add`, `auth`, `logout` — **no `remove`**. Deleting a server means editing the config file
  that declared it.
- Anything added to `~/.lmstudio/mcp.json` affects LM Studio only, never opencode.

## Related

- [[wiki/entities/opencode-rag-plugin]] — the RAG plugin's own config (`opencode-rag.json`) and plugin registration
- [[wiki/concepts/opencode-rag-local-patches]] — why plugin fixes need `opencode service restart`
- [[wiki/concepts/opencode-rag-tui-sidebar]] — the `.opencode/tui.json` entry this config registers
