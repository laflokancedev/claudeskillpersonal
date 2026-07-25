#!/usr/bin/env node
// validate — contrôles déterministes : manifestes, registry à jour, workflows (DAG + capacités).
// Usage: node tools/validate.mjs   (exit 1 si erreurs)
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { execSync } from 'node:child_process';
import { findFiles, findByRegex, readJson, toPosix } from './lib/fsutil.mjs';
import { parseYaml } from './lib/yaml.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const SEMVER = /^\d+\.\d+\.\d+$/;
const ID = /^[a-z0-9]+(\.[a-z0-9-]+)+$/;
const CATS = ['engineering', 'design', 'operations', 'quality', 'documentation', 'ai'];

// 1) framework.config.json
let config;
try {
  config = readJson(join(ROOT, 'framework.config.json'));
  if (!config.framework?.version) err('config: framework.version manquant');
} catch (e) { err('config illisible: ' + e.message); }

// 2) Manifestes de skills (cœur + extensions, Phase 5)
const extSkillsDir = join(ROOT, 'extensions');
const manifests = [
  ...findFiles(join(ROOT, 'skills'), 'skill.json'),
  ...(existsSync(extSkillsDir) ? findFiles(extSkillsDir, 'skill.json') : [])
];
const knownCaps = new Set();
for (const mp of manifests) {
  const rel = toPosix(relative(ROOT, mp));
  let m;
  try { m = JSON.parse(readFileSync(mp, 'utf8')); } catch (e) { err(`${rel}: JSON invalide (${e.message})`); continue; }
  for (const f of ['id', 'name', 'version', 'description', 'category', 'capabilities', 'outputs', 'entry', 'compatibility'])
    if (m[f] === undefined) err(`${rel}: champ requis manquant '${f}'`);
  if (m.id && !ID.test(m.id)) err(`${rel}: id '${m.id}' invalide (attendu category.slug)`);
  if (m.version && !SEMVER.test(m.version)) err(`${rel}: version '${m.version}' non semver`);
  if (m.category && !CATS.includes(m.category)) err(`${rel}: category '${m.category}' hors liste`);
  if (Array.isArray(m.capabilities) && m.capabilities.length === 0) err(`${rel}: capabilities vide`);
  (m.capabilities || []).forEach((c) => knownCaps.add(c));
  if (m.entry && !existsSync(join(dirname(mp), m.entry))) err(`${rel}: entry '${m.entry}' introuvable`);
  for (const k of m.knowledge || [])
    if (!existsSync(join(dirname(mp), k.file))) err(`${rel}: knowledge '${k.file}' introuvable`);
}

// 3) Registry à jour
try {
  execSync('node ' + JSON.stringify(join(ROOT, 'tools/build-registry.mjs')) + ' --check', { stdio: 'pipe' });
} catch (e) {
  err('registry périmé ou absent (node tools/build-registry.mjs). ' + (e.stderr?.toString().trim() || ''));
}

// 4) Workflows
for (const wp of findByRegex(join(ROOT, 'workflows'), /\.ya?ml$/)) {
  const rel = toPosix(relative(ROOT, wp));
  let wf;
  try { wf = parseYaml(readFileSync(wp, 'utf8')); } catch (e) { err(`${rel}: YAML illisible (${e.message})`); continue; }
  for (const f of ['id', 'version', 'description', 'steps', 'merge'])
    if (wf[f] === undefined) err(`${rel}: champ requis manquant '${f}'`);
  const steps = wf.steps || [];
  const ids = new Set(steps.map((s) => s.id));
  for (const s of steps) {
    if (!s.id) err(`${rel}: step sans id`);
    if (!Array.isArray(s.uses) || s.uses.length === 0) err(`${rel}: step '${s.id}' sans 'uses'`);
    for (const need of s.needs || []) if (!ids.has(need)) err(`${rel}: step '${s.id}' needs '${need}' inexistant`);
    for (const cap of s.uses || []) if (!knownCaps.has(cap)) warn(`${rel}: capacité '${cap}' (step '${s.id}') absente du registry`);
  }
  // DAG acyclique
  const graph = new Map(steps.map((s) => [s.id, s.needs || []]));
  const state = new Map();
  const dfs = (n) => {
    if (state.get(n) === 1) { err(`${rel}: cycle détecté sur '${n}'`); return; }
    if (state.get(n) === 2) return;
    state.set(n, 1);
    for (const d of graph.get(n) || []) dfs(d);
    state.set(n, 2);
  };
  for (const id of ids) dfs(id);
}

// Rapport
for (const w of warnings) console.warn('⚠️  ' + w);
if (errors.length) { for (const e of errors) console.error('❌ ' + e); console.error(`\n${errors.length} erreur(s).`); process.exit(1); }
console.log(`✅ Validation OK (${manifests.length} skills, ${warnings.length} warning(s)).`);
