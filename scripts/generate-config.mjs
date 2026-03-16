#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const configPath = positional[0] || path.resolve(process.cwd(), 'dashboard-config.local.json');
const home = os.homedir();
const cliExcludes = getExcludeArg(args);

function getExcludeArg(argv) {
  const key = '--exclude=';
  const found = argv.find((a) => a.startsWith(key));
  if (!found) return [];
  return found
    .slice(key.length)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function expandHome(p) {
  if (!p) return p;
  return p.replace(/^\$HOME|^\{HOME\}|^~/, home);
}

function compactHome(p) {
  if (!p) return p;
  return p.startsWith(home) ? `$HOME${p.slice(home.length)}` : p;
}

function iconFor(name, isDir) {
  if (isDir) return '📁';
  const lower = name.toLowerCase();
  if (lower.endsWith('.md')) return '📝';
  if (lower.endsWith('.html')) return '🌐';
  if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) return '📑';
  if (lower.endsWith('.pdf')) return '📕';
  if (lower.endsWith('.json')) return '🧩';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif') || lower.endsWith('.webp')) return '🖼️';
  return '📄';
}

function categoryForRoot(rootPath) {
  const base = path.basename(rootPath);
  return base || 'Etc';
}

async function buildIcons(roots) {
  const icons = [];
  const excludes = unique([...DEFAULT_EXCLUDES, ...cliExcludes]);
  for (const rawRoot of roots) {
    const rootPath = expandHome(rawRoot);
    const category = categoryForRoot(rootPath);
    let entries = [];
    try {
      entries = await fs.readdir(rootPath, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      if (matchesExclude(entry.name, excludes)) continue;
      const absPath = path.join(rootPath, entry.name);
      let stats = null;
      try {
        stats = await fs.stat(absPath);
      } catch {
        stats = null;
      }
      icons.push({
        label: entry.name,
        category,
        icon: iconFor(entry.name, entry.isDirectory()),
        bg: 'bg-blue',
        path: compactHome(absPath + (entry.isDirectory() ? '/' : '')),
        modifiedAt: stats && stats.mtime ? stats.mtime.toISOString() : '',
        createdAt: stats && stats.birthtime ? stats.birthtime.toISOString() : ''
      });
    }
  }

  icons.sort((a, b) => {
    const c = a.category.localeCompare(b.category);
    return c !== 0 ? c : a.label.localeCompare(b.label);
  });
  return icons;
}

const DEFAULT_EXCLUDES = ['.git', 'node_modules', '.DS_Store'];

function matchesExclude(name, patterns) {
  const lower = String(name).toLowerCase();
  return patterns.some((p) => lower.includes(String(p).toLowerCase()));
}

function unique(list) {
  return Array.from(new Set(list));
}

async function main() {
  const configRaw = await fs.readFile(configPath, 'utf8');
  const config = JSON.parse(configRaw);
  const roots = Array.isArray(config.roots) ? config.roots : [];
  if (Array.isArray(config.excludePatterns)) {
    cliExcludes.push(...config.excludePatterns);
  }
  config.icons = await buildIcons(roots);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  const excludes = unique([...DEFAULT_EXCLUDES, ...cliExcludes]);
  console.log(`Updated icons: ${config.icons.length} (exclude: ${excludes.join(', ')})`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
