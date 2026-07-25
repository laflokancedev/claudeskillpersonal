#!/usr/bin/env node
// Extension Loader (ADR-053). Découvre les extensions (extensions/ + sources marketplace),
// les valide (ADR-061), résout les dépendances (ADR-054) et écrit extensions.lock.json.
// Le cœur ne connaît aucune extension : le Loader est l'unique pont, piloté par contrats.
// Usage: node sdk/loader.mjs [--write]
import { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { validateExtension, SDK_API_VERSION } from './validate-extension.mjs';
import { resolveDeps } from './resolve-deps.mjs';

const FRAMEWORK = fileURLToPath(new URL('..', import.meta.url));

export function discover() {
  const roots = [join(FRAMEWORK, 'extensions')];
  const found = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const d of readdirSync(root)) {
      const dir = join(root, d);
      if (statSync(dir).isDirectory() && existsSync(join(dir, 'extension.json'))) {
        const mf = JSON.parse(readFileSync(join(dir, 'extension.json'), 'utf8'));
        mf._dir = dir; mf._source = 'local';
        found.push(mf);
      }
    }
  }
  return found;
}

export function load() {
  const manifests = discover();
  const reports = manifests.map((m) => validateExtension(m._dir));
  const valid = manifests.filter((m, i) => reports[i].valid);
  let lock = { sdkApiVersion: SDK_API_VERSION, generatedAt: new Date().toISOString(), resolved: [], order: [] };
  if (valid.length) lock = resolveDeps(valid, SDK_API_VERSION);
  return { manifests, reports, lock };
}

if (process.argv[1]?.endsWith('loader.mjs')) {
  const { manifests, reports, lock } = load();
  console.log(`Extensions découvertes: ${manifests.length}`);
  for (const r of reports) console.log(`  ${r.valid ? '✅' : '❌'} ${r.name}${r.errors.length ? ' — ' + r.errors.join('; ') : ''}`);
  for (const m of manifests) {
    const p = m.provides || {}; const counts = Object.entries(p).filter(([, v]) => v?.length).map(([k, v]) => `${k}:${v.length}`);
    console.log(`  • ${m.name} fournit [${counts.join(', ') || '—'}] hooks:[${(m.hooks || []).map((h) => h.name).join(',') || '—'}]`);
  }
  console.log(`Ordre de chargement: ${lock.order.join(' → ') || '(aucune extension valide)'}`);
  if (process.argv.includes('--write')) { writeFileSync(join(FRAMEWORK, 'extensions.lock.json'), JSON.stringify(lock, null, 2) + '\n'); console.log('extensions.lock.json écrit.'); }
}
