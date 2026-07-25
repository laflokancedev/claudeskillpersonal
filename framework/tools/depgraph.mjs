#!/usr/bin/env node
// depgraph — Dependency Graph (ADR-032). Graphe global (skills, capacités, workflows,
// policies, schemas, agents) → docs/generated/dependency-graph.{md,json}. Détecte capacités
// requises non fournies.
import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readJson, findByRegex, toPosix } from './lib/fsutil.mjs';
import { relative } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const reg = readJson(join(ROOT, 'skills/registry.json'));
const provided = new Set(Object.keys(reg.capabilityIndex));

const nodes = { skills: [], capabilities: [...provided], workflows: [], policies: [], schemas: [], agents: [] };
const edges = [];
const missing = [];

for (const s of reg.skills) {
  nodes.skills.push(s.id);
  for (const c of s.capabilities) edges.push({ from: s.id, to: c, kind: 'provides' });
  const m = readJson(join(ROOT, s.path, 'skill.json'));
  for (const d of m.dependencies || []) {
    edges.push({ from: s.id, to: d.capability, kind: 'needs' });
    if (!provided.has(d.capability)) missing.push(`${s.id} → ${d.capability} (non fourni)`);
  }
}
const listdir = (d, re) => existsSync(join(ROOT, d)) ? readdirSync(join(ROOT, d)).filter((f) => re.test(f)) : [];
nodes.policies = listdir('policies', /\.ya?ml$/);
nodes.agents = listdir('agents', /\.md$/);
nodes.schemas = findByRegex(join(ROOT, 'schemas'), /\.json$/).map((p) => toPosix(relative(ROOT, p)));
nodes.workflows = listdir('workflows', /\.ya?ml$/);

// Mermaid (skills → capacités)
let md = '<!-- GÉNÉRÉ PAR tools/depgraph.mjs — NE PAS ÉDITER -->\n\n# Graphe de dépendances\n\n';
md += `Skills: ${nodes.skills.length} · Capacités: ${nodes.capabilities.length} · Workflows: ${nodes.workflows.length} · Policies: ${nodes.policies.length} · Schemas: ${nodes.schemas.length} · Agents: ${nodes.agents.length}\n\n`;
md += '```mermaid\nflowchart LR\n';
for (const e of edges) {
  const f = 's_' + e.from.replace(/[^a-z0-9]/gi, '_');
  const t = 'c_' + e.to.replace(/[^a-z0-9]/gi, '_');
  md += `  ${f}["${e.from}"] ${e.kind === 'needs' ? '-. needs .->' : '-->'} ${t}(["${e.to}"])\n`;
}
md += '```\n';
if (missing.length) md += '\n## ⚠️ Capacités requises non fournies\n' + missing.map((m) => `- ${m}`).join('\n') + '\n';

const outDir = join(ROOT, 'docs', 'generated'); mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'dependency-graph.md'), md);
writeFileSync(join(outDir, 'dependency-graph.json'), JSON.stringify({ nodes, edges, missing }, null, 2) + '\n');
console.log(`depgraph: ${nodes.skills.length} skills, ${edges.length} arêtes, ${missing.length} manque(s).`);
if (missing.length) process.exitCode = 0; // informational
