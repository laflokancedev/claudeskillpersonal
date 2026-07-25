#!/usr/bin/env node
// resolve-workflow — Workflow Resolver (ADR-042). Choisit le workflow via règles déclaratives.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parseYaml } from '../lib/yaml.mjs';
import { readJson } from '../lib/fsutil.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));

export function resolveWorkflow(profile, intent = {}) {
  const pol = parseYaml(readFileSync(join(FRAMEWORK, 'policies/workflow-selection.yaml'), 'utf8'));
  for (const rule of pol.rules || []) {
    const w = rule.when || {};
    let ok = true;
    if (w.framework && !(profile.frameworks || []).includes(w.framework)) ok = false;
    if (w.minFiles && !((profile.size?.files || 0) >= w.minFiles)) ok = false;
    if (ok) return { apiVersion: '1.0.0', workflowId: rule.workflow, score: rule.score ?? 0.5, justification: `règle '${rule.id}' satisfaite (${JSON.stringify(w)})` };
  }
  return { apiVersion: '1.0.0', workflowId: pol.default, score: 0.3, justification: 'aucune règle satisfaite → workflow par défaut' };
}

if (process.argv[1]?.endsWith('resolve-workflow.mjs')) {
  const profile = readJson(join(process.cwd(), process.argv[2]));
  console.log(JSON.stringify(resolveWorkflow(profile), null, 2));
}
