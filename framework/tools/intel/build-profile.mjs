#!/usr/bin/env node
// build-profile — assemble le ProjectProfile (ADR-040) à partir de Inventory + TechReport + Graph.
// Déterministe. Usage: node tools/intel/build-profile.mjs <inventory.json>
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readJson } from '../lib/fsutil.mjs';
import { detect } from './detect-tech.mjs';
import { buildGraph } from './build-graph.mjs';

const LANG = { '.mjs': 'JavaScript', '.js': 'JavaScript', '.ts': 'TypeScript', '.tsx': 'TypeScript', '.jsx': 'JavaScript', '.py': 'Python', '.go': 'Go', '.rs': 'Rust', '.java': 'Java', '.md': 'Markdown', '.json': 'JSON', '.yaml': 'YAML', '.yml': 'YAML', '.css': 'CSS', '.html': 'HTML' };

export function buildProfile(inventory, techReport, graph) {
  const langCount = {};
  for (const f of inventory.files) { const l = LANG[f.ext]; if (l) langCount[l] = (langCount[l] || 0) + 1; }
  const totLang = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langCount).sort((a, b) => b[1] - a[1]).map(([name, c]) => ({ name, pct: Math.round(c / totLang * 100) }));

  const det = techReport.detections;
  const byCat = {}; for (const d of det) (byCat[d.category] ||= []).push(d.id);
  const archDet = det.filter((d) => d.category === 'architecture').sort((a, b) => b.confidence - a.confidence);
  const providesAll = [...new Set(det.flatMap((d) => d.provides || []))];

  const risks = [];
  if (!(byCat.backend || byCat.frontend)) risks.push('no-app-framework-detected');
  if (!byCat.cicd) risks.push('no-ci-detected');
  if (!det.find((d) => (d.provides || []).includes('tests'))) risks.push('no-tests-detected');

  const modules = [...new Set(inventory.files.map((f) => f.path.split('/')[0]))].filter((x) => x && !x.includes('.'));

  return {
    apiVersion: '1.0.0', profileVersion: '1.0.0', contentHash: inventory.contentHash, generatedAt: new Date().toISOString(),
    languages,
    frameworks: [...new Set(det.filter((d) => d.category !== 'architecture').map((d) => d.id))],
    stack: byCat,
    architecture: archDet.length ? { primary: archDet[0].style || archDet[0].id, confidence: archDet[0].confidence, candidates: archDet.map((a) => a.style || a.id) } : { primary: 'unknown', confidence: 0 },
    patterns: [], providesAll,
    services: byCat.backend || [],
    modules,
    tests: { framework: (det.find((d) => (d.provides || []).includes('tests')) || {}).id || null, coverage: null },
    ci: providesAll.includes('ci') ? ['ci'] : [],
    cd: providesAll.includes('cd') || providesAll.includes('docker') ? ['cd'] : [],
    risks, techDebt: [],
    documentation: { hasDocs: providesAll.includes('documentation') },
    size: { files: inventory.totalFiles, bytes: inventory.totalBytes },
    complexity: { score: Math.min(100, Math.round(inventory.totalFiles / 3)) }
  };
}

if (process.argv[1]?.endsWith('build-profile.mjs')) {
  const inv = readJson(join(process.cwd(), process.argv[2]));
  const profile = buildProfile(inv, detect(inv), buildGraph(inv));
  console.log(JSON.stringify(profile, null, 2));
}
