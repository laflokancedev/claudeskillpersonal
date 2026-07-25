#!/usr/bin/env node
// plan-capabilities — Capability Planner (ADR-041). Profil → capacités nécessaires
// (mapping déclaratif), dédupliquées et filtrées aux capacités présentes au registre.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parseYaml } from '../lib/yaml.mjs';
import { readJson } from '../lib/fsutil.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));

export function planCapabilities(profile) {
  const mapping = parseYaml(readFileSync(join(FRAMEWORK, 'policies/capability-mapping.yaml'), 'utf8'));
  const reg = readJson(join(FRAMEWORK, 'skills/registry.json'));
  const known = new Set(Object.keys(reg.capabilityIndex));
  const caps = new Set(); const rationale = [];
  const signals = profile.providesAll || [];
  for (const sig of signals) {
    const mapped = mapping.map?.[sig];
    if (mapped) { for (const c of mapped) if (known.has(c)) { caps.add(c); rationale.push(`${sig} → ${c}`); } }
  }
  if (caps.size === 0) for (const c of mapping.default || []) if (known.has(c)) caps.add(c);
  return { apiVersion: '1.0.0', capabilities: [...caps].sort(), rationale };
}

if (process.argv[1]?.endsWith('plan-capabilities.mjs')) {
  const profile = readJson(join(process.cwd(), process.argv[2]));
  console.log(JSON.stringify(planCapabilities(profile), null, 2));
}
