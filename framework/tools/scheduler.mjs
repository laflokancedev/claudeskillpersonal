#!/usr/bin/env node
// scheduler — Scheduler (ADR-022 / ADR-023). Construit le DAG depuis l'Execution Graph et
// produit un Schedule : vagues parallèles + timeouts + retries (policies/execution.yaml).
// L'orchestrateur ne planifie plus l'ordre/parallélisme.
// Usage: node tools/scheduler.mjs --from-workflow workflows/sds.yaml
//        node tools/scheduler.mjs <plan.json>
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parseYaml } from './lib/yaml.mjs';
import { readJson } from './lib/fsutil.mjs';
import { loadPolicies, get } from './policy.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const argv = process.argv.slice(2);

let tasks;
if (argv[0] === '--from-workflow') {
  const wf = parseYaml(readFileSync(join(ROOT, argv[1]), 'utf8'));
  tasks = (wf.steps || []).map((s) => ({ id: s.id, dependencies: s.needs || s.dependencies || [] }));
} else {
  const plan = readJson(join(ROOT, argv[0]));
  tasks = (plan.tasks || []).map((t) => ({ id: t.id, dependencies: t.dependencies || t.needs || [] }));
}

const ids = new Set(tasks.map((t) => t.id));
for (const t of tasks) for (const d of t.dependencies) if (!ids.has(d)) { console.error(`dépendance inconnue: ${d}`); process.exit(1); }

// Niveaux (plus longue distance depuis une racine) → parallélisme maximal.
const level = new Map();
const depsOf = new Map(tasks.map((t) => [t.id, t.dependencies]));
const state = new Map();
function lvl(id, stack = new Set()) {
  if (stack.has(id)) { console.error(`cycle détecté: ${id}`); process.exit(1); }
  if (level.has(id)) return level.get(id);
  stack.add(id);
  const deps = depsOf.get(id) || [];
  const v = deps.length ? Math.max(...deps.map((d) => lvl(d, stack))) + 1 : 0;
  stack.delete(id);
  level.set(id, v);
  return v;
}
for (const t of tasks) lvl(t.id);

const model = loadPolicies();
const maxSpecialists = get('execution.maxSpecialists', model) ?? get('budgets.maxSpecialists', model) ?? 8;

const byLevel = {};
for (const [id, l] of level) (byLevel[l] ||= []).push(id);
let waves = Object.keys(byLevel).sort((a, b) => a - b).map((l) => byLevel[l].sort());
// Respect de maxSpecialists : scinder une vague trop large en sous-vagues.
waves = waves.flatMap((w) => {
  if (w.length <= maxSpecialists) return [w];
  const out = []; for (let i = 0; i < w.length; i += maxSpecialists) out.push(w.slice(i, i + maxSpecialists));
  return out;
});

const schedule = {
  apiVersion: '1.0.0',
  waves,
  maxSpecialists,
  timeoutMsPerTask: get('execution.timeoutMsPerTask', model) ?? 120000,
  retry: get('execution.retry', model) ?? { max: 1, backoff: 'exponential' }
};
console.log(JSON.stringify(schedule, null, 2));
