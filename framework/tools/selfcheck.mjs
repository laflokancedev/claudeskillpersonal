#!/usr/bin/env node
// selfcheck — Self Validation preflight (ADR-033). Aucune exécution si incohérence.
// Vérifie : registry (frais), manifestes/workflows (via validate), policies, features,
// schémas présents, capacités. Sort 1 si un contrôle échoue.
// Usage: node tools/selfcheck.mjs
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { parseYaml } from './lib/yaml.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const errors = [];

// 1) Manifestes + registry + workflows (réutilise validate.mjs).
try { execSync('node ' + JSON.stringify(join(ROOT, 'tools/validate.mjs')), { stdio: 'pipe' }); }
catch (e) { errors.push('validate.mjs: ' + (e.stdout?.toString() || e.stderr?.toString() || e.message).trim()); }

// 2) Policies présentes et parsables.
const needPol = ['budgets', 'models', 'execution', 'routing', 'quality', 'security', 'memory'];
for (const p of needPol) {
  const f = join(ROOT, 'policies', `${p}.yaml`);
  if (!existsSync(f)) { errors.push(`policy manquante: ${p}.yaml`); continue; }
  try { parseYaml(readFileSync(f, 'utf8')); } catch (e) { errors.push(`policy illisible ${p}.yaml: ${e.message}`); }
}

// 3) Feature flags parsables.
const ff = join(ROOT, 'features/flags.yaml');
if (!existsSync(ff)) errors.push('features/flags.yaml manquant');
else try { parseYaml(readFileSync(ff, 'utf8')); } catch (e) { errors.push('flags illisibles: ' + e.message); }

// 4) Schémas de contrats v1 présents (API gelée).
for (const s of ['plan', 'task-input', 'deliverable', 'validation-report', 'final-document']) {
  if (!existsSync(join(ROOT, 'schemas', 'api', `${s}.schema.json`))) errors.push(`schéma v1 manquant: api/${s}`);
}

// 5) Couche Project Intelligence (Phase 4) : signatures non vides + schémas intel présents.
if (existsSync(join(ROOT, 'signatures'))) {
  const sigs = readdirSync(join(ROOT, 'signatures')).filter((f) => /\.ya?ml$/.test(f));
  if (sigs.length === 0) errors.push('signatures/ présent mais vide');
  for (const f of sigs) { try { parseYaml(readFileSync(join(ROOT, 'signatures', f), 'utf8')); } catch (e) { errors.push(`signature illisible ${f}: ${e.message}`); } }
  for (const s of ['repository-inventory', 'technology-report', 'project-profile']) {
    if (!existsSync(join(ROOT, 'schemas', 'intel', `${s}.schema.json`))) errors.push(`schéma intel manquant: ${s}`);
  }
}

// 6) Couche méta (Phase 6, read-only) : schémas méta présents si tools/meta existe.
if (existsSync(join(ROOT, 'tools', 'meta'))) {
  for (const s of ['framework-model', 'tech-debt-report', 'compatibility-report', 'self-evolution-report']) {
    if (!existsSync(join(ROOT, 'schemas', 'meta', `${s}.schema.json`))) errors.push(`schéma méta manquant: ${s}`);
  }
}

if (errors.length) { console.error('❌ PREFLIGHT ÉCHOUÉ — exécution refusée :'); errors.forEach((e) => console.error('  - ' + e)); process.exit(1); }
console.log('✅ PREFLIGHT OK — cohérence vérifiée, exécution autorisée.');
