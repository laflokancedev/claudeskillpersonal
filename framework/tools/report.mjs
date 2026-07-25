#!/usr/bin/env node
// report — agrège les traces d'un run (reports/traces/<runId>/*.json) en reports/<runId>.md.
// Usage: node tools/report.mjs [runId]   (sans runId : agrège tous les runs présents)
import { writeFileSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const tracesRoot = join(ROOT, 'reports', 'traces');
const arg = process.argv[2];

if (!existsSync(tracesRoot)) { console.log('Aucune trace (reports/traces/ absent).'); process.exit(0); }
const runIds = arg ? [arg] : readdirSync(tracesRoot).filter((d) => statSync(join(tracesRoot, d)).isDirectory());
if (runIds.length === 0) { console.log('Aucun run à agréger.'); process.exit(0); }

for (const runId of runIds) {
  const dir = join(tracesRoot, runId);
  if (!existsSync(dir)) { console.error(`runId ${runId} introuvable`); continue; }
  const traces = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const sum = (k) => traces.reduce((a, t) => a + (t[k] || 0), 0);
  const ok = traces.filter((t) => t.status === 'ok').length;
  let md = `# Rapport d'exécution — ${runId}\n\n`;
  md += `- Étapes: ${traces.length} (ok: ${ok}, warning: ${traces.filter(t=>t.status==='warning').length}, error: ${traces.filter(t=>t.status==='error').length})\n`;
  md += `- Durée totale: ${sum('durationMs')} ms\n- Tokens in/out: ${sum('tokensIn')} / ${sum('tokensOut')}\n- Coût estimé: $${sum('estCostUsd').toFixed(4)}\n\n`;
  md += `| step | skill | modèle | ms | tok in | tok out | $ | statut |\n|------|-------|--------|----|--------|---------|---|--------|\n`;
  for (const t of traces) md += `| ${t.stepId} | ${t.skillId||''} | ${t.model||''} | ${t.durationMs||0} | ${t.tokensIn||0} | ${t.tokensOut||0} | ${(t.estCostUsd||0).toFixed(4)} | ${t.status} |\n`;
  writeFileSync(join(ROOT, 'reports', `${runId}.md`), md);
  console.log(`reports/${runId}.md écrit (${traces.length} étapes).`);
}
