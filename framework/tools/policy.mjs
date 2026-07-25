#!/usr/bin/env node
// policy — Policy Engine (ADR-020). Charge policies/*.yaml + features/flags.yaml et résout
// une clé avec précédence : defaults(config) < policies < (overrides amont non gérés en CLI).
// Usage: node tools/policy.mjs get <namespace.clé>   ·  node tools/policy.mjs dump
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, basename } from 'node:path';
import { parseYaml } from './lib/yaml.mjs';
import { readJson } from './lib/fsutil.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

export function loadPolicies() {
  const pol = {};
  const dir = join(ROOT, 'policies');
  if (existsSync(dir)) for (const f of readdirSync(dir)) {
    if (/\.ya?ml$/.test(f)) pol[basename(f).replace(/\.ya?ml$/, '')] = parseYaml(readFileSync(join(dir, f), 'utf8'));
  }
  const features = existsSync(join(ROOT, 'features/flags.yaml'))
    ? parseYaml(readFileSync(join(ROOT, 'features/flags.yaml'), 'utf8')) : {};
  const config = existsSync(join(ROOT, 'framework.config.json')) ? readJson(join(ROOT, 'framework.config.json')) : {};
  return { ...pol, features, config };
}

export function get(dotted, model = loadPolicies()) {
  let cur = model;
  for (const k of dotted.split('.')) { if (cur == null) return undefined; cur = cur[k]; }
  // Fallback config si non trouvé dans policies (rétrocompat shim).
  if (cur === undefined) {
    let c = model.config;
    for (const k of dotted.split('.')) { if (c == null) { c = undefined; break; } c = c[k]; }
    return c;
  }
  return cur;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('policy.mjs')) {
  const [cmd, key] = process.argv.slice(2);
  const model = loadPolicies();
  if (cmd === 'dump') console.log(JSON.stringify(model, null, 2));
  else if (cmd === 'get' && key) { const v = get(key, model); console.log(typeof v === 'object' ? JSON.stringify(v) : String(v)); }
  else { console.error('Usage: policy.mjs get <namespace.key> | dump'); process.exit(1); }
}
