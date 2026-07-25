#!/usr/bin/env node
// detect-tech — Technology Detector (ADR-038). Applique les signatures déclaratives à
// l'inventaire. Déterministe. Usage: node tools/intel/detect-tech.mjs <inventory.json>
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, basename } from 'node:path';
import { parseYaml } from '../lib/yaml.mjs';
import { readJson } from '../lib/fsutil.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));

export function detect(inventory, opts = {}) {
  const sigDir = join(FRAMEWORK, 'signatures');
  const threshold = opts.confidenceThreshold ?? 0.5;
  const bases = new Set(inventory.files.map((f) => basename(f.path)));
  const exts = new Set(inventory.files.map((f) => f.ext));
  const paths = inventory.files.map((f) => f.path);

  // Dépendances (depsAny) depuis les package.json de l'inventaire.
  const deps = new Set();
  for (const m of inventory.manifests.filter((p) => p.endsWith('package.json'))) {
    try {
      const pkg = readJson(join(inventory.root, m));
      for (const k of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) deps.add(k);
    } catch {}
  }

  const detections = [];
  for (const f of readdirSync(sigDir).filter((x) => /\.ya?ml$/.test(x))) {
    const doc = parseYaml(readFileSync(join(sigDir, f), 'utf8'));
    for (const sig of doc.signatures || []) {
      const m = sig.match || {}; const evidence = [];
      for (const e of m.extensions || []) if (exts.has(e)) evidence.push(`ext ${e}`);
      for (const fn of m.files || []) if (bases.has(fn)) evidence.push(`file ${fn}`);
      for (const pc of m.pathContains || []) { const hit = paths.find((p) => p.includes(pc)); if (hit) evidence.push(`path ${pc}`); }
      for (const d of m.depsAny || []) if (deps.has(d)) evidence.push(`dep ${d}`);
      if (evidence.length && sig.confidence >= threshold)
        detections.push({ id: sig.id, category: doc.category, confidence: sig.confidence, provides: sig.provides || [], style: sig.style, evidence: evidence.slice(0, 3) });
    }
  }
  return { apiVersion: '1.0.0', generatedAt: new Date().toISOString(), detections };
}

if (process.argv[1]?.endsWith('detect-tech.mjs')) {
  const inv = readJson(join(process.cwd(), process.argv[2]));
  let threshold = 0.5;
  try { threshold = parseYaml(readFileSync(join(FRAMEWORK, 'policies/intelligence.yaml'), 'utf8')).confidenceThreshold ?? 0.5; } catch {}
  console.log(JSON.stringify(detect(inv, { confidenceThreshold: threshold }), null, 2));
}
