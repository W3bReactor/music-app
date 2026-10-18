---
title: OpenCodeRAG TUI sidebar
tags: [tui, sidebar, plugin, gotcha, opencode]
sourceRefs: [".opencode/node_modules/opencode-rag-plugin/dist/tui.js", ".opencode/tui.json", "C:/Users/W3bRe/.local/share/opencode/log/opencode.log", "https://github.com/MrDoe/OpenCodeRAG/issues/35", "https://opencode.ai/docs/keybinds/"]
lastReviewed: 2026-10-18
---

# OpenCodeRAG TUI sidebar

Question this page answers: *"where is the RAG button in the sidebar?"*

> **Status 2026-10-18: fixed locally.** The missing `@opentui/solid` is now installed into the plugin package (see
> *Fix applied* below). The panel needs a restart of the background server (`opencode service restart`) to appear;
> re-do the install after any plugin update.

## There is no button

OpenCodeRAG ships **no clickable GUI button or icon**. Its UI surfaces are:

1. **A panel appended to the OpenCode terminal-TUI sidebar.** The TUI plugin calls
   `ui.slot({ append: "sidebar.content", render })` and draws a bordered box titled `OpenCodeRAG` with version, chunk
   count / provider / model, index + watcher status lines, keybinds, and token usage.
2. **An unrelated browser dashboard** (`opencode-rag ui`) with its own left nav (Dashboard, Chunks, Files, Compare, 3D).

So: in the terminal TUI, first *open* the sidebar, then look inside it.

## Opening the sidebar

OpenCode's `sidebar_toggle` keybind defaults to `<leader>b` — i.e. press **Ctrl+X, then B**. Leader key is `ctrl+x`
(`leader_timeout` 2000 ms). Customize via `tui.json` → `keybinds.sidebar_toggle`.

Keybinds the panel itself advertises:

| Key | Action |
|---|---|
| `ctrl+shift+r` | OpenCodeRAG settings dialog (`tui.settingsKeybinding`) |
| `ctrl+enter` | Append a RAG file list to the prompt (`tui.fileListKeybinding`) |
| `ctrl+alt+enter` | Append full RAG code chunks to the prompt (`tui.chunksKeybinding`) |

## Root cause (upstream packaging bug)

`dist/tui.js` line 5 statically imports `@opentui/solid`, but that package is declared only under `devDependencies` of
`opencode-rag-plugin`, so npm/global installs omit it. Every session since 2026-10-14 logged:

```
level=WARN message="failed to load plugin" target="...\.opencode\plugins\rag-tui.js"
cause="Cause([Die(ResolveMessage: Cannot find package '@opentui/solid' imported from
  C:\Users\W3bRe\AppData\Roaming\npm\node_modules\opencode-rag-plugin\dist\tui.js)])"
```

Tracked upstream as [MrDoe/OpenCodeRAG#35](https://github.com/MrDoe/OpenCodeRAG/issues/35) (open, no fix released as of
2.4.4). The server-side plugin (`dist/plugin-entry.js`) has no `@opentui` import and loads fine, which is why the *tools*
work while the *panel* is missing.

## Fix applied (2026-10-18)

Install the missing package **into the plugin package itself** (`--no-save`), so it resolves from the real path the TUI
plugin is loaded from — the workspace `.opencode/node_modules` junction does not help, Node follows the realpath:

```powershell
npm install --no-save --prefix "C:\Users\W3bRe\AppData\Roaming\npm\node_modules\opencode-rag-plugin" "@opentui/solid@^0.5.11"
```

This resolved to `@opentui/solid@0.5.17` plus its `@opentui/core` and `solid-js` peers. Verification (the import that
used to fail):

```powershell
node --input-type=module -e "await import('file:///C:/Users/W3bRe/Desktop/Projects/music-app/.opencode/plugins/rag-tui.js')"
# -> rag-tui.js imports OK
```

Then restart the **background server** (`opencode service restart`) — plugin modules are cached per process and a TUI
restart reattaches to the same server — and open the sidebar with Ctrl+X, B; the log should no longer contain
`failed to load plugin ... rag-tui.js`.

Note: after the install the TUI run started clean (no new WARN), yet the UI still showed the *old* `Server plugin error`
card with reference `err_546f0d61` — that reference is the 19:25 log entry from before the fix, kept in the stale server
process's plugin registry. Matching the reference against the log timestamp tells you whether an error card is current.

Caveats: `npm install --no-save` means a plugin update/reinstall wipes it — re-run the command. `@opentui/core` declares
`bun >= 1.3.0 || node >= 26.4.0`, so the panel only renders on opencode's Bun runtime (Node 22 in this workspace cannot
run it directly). The host app matters too: this slot exists only in the **terminal TUI**; the desktop/web app renders no
such panel.

## Related

- [[wiki/entities/opencode-rag-plugin]]
- [[wiki/concepts/opencode-rag-local-patches]] — the other local plugin fixes and the re-apply script
