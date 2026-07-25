#!/usr/bin/env node
// gen-docs — génère docs/generated/ (inventaires + graphes) depuis le registry et les workflows.
// Usage: node tools/gen-docs.mjs
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { findByRegex, readJson, toPosix } from './lib/fsutil.mjs';
import { parseYaml } from './lib/yaml.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(ROOT, 'docs', 'generated');
mkdirSync(outDir, { recursive: true });
const BANNER = '<!-- GÉNÉRÉ PAR tools/gen-docs.mjs — NE PAS ÉDITER À LA MAIN -->\n\n';

const reg = existsSync(join(ROOT, 'skills/registry.json')) ? readJson(join(ROOT, 'skills/registry.json')) : { skills: [], capabilityIndex: {} };

// Inventaire des skills
let inv = BANNER + '# Inventaire des skills\n\n| id | version | catégorie | maturité | capacités | commandes |\n|----|---------|-----------|----------|-----------|-----------|\n';
for (const s of reg.skills) inv += `| \`${s.id}\` | ${s.version} | ${s.category} | ${s.maturityLevel} | ${s.capabilities.join(', ')} | ${(s.compatibleCommands||[]).join(', ')} |\n`;
writeFileSync(join(outDir, 'skills-inventory.md'), inv);

// Graphe des capacités
let cap = BANNER + '# Graphe des capacités\n\n```mermaid\nflowchart LR\n';
for (const [c, ids] of Object.entries(reg.capabilityIndex)) {
  const cid = 'c_' + c.replace(/[^a-z0-9]/gi, '_');
  cap += `  ${cid}(["${c}"])\n`;
  for (const id of ids) { const sid = 's_' + id.replace(/[^a-z0-9]/gi, '_'); cap += `  ${cid} --> ${sid}["${id}"]\n`; }
}
cap += '```\n';
writeFileSync(join(outDir, 'capability-graph.md'), cap);

// Graphe des dépendances (skill -> capacité requise -> skill fournisseur)
let dep = BANNER + '# Graphe des dépendances (par capacité)\n\n```mermaid\nflowchart TD\n';
for (const s of reg.skills) {
  const sid = 's_' + s.id.replace(/[^a-z0-9]/gi, '_');
  dep += `  ${sid}["${s.id}"]\n`;
}
dep += '```\n\n> Les dépendances fines figurent dans chaque skill.json (`dependencies[].capability`).\n';
writeFileSync(join(outDir, 'dependency-graph.md'), dep);

// Inventaire des workflows
let wfInv = BANNER + '# Inventaire des workflows\n\n| id | version | étapes | capacités utilisées |\n|----|---------|--------|--------------------|\n';
for (const wp of findByRegex(join(ROOT, 'workflows'), /\.ya?ml$/)) {
  const wf = parseYaml(readFileSync(wp, 'utf8'));
  const caps = [...new Set((wf.steps || []).flatMap((s) => s.uses || []))];
  wfInv += `| \`${wf.id}\` | ${wf.version} | ${(wf.steps||[]).length} | ${caps.join(', ')} |\n`;
}
writeFileSync(join(outDir, 'workflows-inventory.md'), wfInv);

// Index
writeFileSync(join(outDir, 'README.md'), BANNER + '# docs/generated\n\nInventaires et graphes régénérés par `tools/gen-docs.mjs` (ou `/sync`).\n\n- [skills-inventory.md](skills-inventory.md)\n- [capability-graph.md](capability-graph.md)\n- [dependency-graph.md](dependency-graph.md)\n- [workflows-inventory.md](workflows-inventory.md)\n');

console.log(`docs/generated générés (${reg.skills.length} skills, ${Object.keys(reg.capabilityIndex).length} capacités).`);
