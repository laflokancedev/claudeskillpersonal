#!/usr/bin/env node
// artifacts — Artifact Store (ADR-026). Enveloppe métadonnées + hash ; adressage par id.
// Usage:
//   node tools/artifacts.mjs put <kind> <id> <file> [--workflow w] [--origin o]
//   node tools/artifacts.mjs get <kind> <id>
//   node tools/artifacts.mjs list <kind>
import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { sha256, readJson } from './lib/fsutil.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const KINDS = ['runs', 'plans', 'reports', 'validation', 'documents'];
const [cmd, kind, id, file] = process.argv.slice(2);
const flag = (n) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : undefined; };

function dir(k) { const d = join(ROOT, 'artifacts', k); mkdirSync(d, { recursive: true }); return d; }
if (cmd !== 'list' && !KINDS.includes(kind)) { console.error(`kind ∈ ${KINDS.join('|')}`); process.exit(1); }

if (cmd === 'put') {
  const raw = readFileSync(join(ROOT, file), 'utf8');
  let payload; try { payload = JSON.parse(raw); } catch { payload = raw; }
  const artifact = { id, kind, version: '1.0.0', hash: sha256(raw), date: new Date().toISOString(),
    workflow: flag('workflow') || null, origin: flag('origin') || 'cli', payload };
  writeFileSync(join(dir(kind), `${id}.json`), JSON.stringify(artifact, null, 2) + '\n');
  console.log(`artifact ${kind}/${id} stocké (${artifact.hash.slice(0, 16)}…)`);
} else if (cmd === 'get') {
  const p = join(dir(kind), `${id}.json`);
  if (!existsSync(p)) { console.error('introuvable'); process.exit(1); }
  console.log(JSON.stringify(readJson(p), null, 2));
} else if (cmd === 'list') {
  for (const k of (kind ? [kind] : KINDS)) {
    const d = join(ROOT, 'artifacts', k);
    const items = existsSync(d) ? readdirSync(d).filter((f) => f.endsWith('.json')) : [];
    console.log(`${k}: ${items.map((f) => f.replace('.json', '')).join(', ') || '(vide)'}`);
  }
} else { console.error('Usage: artifacts.mjs put|get|list …'); process.exit(1); }
