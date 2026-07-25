#!/usr/bin/env node
// change-detector — Change Detector (ADR-045). Diff déterministe de deux inventaires (hashes).
// Usage: node tools/intel/change-detector.mjs <prevInventory.json> <curInventory.json>
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readJson } from '../lib/fsutil.mjs';

export function changeSet(prev, cur) {
  const p = new Map(prev.files.map((f) => [f.path, f.hash]));
  const c = new Map(cur.files.map((f) => [f.path, f.hash]));
  const added = [], removed = [], modified = []; let unchanged = 0;
  for (const [path, h] of c) { if (!p.has(path)) added.push(path); else if (p.get(path) !== h) modified.push(path); else unchanged++; }
  for (const path of p.keys()) if (!c.has(path)) removed.push(path);
  return { apiVersion: '1.0.0', added: added.sort(), removed: removed.sort(), modified: modified.sort(), unchanged };
}

if (process.argv[1]?.endsWith('change-detector.mjs')) {
  const prev = readJson(join(process.cwd(), process.argv[2]));
  const cur = readJson(join(process.cwd(), process.argv[3]));
  console.log(JSON.stringify(changeSet(prev, cur), null, 2));
}
