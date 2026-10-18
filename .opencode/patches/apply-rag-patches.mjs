#!/usr/bin/env node
/**
 * Re-apply the local OpenCodeRAG plugin patches.
 *
 * The patches live in `opencode-rag-plugin-<version>-local.diff` and target the
 * *installed copy* of the plugin (the global npm install that the workspace
 * junction `.opencode/node_modules/opencode-rag-plugin` points at). They are
 * lost whenever the plugin is reinstalled or updated - run this script again
 * afterwards.
 *
 *   node .opencode/patches/apply-rag-patches.mjs
 *   node .opencode/patches/apply-rag-patches.mjs --plugin="C:/some/other/opencode-rag-plugin"
 *   node .opencode/patches/apply-rag-patches.mjs --index-only
 *
 * Steps:
 *   1. `git apply -p2` the diff inside the plugin directory (skipped when the
 *      patch marker is already present).
 *   2. Normalize `keyword-index.json` paths (data migration for the path-identity
 *      fix; harmless to run more than once).
 *
 * Requires `git` on PATH. Safe to run repeatedly.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PATCH_VERSION = "2.4.4";
const MARKER = "[local patch]";

const here = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(here, "..", "..");
const diffPath = path.join(here, `opencode-rag-plugin-${PATCH_VERSION}-local.diff`);

const argv = process.argv.slice(2);
const indexOnly = argv.includes("--index-only");
const pluginArg = argv.find((a) => a.startsWith("--plugin="));

function resolvePluginDir() {
  if (pluginArg) return path.resolve(pluginArg.slice("--plugin=".length));
  const viaJunction = path.join(workspace, ".opencode", "node_modules", "opencode-rag-plugin");
  try {
    return fs.realpathSync(viaJunction);
  } catch {
    return viaJunction;
  }
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

function applyDiff(pluginDir) {
  const pluginFile = path.join(pluginDir, "dist", "plugin.js");
  if (!fs.existsSync(pluginFile)) {
    console.error(`Not an opencode-rag-plugin install: ${pluginDir}`);
    process.exitCode = 1;
    return;
  }
  const version = (() => {
    try {
      return JSON.parse(fs.readFileSync(path.join(pluginDir, "package.json"), "utf-8")).version;
    } catch {
      return "unknown";
    }
  })();
  console.log(`plugin dir: ${pluginDir}`);
  console.log(`plugin version: ${version}${version === PATCH_VERSION ? "" : ` (patch was written for ${PATCH_VERSION}, review the diff before applying)`}`);

  if (fs.readFileSync(pluginFile, "utf-8").includes(MARKER)) {
    console.log("patches already applied - code step skipped");
    return;
  }
  if (!fs.existsSync(diffPath)) {
    console.error(`patch file missing: ${diffPath}`);
    process.exitCode = 1;
    return;
  }
  const check = spawnSync("git", ["-c", "core.autocrlf=false", "apply", "-p2", "--check", diffPath], {
    cwd: pluginDir,
    encoding: "utf-8",
  });
  if (check.status !== 0) {
    console.error("git apply --check failed - the installed build differs from the patched baseline.");
    console.error((check.stderr || check.stdout || "").trim());
    process.exitCode = 1;
    return;
  }
  const applied = spawnSync("git", ["-c", "core.autocrlf=false", "apply", "-p2", diffPath], {
    cwd: pluginDir,
    encoding: "utf-8",
  });
  if (applied.status !== 0) {
    console.error("git apply failed");
    console.error((applied.stderr || applied.stdout || "").trim());
    process.exitCode = 1;
    return;
  }
  const markerCount = ["dist/plugin.js", "dist/opencode/tools.js", "dist/opencode/create-read-tool.js", "dist/retriever/keyword-index.js"]
    .map((rel) => (fs.readFileSync(path.join(pluginDir, rel), "utf-8").match(/\[local patch\]/g) ?? []).length)
    .reduce((a, b) => a + b, 0);
  console.log(`patches applied (${markerCount} patch markers in 4 files)`);
}

if (!indexOnly) applyDiff(resolvePluginDir());
normalizeKeywordIndex();
if (process.exitCode !== 1) {
  console.log("");
  console.log("Next: restart opencode so the patched plugin is loaded, then re-check with find_usages/read.");
}
