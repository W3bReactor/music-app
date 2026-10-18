# Local OpenCodeRAG patches

These patches fix OpenCodeRAG behaviour that actively hurts the agent workflow in
this workspace. As of 2026-10-18 the plugin is installed **into this workspace**
(`.opencode/package.json`, exact version `2.4.4`) instead of relying on the global
npm install, so an update can no longer silently replace the patched code.

```
cd .opencode
npm install              # installs the pinned plugin + @opentui/solid, then patches (postinstall)
npm run rag:check        # read-only: version, patch markers, index path normalisation
npm run rag:patch        # re-apply explicitly (idempotent)
node patches/apply-rag-patches.mjs --index-only    # only normalise keyword-index.json
```

`postinstall` runs `node patches/apply-rag-patches.mjs`, so a clean
`npm install` is self-healing. Note that `npm install --ignore-scripts` skips it —
run `npm run rag:patch` afterwards (or use `rag:check` to detect it).

After applying, **restart the opencode background server** — that process imports
the plugins and hosts the agent tools:

```powershell
opencode service restart      # opencode service status -> http://127.0.0.1:45278
```

Closing/reopening the TUI or the desktop app is **not** enough: it attaches to the
same long-lived server (a new `role=cli` run while the old `role=server` run keeps
serving), so both the tools and any cached `failed to load plugin` error card stay
stale.

## What the patch changes (baseline: opencode-rag-plugin 2.4.4)

| # | File | Fix |
|---|------|-----|
| 1 | `dist/retriever/keyword-index.js` | Persist `filePath` with forward slashes. The keyword index stored raw Windows paths while the vector store stored forward-slash paths, so one file had **two identities** (`C:\…` vs `C:/…`). |
| 2 | `dist/plugin.js` | `search_semantic` now always passes `CODE_SEARCH_FILTER`. Quirk-memory chunks (`kind: "quirk"`) were returned as if they were code results whenever `fileExtensions` was omitted — quirk prose outranks code on natural-language queries. Mirrors `mcp/handlers.js`, which already merges the filter. |
| 3 | `dist/opencode/tools.js` | `find_usages` rewritten around an exact-token scan of every indexed chunk, with usage lines re-derived from the file on disk. Previously it ranked retrieval candidates and reported "no reference lines were found" for symbols that *are* referenced (`Sidebar` used in `MainLayout.tsx`), reported the same file twice with doubled counts, ignored `pathHint`, and reported drifted line numbers because TS chunks store header-stripped content. |
| 4 | `dist/opencode/create-read-tool.js` | The read tool no longer appends the requested file's own chunks as "related code chunks" (pure duplication of the body it just printed), and path comparisons are separator/case-insensitive so keyword-origin context is no longer dropped and the file being read no longer reappears in the related-files list. |

`keyword-index.json` also needs a one-time path normalization; the script does it
(step 2). Existing indexes stay usable afterwards — no rebuild required.

## Safety rails in the script

- **Version guard** — the installed `package.json` version must be exactly `2.4.4`
  (the baseline the diff was generated from). Otherwise it exits 1 without touching
  anything, instead of half-applying a diff written for another build.
- **All-or-nothing** — the whole diff is validated with `git apply --check` before
  a single byte is written; a mismatch leaves the tree untouched.
- **Idempotent** — an already patched install reports `patches already applied` and
  does nothing. A *mixed* tree (some files patched, some not) is refused.
- **Post-apply verification** — after `git apply`, all four files must contain the
  `[local patch]` marker, otherwise it exits 1.
- `--check` is read-only (also checks `keyword-index.json` for backslash paths).

## TUI sidebar panel (`@opentui/solid`)

Separate upstream packaging bug (MrDoe/OpenCodeRAG#35): `dist/tui.js` imports
`@opentui/solid`, which the plugin only lists in `devDependencies`. It is now a
**declared, exact dependency** of `.opencode` (`"@opentui/solid": "0.5.17"`), so it
is installed next to the plugin and resolves from the plugin's real path. Pin it:
the version has to match what the current opencode TUI expects — if the panel
disappears after an opencode update, check this dependency first.

## Verification

```powershell
cd .opencode
npm run rag:check

# modules must parse and resolve
node --input-type=module -e "await import('file:///C:/Users/W3bRe/Desktop/Projects/music-app/.opencode/plugins/rag-tui.js')"
```

Then, after `opencode service restart`:

- `find_usages("Sidebar")` → 3 references in 2 files with correct line numbers.
- `search_semantic("<something quirk-flavoured>")` → no quirk chunks in the results.
- `read` on a whole file → no repeated file body under "Related code chunks".

## Notes

- Patched code is marked with `[local patch]` comments — `grep -n "\[local patch\]"`
  inside `.opencode/node_modules/opencode-rag-plugin/dist` shows the local footprint
  (4 files, 14 markers).
- The diff was generated against the pristine 2.4.4 tarball
  (`npm pack opencode-rag-plugin@2.4.4`) and verified to reproduce the patched
  files byte-for-byte. Use `-p2` plus `--directory=<plugin dir relative to the repo
  root>`: `git apply` run from a subdirectory of a work tree silently *skips*
  entries outside it and still exits 0.
- Do **not** use `npm install --prefix .opencode`: npm then adds the parent package
  (`"music-app": "file:.."`) as a dependency of `.opencode`. `cd .opencode` first.
- Bumping the plugin version is now deliberate: change the pin, then regenerate the
  diff against the new tarball and re-verify the four hunks.
- Upstream-worthy: items 1-4 are all portability/correctness bugs, not
  workspace-specific tweaks.
