#!/usr/bin/env node
// build-graph — Project Graph (ADR-039). Graphe déterministe manifest+convention.
// Nœuds : modules(.mjs), agents, commands, skills, policies, workflows. Arêtes : imports
// entre modules + skill→capability (registre). Usage: node tools/intel/build-graph.mjs <inventory.json>
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, basename, dirname } from 'node:path';
import { readJson } from '../lib/fsutil.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));

export function buildGraph(inventory) {
  const nodes = [], edges = [];
  const add = (id, type) => { if (!nodes.find((n) => n.id === id)) nodes.push({ id, type }); };
  const typeOfPath = (p) =>
    p.startsWith('tools/') && p.endsWith('.mjs') ? 'module'
    : p.startsWith('agents/') && p.endsWith('.md') ? 'agent'
    : p.startsWith('commands/') && p.endsWith('.md') ? 'command'
    : p.startsWith('policies/') && /\.ya?ml$/.test(p) ? 'policy'
    : p.startsWith('workflows/') && /\.ya?ml$/.test(p) ? 'workflow'
    : p.endsWith('skill.json') ? 'skill-manifest' : null;

  for (const f of inventory.files) { const t = typeOfPath(f.path); if (t) add(f.path, t); }

  // Arêtes d'import entre modules .mjs (déterministe : lecture des imports relatifs).
  for (const f of inventory.files.filter((x) => x.path.startsWith('tools/') && x.path.endsWith('.mjs'))) {
    try {
      const src = readFileSync(join(inventory.root, f.path), 'utf8');
      for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
        const rel = m[1];
        const target = join(dirname(f.path), rel).split('\\').join('/');
        edges.push({ from: f.path, to: target, kind: 'imports' });
      }
    } catch {}
  }

  // Arêtes skill → capacité (via registre).
  const regPath = join(FRAMEWORK, 'skills/registry.json');
  if (existsSync(regPath)) {
    const reg = readJson(regPath);
    for (const s of reg.skills) { add(s.id, 'skill'); for (const c of s.capabilities) { add(c, 'capability'); edges.push({ from: s.id, to: c, kind: 'provides' }); } }
  }

  return { apiVersion: '1.0.0', granularity: 'manifest', nodes, edges };
}

if (process.argv[1]?.endsWith('build-graph.mjs')) {
  const inv = readJson(join(process.cwd(), process.argv[2]));
  const g = buildGraph(inv);
  console.log(JSON.stringify({ apiVersion: g.apiVersion, granularity: g.granularity, nodeCount: g.nodes.length, edgeCount: g.edges.length }, null, 2));
}
