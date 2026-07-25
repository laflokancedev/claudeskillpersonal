#!/usr/bin/env node
// model-router — Model Router (ADR-024). Choisit le modèle depuis policies/models.yaml
// selon les signaux de tâche. Décision déterministe ; aucun modèle codé dans un agent.
// Usage: node tools/model-router.mjs --taskId t --complexity low|medium|high --minQuality 90 --budget 20000
import { loadPolicies } from './policy.mjs';

function args() {
  const a = {}; const p = process.argv.slice(2);
  for (let i = 0; i < p.length; i++) if (p[i].startsWith('--')) a[p[i].slice(2)] = p[i + 1];
  return a;
}
function matchWhen(when, s) {
  for (const k of Object.keys(when || {})) {
    if (k === 'minQuality') { if (s.minQuality == null || Number(s.minQuality) < Number(when.minQuality)) return false; }
    else if (s[k] !== when[k]) return false;
  }
  return true;
}

export function route(signals, models) {
  for (const rule of models.routing || []) if (matchWhen(rule.when, signals)) return rule.use;
  return models.default;
}

const a = args();
const models = loadPolicies().models || {};
const use = route({ complexity: a.complexity, minQuality: a.minQuality, budget: a.budget }, models) || {};
const decision = {
  apiVersion: '1.0.0', taskId: a.taskId || null,
  model: use.model, temperature: use.temperature ?? 0.3, reasoning: use.reasoning ?? 'medium',
  maxTokens: use.maxTokens ?? 6000,
  rationale: `signals(complexity=${a.complexity}, minQuality=${a.minQuality}, budget=${a.budget})`
};
console.log(JSON.stringify(decision, null, 2));
