# Local OpenCodeRAG patches

These patches fix OpenCodeRAG behaviour that actively hurts the agent workflow in
this workspace. They target the **installed copy** of `opencode-rag-plugin`
(the global npm install that `.opencode/node_modules/opencode-rag-plugin` is a
junction to), so they are lost on every plugin update/reinstall.

```
node .opencode/patches/apply-rag-patches.mjs        # idempotent, needs `git` on PATH
```

After applying, **restart the opencode background server** — that process imports
the plugins and hosts the agent tools, so it keeps the old modules in memory:

```powershell
opencode service restart      # opencode service status -> http://127.0.0.1:45278
```

Closing/reopening the TUI or the desktop app is **not** enough: it attaches to the
same long-lived server (the log shows a new `role=cli` run while the old
`role=server` run keeps serving), so both the tools and the cached
`failed to load plugin` error card stay stale.

## What the patch changes (baseline: opencode-rag-plugin 2.4.4)

| # | File | Fix |
|---|------|-----|
| 1 | `dist/retriever/keyword-index.js` | Persist `filePath` with forward slashes. The keyword index stored raw Windows paths while the vector store stored forward-slash paths, so one file had **two identities** (`C:\…` vs `C:/…`). |
| 2 | `dist/plugin.js` | `search_semantic` now always passes `CODE_SEARCH_FILTER`. Quirk-memory chunks (`kind: "quirk"`) were returned as if they were code results whenever `fileExtensions` was omitted — quirk prose outranks code on natural-language queries. Mirrors `mcp/handlers.js`, which already merges the filter. |
| 3 | `dist/opencode/tools.js` | `find_usages` rewritten around an exact-token scan of every indexed chunk, with usage lines re-derived from the file on disk. Previously it ranked retrieval candidates and reported "no reference lines were found" for symbols that *are* referenced (`Sidebar` used in `MainLayout.tsx`), reported the same file twice with doubled counts, ignored `pathHint`, and reported drifted line numbers because TS chunks store header-stripped content. |
| 4 | `dist/opencode/create-read-tool.js` | The read tool no longer appends the requested file's own chunks as "related code chunks" (pure duplication of the body it just printed), and path comparisons are separator/case-insensitive so keyword-origin context is no longer dropped and the file being read no longer reappears in the related-files list. |

`keyword-index.json` also needs a one-time path normalization; the script does it
(step 2). Existing indexes stay usable afterwards — no rebuild required.

## TUI sidebar panel (`@opentui/solid`)

Separate upstream packaging bug (MrDoe/OpenCodeRAG#35): `dist/tui.js` imports
`@opentui/solid`, which is only listed in `devDependencies`, so the TUI sidebar
plugin fails to load with `Cannot find package '@opentui/solid'`. Install it next
to the plugin (a reinstall wipes it too):

```powershell
npm install --no-save --prefix "<plugin dir>" "@opentui/solid@^0.5.11"
```

`<plugin dir>` is the path printed by `apply-rag-patches.mjs`, e.g.
`C:\Users\W3bRe\AppData\Roaming\npm\node_modules\opencode-rag-plugin`.

## Verification

```powershell
# modules must parse
node --input-type=module -e "await import('file:///.../dist/opencode/tools.js')"

# TUI shim must import (used to fail on @opentui/solid)
node --input-type=module -e "await import('file:///C:/Users/W3bRe/Desktop/Projects/music-app/.opencode/plugins/rag-tui.js')"
```

Then, after an opencode restart:

- `find_usages("Sidebar")` → 3 references in 2 files with correct line numbers.
- `search_semantic("<something quirk-flavoured>")` → no quirk chunks in the results.
- `read` on a whole file → no repeated file body under "Related code chunks".

## Notes

- Patched code is marked with `[local patch]` comments — `grep -n "\[local patch\]"`
  inside the plugin `dist/` shows the full local footprint (4 files).
- The diff was generated against the pristine 2.4.4 tarball
  (`npm pack opencode-rag-plugin@2.4.4`) and verified to reproduce the patched
  files byte-for-byte.
- Upstream-worthy: items 1-4 are all portability/correctness bugs, not
  workspace-specific tweaks.
