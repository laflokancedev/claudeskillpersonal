#!/usr/bin/env node
// compat — Compatibility Analyzer (ADR-070). Prouve qu'aucune régression n'affecte l'API v1
// ni la surface SDK, par diff de snapshot. LECTURE-SEULE (sauf --write-snapshot, baseline).
// Usage: node tools/meta/compat.mjs [--write-snapshot]
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { findByRegex, sha256, readJson, toPosix } from '../lib/fsutil.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));
const snapPath = join(FRAMEWORK, 'meta', 'snapshots', 'frozen.json');

function currentSnapshot() {
  const api = {};
  for (const f of findByRegex(join(FRAMEWORK, 'schemas', 'api'), /\.schema\.json$/))
    api[toPosix(relative(FRAMEWORK, f))] = sha256(readFileSync(f));
  const sdkIndex = join(FRAMEWORK, 'sdk', 'index.mjs');
  const sdk = existsSync(sdkIndex) ? sha256(readFileSync(sdkIndex)) : null;
  return { api, sdk };
}

export function checkCompat() {
  const cur = currentSnapshot();
  if (!existsSync(snapPath)) return { metaApiVersion: '1.0.0', generatedAt: new Date().toISOString(), compatible: true, checks: { baseline: 'absent — première capture requise' }, breaks: [] };
  const base = readJson(snapPath);
  const breaks = [];
  for (const [f, h] of Object.entries(base.api)) {
    if (!(f in cur.api)) breaks.push(`api v1 retiré: ${f}`);
    else if (cur.api[f] !== h) breaks.push(`api v1 modifié (non-additif présumé): ${f}`);
  }
  if (base.sdk && cur.sdk !== base.sdk) breaks.push('surface SDK modifiée');
  return {
    metaApiVersion: '1.0.0', generatedAt: new Date().toISOString(),
    compatible: breaks.length === 0,
    checks: { apiV1: breaks.some((b) => b.includes('api v1')) ? 'changed' : 'unchanged', sdk: breaks.includes('surface SDK modifiée') ? 'changed' : 'unchanged' },
    breaks
  };
}

if (process.argv[1]?.endsWith('compat.mjs')) {
  if (process.argv.includes('--write-snapshot')) {
    mkdirSync(join(FRAMEWORK, 'meta', 'snapshots'), { recursive: true });
    writeFileSync(snapPath, JSON.stringify(currentSnapshot(), null, 2) + '\n');
    console.log('Snapshot de compatibilité (API v1 + SDK) capturé.');
  } else console.log(JSON.stringify(checkCompat(), null, 2));
}
