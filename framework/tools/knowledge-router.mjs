#!/usr/bin/env node
// knowledge-router — Knowledge Router (ADR-025). Décide des documents knowledge utiles
// pour une tâche (capacités ∩ knowledge du skill), borné par policies/routing.yaml.
// Le specialist ne lit plus knowledge/ lui-même : il reçoit cette décision.
// Usage: node tools/knowledge-router.mjs <skillId> <cap1> [cap2 ...]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readJson } from './lib/fsutil.mjs';
import { loadPolicies, get } from './policy.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const [skillId, ...caps] = process.argv.slice(2);
if (!skillId) { console.error('Usage: knowledge-router.mjs <skillId> <cap...>'); process.exit(1); }

const reg = readJson(join(ROOT, 'skills/registry.json'));
const entry = reg.skills.find((s) => s.id === skillId);
if (!entry) { console.error(`skill inconnu: ${skillId}`); process.exit(1); }

const manifest = readJson(join(ROOT, entry.path, 'skill.json'));
const model = loadPolicies();
const maxDocs = get('routing.knowledge.maxDocsPerTask', model) ?? 3;
const want = new Set(caps);

const selected = (manifest.knowledge || [])
  .filter((k) => (k.capabilities || []).some((c) => want.has(c)))
  .slice(0, maxDocs)
  .map((k) => `${entry.path}/${k.file}`);

const decision = {
  apiVersion: '1.0.0', skillId,
  docs: selected,
  rationale: `capabilities ∩ knowledge = [${caps.join(',')}] ; maxDocsPerTask=${maxDocs}`
};
console.log(JSON.stringify(decision, null, 2));
