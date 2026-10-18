#!/usr/bin/env node
/**
 * Re-apply the local OpenCodeRAG plugin patches.
 *
 * Target: the workspace-local install `.opencode/node_modules/opencode-rag-plugin`
 * (declared with an exact version in `.opencode/package.json`). `npm install`
 * inside `.opencode` runs this automatically through the `postinstall` hook.
 *
 *   npm install --prefix .opencode                              # installs + patches
 *   node .opencode/patches/apply-rag-patches.mjs                # patch only
 *   node .opencode/patches/apply-rag-patches.mjs --check        # read-only report
 *   node .opencode/patches/apply-rag-patches.mjs --index-only   # normalize index paths
 *   node .opencode/patches/apply-rag-patches.mjs --plugin=<dir> # other install
 *
 * Guarantees:
 *   - the installed version must be exactly PATCH_VERSION, otherwise exit 1 and
 *     touch nothing (the diff was generated against that tarball);
 *   - all-or-nothing: the whole diff is validated with `git apply --check`
 *     before anything is written, so a mismatch never leaves a half-patched tree;
 *   - idempotent: running it on an already patched install is a no-op;
 *   - after applying, every patched file must contain the `[local patch]` marker,
 *     otherwise exit 1.
 *
 * Requires `git` on PATH.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PATCH_VERSION = "2.4.4";
const MARKER = "[local patch]";
const PATCHED_FILES = [
  "dist/plugin.js",
  "dist/opencode/tools.js",
  "dist/opencode/create-read-tool.js",
  "dist/retriever/keyword-index.js",
];

const here = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(here, "..", "..");
const diffPath = path.join(here, `opencode-rag-plugin-${PATCH_VERSION}-local.diff`);

const argv = process.argv.slice(2);
const indexOnlyOnly = argv.includes("--index-only");
const checkOnly = argv.includes("--check");
const pluginArg = argv.find((a) => a.startsWith("--plugin="));

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exitCode = 1;
}

function resolvePluginDir() {
  if (pluginArg) return path.resolve(pluginArg.slice("--plugin=".length));
  return path.join(workspace, ".opencode", "node_modules", "opencode-rag-plugin");
}

function markerCounts(pluginDir) {
  return PATCHED_FILES.map((rel) => {
    const file = path.join(pluginDir, rel);
    if (!fs.existsSync(file)) return -1;
    return (fs.readFileSync(file, "utf-8").match(/\[local patch\]/g) ?? []).length;
  });
}

function keywordIndexStatus() {
  const target = path.join(workspace, ".opencode", "rag_db", "keyword-index.json");
  if (!fs.existsSync(target)) return { target, exists: false, total: 0, dirty: 0 };
  const parsed = JSON.parse(fs.readFileSync(target, "utf-8"));
  const entries = Object.values(parsed.chunkMap ?? {});
  const dirty = entries.filter((e) => String(e.filePath ?? "").includes("\\")).length;
  return { target, exists: true, total: entries.length, dirty };
}

function normalizeKeywordIndex() {
  const target = path.join(workspace, ".opencode", "rag_db", "keyword-index.json");
  if (!fs.existsSync(target)) {
    console.log("keyword-index.json not found - skipped (run `opencode-rag index` first)");
    return;
  }
  const parsed = JSON.parse(fs.readFileSync(target, "utf-8"));
  let changed = 0;
  for (const entry of Object.values(parsed.chunkMap ?? {})) {
    const next = String(entry.filePath ?? "").replace(/\\/g, "/");
    if (next !== entry.filePath) {
      entry.filePath = next;
      changed++;
    }
  }
  if (changed > 0) {
    fs.writeFileSync(target, JSON.stringify(parsed), "utf-8");
  }
  console.log(`keyword-index.json: normalized ${changed} file path(s) of ${Object.keys(parsed.chunkMap ?? {}).length}`);
}

function gitApplyInvocation(pluginDir) {
  // `git apply` resolves paths against the *repository root* when the target
  // directory lives inside a work tree; run from a subdirectory it silently
  // reports "Skipped patch ..." and still exits 0. So when the plugin dir is
  // inside a repo, apply from the toplevel with `--directory=<rel>`.
  const top = spawnSync("git", ["-C", pluginDir, "rev-parse", "--show-toplevel"], {
    encoding: "utf-8",
  });
  if (top.status === 0) {
    const toplevel = top.stdout.trim();
    const rel = path.relative(toplevel, pluginDir).split(path.sep).join("/");
    if (rel && !rel.startsWith("..") && !path.isAbsolute(rel)) {
      return { cwd: toplevel, prefix: ["--directory=" + rel] };
    }
  }
  return { cwd: pluginDir, prefix: [] };
}

function applyDiff(pluginDir) {
  const pkgFile = path.join(pluginDir, "package.json");
  if (!fs.existsSync(pkgFile)) {
    return fail(`not an opencode-rag-plugin install (no package.json): ${pluginDir}`);
  }

  const version = (() => {
    try {
      return JSON.parse(fs.readFileSync(pkgFile, "utf-8")).version;
    } catch {
      return "unknown";
    }
  })();
  console.log(`plugin dir: ${pluginDir}`);
  console.log(`plugin version: ${version}`);

  if (version !== PATCH_VERSION) {
    return fail(
      `installed version is ${version}, but the local diff was generated against ${PATCH_VERSION}.\n` +
        `  Nothing was modified. Either pin "opencode-rag-plugin": "${PATCH_VERSION}" in .opencode/package.json,\n` +
        `  or regenerate the diff against the new version (.opencode/patches/README.md).`
    );
  }
  if (!fs.existsSync(diffPath)) {
    return fail(`patch file missing: ${diffPath}`);
  }

  const before = markerCounts(pluginDir);
  if (before.some((n) => n === -1)) {
    return fail(`patched file missing in ${pluginDir} - the package layout changed`);
  }
  const patchedFiles = before.filter((n) => n > 0).length;

  if (patchedFiles === PATCHED_FILES.length) {
    console.log(`patches already applied (${before.reduce((a, b) => a + b, 0)} markers) - nothing to do`);
    return;
  }
  if (patchedFiles !== 0) {
    return fail(
      `partial patch state: ${patchedFiles}/${PATCHED_FILES.length} files carry the marker (${before.join(", ")}).\n` +
        `  Refusing to patch on top of a mixed tree - reinstall the package and run this script again.`
    );
  }

  if (checkOnly) {
    return fail("patches are NOT applied (rerun without --check to apply)");
  }

  const invocation = gitApplyInvocation(pluginDir);
  const gitArgs = (extra) => [
    "-c",
    "core.autocrlf=false",
    "apply",
    "-p2",
    ...invocation.prefix,
    ...extra,
    diffPath,
  ];

  const check = spawnSync("git", gitArgs(["--check"]), {
    cwd: invocation.cwd,
    encoding: "utf-8",
  });
  if (check.status !== 0) {
    return fail(
      "git apply --check failed - the installed build differs from the patched baseline; nothing was written.\n" +
        (check.stderr || check.stdout || "").trim()
    );
  }

  const applied = spawnSync("git", gitArgs([]), {
    cwd: invocation.cwd,
    encoding: "utf-8",
  });
  if (applied.status !== 0) {
    return fail("git apply failed\n" + (applied.stderr || applied.stdout || "").trim());
  }

  const after = markerCounts(pluginDir);
  if (after.some((n) => n === 0)) {
    return fail(`apply reported success but markers are missing (${after.join(", ")})`);
  }
  console.log(`patches applied (${after.reduce((a, b) => a + b, 0)} markers in ${PATCHED_FILES.length} files)`);
}

if (checkOnly) {
  console.log(`patch baseline: ${PATCH_VERSION} (${path.basename(diffPath)})`);
  const pluginDir = resolvePluginDir();
  const pkgFile = path.join(pluginDir, "package.json");
  if (!fs.existsSync(pkgFile)) {
    fail(`not an opencode-rag-plugin install: ${pluginDir}`);
  } else {
    console.log(`plugin dir: ${pluginDir}`);
    const version = JSON.parse(fs.readFileSync(pkgFile, "utf-8")).version;
    console.log(`plugin version: ${version}`);
    if (version !== PATCH_VERSION) {
      fail(`installed version ${version} != patch baseline ${PATCH_VERSION}`);
    }
    const counts = markerCounts(pluginDir);
    counts.forEach((n, i) => console.log(`  ${n > 0 ? "✓" : "✗"} ${PATCHED_FILES[i]}: ${n} marker(s)`));
    if (counts.some((n) => n <= 0)) fail("patches are NOT fully applied");
  }
  const idx = keywordIndexStatus();
  if (!idx.exists) {
    console.log("keyword-index.json: missing (run `opencode-rag index`)");
  } else {
    console.log(`keyword-index.json: ${idx.total} entries, ${idx.dirty} with backslash paths`);
    if (idx.dirty > 0) fail("keyword-index.json needs normalization");
  }
} else {
  if (!indexOnlyOnly) applyDiff(resolvePluginDir());
  if (!process.exitCode) normalizeKeywordIndex();
  if (!process.exitCode) {
    console.log("");
    console.log("Next: restart the opencode background server (`opencode service restart`) so the plugin reloads.");
  }
}
