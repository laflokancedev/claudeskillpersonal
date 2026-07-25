#!/usr/bin/env node
// self-evolution-report — rapport unique (ADR-080). Agrège introspection + dette + métriques
// + compatibilité et dérive des PROPOSITIONS (jamais d'action). LECTURE-SEULE : écrit
// uniquement dans artifacts/meta/ et proposals/.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { introspect } from './introspect.mjs';
import { techDebt } from './techdebt.mjs';
import { metrics } from './metrics.mjs';
import { checkCompat } from './compat.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));

export function buildReport() {
  const model = introspect();
  const debt = techDebt();
  const met = metrics();
  const compat = checkCompat();
  // Propositions dérivées de la dette (déterministe, statut PROPOSED, décision humaine).
  const proposals = debt.items.map((d, i) => ({
    id: `evo-${String(i + 1).padStart(3, '0')}`,
    title: d.type === 'unused-skill' ? `Retirer/justifier le skill inutilisé ${d.target}` : `Résoudre ${d.type}: ${d.target}`,
    fromDebt: d.type, target: d.target, status: 'PROPOSED', judgment: false, evidence: d.evidence
  }));
  return {
    metaApiVersion: '1.0.0', generatedAt: new Date().toISOString(),
    architecture: { counts: model.counts },
    techDebt: { count: debt.items.length, items: debt.items },
    metrics: met.metrics,
    compatibility: compat,
    proposals
  };
}

if (process.argv[1]?.endsWith('self-evolution-report.mjs')) {
  const report = buildReport();
  mkdirSync(join(FRAMEWORK, 'artifacts', 'meta'), { recursive: true });
  writeFileSync(join(FRAMEWORK, 'artifacts', 'meta', 'self-evolution-report.json'), JSON.stringify(report, null, 2) + '\n');

  const stamp = report.generatedAt.slice(0, 10);
  mkdirSync(join(FRAMEWORK, 'proposals', 'self-evolution'), { recursive: true });
  let md = `# Self Evolution Report — ${stamp}\n\n> Statut : PROPOSED. Read-only. Décision humaine (Gouvernance).\n\n`;
  md += `## Architecture\n${Object.entries(report.architecture.counts).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\n`;
  md += `## Compatibilité\n- compatible: **${report.compatibility.compatible}** (${JSON.stringify(report.compatibility.checks)})\n- breaks: ${report.compatibility.breaks.join(', ') || 'aucun'}\n\n`;
  md += `## Dette technique (${report.techDebt.count})\n${report.techDebt.items.map((d) => `- [${d.severity}] ${d.type}: \`${d.target}\` — ${d.evidence.join('; ')}`).join('\n') || '- aucune'}\n\n`;
  md += `## Propositions (${report.proposals.length}) — PROPOSED, à arbitrer\n${report.proposals.map((p) => `- ${p.id} · ${p.title} (preuve: ${p.evidence.join('; ')})`).join('\n') || '- aucune'}\n`;
  writeFileSync(join(FRAMEWORK, 'proposals', 'self-evolution', `${stamp}.md`), md);

  console.log(`self-evolution-report écrit (artifacts/meta + proposals/). Dette: ${report.techDebt.count}, propositions: ${report.proposals.length}, compatible: ${report.compatibility.compatible}`);
}
