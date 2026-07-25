#!/usr/bin/env node
// techdebt — Technical Debt Engine (ADR-072). Détection déterministe. LECTURE-SEULE.
// Détecte : skills inutilisés (capacités jamais requises par un workflow/mapping),
// fichiers dupliqués (même hash). Usage: node tools/meta/techdebt.mjs
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { findByRegex, readJson, sha256, toPosix } from '../lib/fsutil.mjs';
import { parseYaml } from '../lib/yaml.mjs';
import { relative } from 'node:path';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));

export function techDebt() {
  const items = [];
  const reg = readJson(join(FRAMEWORK, 'skills/registry.json'));

  // Capacités réellement utilisées : workflows.uses ∪ capability-mapping values.
  const used = new Set();
  for (const wf of findByRegex(join(FRAMEWORK, 'workflows'), /\.ya?ml$/)) {
    const doc = parseYaml(readFileSync(wf, 'utf8'));
    for (const s of doc.steps || []) for (const c of s.uses || []) used.add(c);
  }
  const mapPath = join(FRAMEWORK, 'policies/capability-mapping.yaml');
  if (existsSync(mapPath)) { const m = parseYaml(readFileSync(mapPath, 'utf8')); for (const arr of Object.values(m.map || {})) for (const c of arr) used.add(c); }

  for (const s of reg.skills) {
    if (!s.capabilities.some((c) => used.has(c)))
      items.push({ type: 'unused-skill', target: s.id, severity: 'low', evidence: [`capacités [${s.capabilities.join(',')}] jamais requises par un workflow/mapping`] });
  }

  // Fichiers dupliqués (même hash de contenu) parmi tools + sdk + skills.
  const byHash = {};
  for (const dir of ['tools', 'sdk', 'skills']) {
    if (!existsSync(join(FRAMEWORK, dir))) continue;
    for (const f of findByRegex(join(FRAMEWORK, dir), /\.(mjs|md)$/)) {
      const h = sha256(readFileSync(f)); (byHash[h] ||= []).push(toPosix(relative(FRAMEWORK, f)));
    }
  }
  for (const [, paths] of Object.entries(byHash)) if (paths.length > 1)
    items.push({ type: 'duplicate-file', target: paths[0], severity: 'medium', evidence: ['identique à: ' + paths.slice(1).join(', ')] });

  return { metaApiVersion: '1.0.0', generatedAt: new Date().toISOString(), items };
}

if (process.argv[1]?.endsWith('techdebt.mjs')) console.log(JSON.stringify(techDebt(), null, 2));
