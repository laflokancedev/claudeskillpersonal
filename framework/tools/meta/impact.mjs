#!/usr/bin/env node
// impact — Impact Analyzer (ADR-069). Dépendances inverses via le modèle. LECTURE-SEULE.
// Usage: node tools/meta/impact.mjs <capability | fichier.mjs>
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname, relative } from 'node:path';
import { findByRegex, readJson, toPosix } from '../lib/fsutil.mjs';
import { parseYaml } from '../lib/yaml.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));

export function analyzeImpact(target) {
  const reg = readJson(join(FRAMEWORK, 'skills/registry.json'));
  const impacted = { skills: [], workflows: [], modules: [] };

  if (reg.capabilityIndex[target]) {
    impacted.skills = reg.capabilityIndex[target];
    for (const wf of findByRegex(join(FRAMEWORK, 'workflows'), /\.ya?ml$/)) {
      const doc = parseYaml(readFileSync(wf, 'utf8'));
      if ((doc.steps || []).some((s) => (s.uses || []).includes(target))) impacted.workflows.push(doc.id);
    }
  } else {
    // Fichier : modules qui l'importent.
    for (const f of [...findByRegex(join(FRAMEWORK, 'tools'), /\.mjs$/), ...findByRegex(join(FRAMEWORK, 'sdk'), /\.mjs$/)]) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
        const resolved = toPosix(relative(FRAMEWORK, join(dirname(f), m[1])));
        if (resolved === target.replace(/\.mjs$/, '') || resolved === target) impacted.modules.push(toPosix(relative(FRAMEWORK, f)));
      }
    }
  }
  const total = impacted.skills.length + impacted.workflows.length + impacted.modules.length;
  const risk = total >= 5 ? 'high' : total >= 2 ? 'medium' : 'low';
  return { metaApiVersion: '1.0.0', target, impacted, risk, judgment: false };
}

if (process.argv[1]?.endsWith('impact.mjs')) {
  const t = process.argv[2];
  if (!t) { console.error('Usage: impact.mjs <capability|fichier>'); process.exit(1); }
  console.log(JSON.stringify(analyzeImpact(t), null, 2));
}
