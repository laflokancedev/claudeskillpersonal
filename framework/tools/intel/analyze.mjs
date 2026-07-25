#!/usr/bin/env node
// analyze — Project Analyzer coordinateur (ADR-036). Enchaîne scan → detect → graph → profile,
// consulte la Project Memory (réutilise si inchangé) et le Change Detector, puis résout
// workflow + capacités. Déterministe (aucune IA). Usage: node tools/intel/analyze.mjs [root]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parseYaml } from '../lib/yaml.mjs';
import { scanRepo } from './scan.mjs';
import { detect } from './detect-tech.mjs';
import { buildGraph } from './build-graph.mjs';
import { buildProfile } from './build-profile.mjs';
import { planCapabilities } from './plan-capabilities.mjs';
import { resolveWorkflow } from './resolve-workflow.mjs';
import { changeSet } from './change-detector.mjs';
import { repoKey, memHas, memGetProfile, memGetInventory, memPut } from './project-memory.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));
const root = process.argv[2] ? join(process.cwd(), process.argv[2]) : FRAMEWORK;
const policy = parseYaml(readFileSync(join(FRAMEWORK, 'policies/intelligence.yaml'), 'utf8'));

const inventory = scanRepo(root, { scan: policy.scan });
const key = repoKey(root);

let profile, reused = false, change = null;
if (policy.memory?.reuseIfUnchanged && memHas(key, inventory.contentHash)) {
  profile = memGetProfile(key); reused = true;
} else {
  const prev = memGetInventory(key);
  if (prev) change = changeSet(prev, inventory);
  const techReport = detect(inventory, { confidenceThreshold: policy.confidenceThreshold ?? 0.5 });
  profile = buildProfile(inventory, techReport, buildGraph(inventory));
  memPut(key, profile, inventory);
}

const selection = resolveWorkflow(profile);
const capPlan = planCapabilities(profile);

const summary = {
  apiVersion: '1.0.0', repoKey: key, contentHash: inventory.contentHash, reused,
  change: change ? { added: change.added.length, removed: change.removed.length, modified: change.modified.length } : null,
  languages: profile.languages.slice(0, 4),
  frameworks: profile.frameworks, architecture: profile.architecture,
  size: profile.size, risks: profile.risks,
  workflow: selection, capabilities: capPlan.capabilities
};
console.log(JSON.stringify(summary, null, 2));
