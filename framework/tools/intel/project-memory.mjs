#!/usr/bin/env node
// project-memory — Project Memory (ADR-044). Cache profils/inventaires par contentHash.
// Évite de réanalyser un dépôt inchangé. Usage: node tools/intel/project-memory.mjs has|get|put …
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readJson } from '../lib/fsutil.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));
export const repoKey = (root) => root.split(/[\\/]/).filter(Boolean).slice(-2).join('_').replace(/[^a-z0-9_]/gi, '_');
const dir = (key) => { const d = join(FRAMEWORK, 'memory', 'project', key); mkdirSync(d, { recursive: true }); return d; };

export function memHas(key, contentHash) {
  const p = join(dir(key), 'profile.json');
  return existsSync(p) && readJson(p).contentHash === contentHash;
}
export function memGetProfile(key) { const p = join(dir(key), 'profile.json'); return existsSync(p) ? readJson(p) : null; }
export function memGetInventory(key) { const p = join(dir(key), 'inventory.json'); return existsSync(p) ? readJson(p) : null; }
export function memPut(key, profile, inventory) {
  writeFileSync(join(dir(key), 'profile.json'), JSON.stringify(profile, null, 2));
  if (inventory) writeFileSync(join(dir(key), 'inventory.json'), JSON.stringify(inventory, null, 2));
}

if (process.argv[1]?.endsWith('project-memory.mjs')) {
  const [cmd, key, arg] = process.argv.slice(2);
  if (cmd === 'has') console.log(memHas(key, arg));
  else if (cmd === 'get') console.log(JSON.stringify(memGetProfile(key)));
  else console.error('Usage: project-memory.mjs has <key> <hash> | get <key>');
}
