#!/usr/bin/env node
// build-registry — scanne skills/**/skill.json et génère skills/registry.json (index + capabilityIndex).
// Usage: node tools/build-registry.mjs [--check]
//   --check : ne récrit pas ; sort 1 si le registry est absent ou périmé (hash différent).
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { findFiles, readJson, sha256, toPosix } from './lib/fsutil.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const skillsDir = join(ROOT, 'skills');
const registryPath = join(skillsDir, 'registry.json');
const check = process.argv.includes('--check');

const config = readJson(join(ROOT, 'framework.config.json'));

// Phase 5 : les extensions (extensions/**/skill.json) sont aussi découvertes — le cœur
// ne les connaît pas en dur, il scanne une convention. Ajouter un skill via extension
// ne modifie aucun skill du cœur.
const extDir = join(ROOT, 'extensions');
const manifestPaths = [
  ...findFiles(skillsDir, 'skill.json'),
  ...(existsSync(extDir) ? findFiles(extDir, 'skill.json') : [])
].sort();
const skills = [];
const capabilityIndex = {};
const hashParts = [];

for (const mp of manifestPaths) {
  const raw = readFileSync(mp, 'utf8');
  hashParts.push(toPosix(relative(ROOT, mp)) + '::' + raw);
  const m = JSON.parse(raw);
  const path = toPosix(relative(ROOT, dirname(mp)));
  skills.push({
    id: m.id,
    version: m.version,
    category: m.category,
    path,
    entry: m.entry,
    capabilities: m.capabilities,
    priority: m.priority ?? 50,
    maturityLevel: m.maturityLevel ?? 'beta',
    estimatedCost: m.estimatedCost?.typical ?? null,
    recommendedModels: m.recommendedModels ?? [],
    compatibleCommands: m.compatibleCommands ?? [],
    knowledge: m.knowledge ?? []
  });
  for (const cap of m.capabilities) {
    (capabilityIndex[cap] ||= []).push(m.id);
  }
}
for (const cap of Object.keys(capabilityIndex)) capabilityIndex[cap].sort();

const sourceHash = sha256(hashParts.sort().join('\n'));

const registry = {
  schemaVersion: config.framework.registrySchemaVersion ?? '1.0.0',
  framework: config.framework.version,
  generatedAt: new Date().toISOString(),
  sourceHash,
  skills: skills.sort((a, b) => a.id.localeCompare(b.id)),
  capabilityIndex
};

if (check) {
  if (!existsSync(registryPath)) { console.error('STALE: registry.json manquant'); process.exit(1); }
  const prev = readJson(registryPath);
  if (prev.sourceHash !== sourceHash) { console.error('STALE: sourceHash différent — lancer /sync'); process.exit(1); }
  console.log(`OK: registry à jour (${skills.length} skills)`);
  process.exit(0);
}

writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`registry.json généré: ${skills.length} skills, ${Object.keys(capabilityIndex).length} capacités`);
