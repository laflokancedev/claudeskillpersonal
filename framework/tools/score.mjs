#!/usr/bin/env node
// score — Architecture Score (ADR-035). Scores globaux STRUCTURELS et expliqués (préliminaire :
// les dimensions dépendantes de l'exécution s'affinent avec l'observabilité). Déterministe.
// Sortie : docs/generated/architecture-score.md
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readJson, findByRegex } from './lib/fsutil.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const has = (p) => existsSync(join(ROOT, p));
const countFiles = (d, re) => existsSync(join(ROOT, d)) ? findByRegex(join(ROOT, d), re).length : 0;

const reg = has('skills/registry.json') ? readJson(join(ROOT, 'skills/registry.json')) : { skills: [] };
const topDirs = readdirSync(ROOT).filter((f) => { try { return statSync(join(ROOT, f)).isDirectory() && !f.startsWith('.'); } catch { return false; } });
const dirsWithReadme = topDirs.filter((d) => has(`${d}/README.md`)).length;

const schemas = countFiles('schemas', /\.json$/);
const policies = countFiles('policies', /\.ya?ml$/);
const declarative = ['skills/registry.json', 'policies', 'features/flags.yaml', 'workflows', 'schemas', 'sdk'].filter(has).length;

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
const scores = {
  Architecture: { value: clamp(70 + (policies >= 7 ? 15 : 0) + (schemas >= 10 ? 15 : 0)),
    explanation: 'Séparation déclaratif/tooling/prompt, contrats schématisés, policies externalisées.',
    evidence: [`${policies} policies`, `${schemas} schémas`, `${reg.skills.length} skills indexés`],
    recommendations: policies < 7 ? ['Compléter les policies'] : [] },
  Extensibility: { value: clamp(60 + declarative * 7),
    explanation: 'Ajout par fichiers (OCP) : registry, policies, features, workflows, schemas, SDK.',
    evidence: [`${declarative}/6 piliers déclaratifs présents`],
    recommendations: has('sdk') ? [] : ['Ajouter le Plugin SDK'] },
  Documentation: { value: clamp((dirsWithReadme / Math.max(1, topDirs.length)) * 100),
    explanation: 'Couverture README par dossier + docs générées.',
    evidence: [`${dirsWithReadme}/${topDirs.length} dossiers avec README`], recommendations: [] },
  Maintainability: { value: clamp(65 + (policies >= 7 ? 20 : 0) + (has('tools/contract.mjs') ? 10 : 0)),
    explanation: 'Constantes centralisées (policies), contrats validés, agents sans logique.',
    evidence: ['constantes → policies', 'contract engine présent'], recommendations: [] },
  Complexity: { value: clamp(100 - (reg.skills.length + policies + schemas)),
    explanation: 'Nombre de composants (plus bas = plus simple). Préliminaire.',
    evidence: [`${reg.skills.length} skills + ${policies} policies + ${schemas} schémas`],
    recommendations: ['Surveiller la croissance ; regrouper par catégories'] },
  Risk: { value: clamp(80 - (reg.skills.filter((s) => s.maturityLevel !== 'stable').length * 5)),
    explanation: 'Fondé sur la maturité des skills et la présence de garde-fous (selfcheck, sécurité bloquante).',
    evidence: [`selfcheck: ${has('tools/selfcheck.mjs')}`, `security policy: ${has('policies/security.yaml')}`],
    recommendations: [] },
  Quality: { value: null,
    explanation: 'Nécessite un run (Quality Engine). Renseigné par le dernier QualityReport.',
    evidence: [], recommendations: ['Lancer /run pour produire un QualityReport'] }
};

let md = '<!-- GÉNÉRÉ PAR tools/score.mjs — NE PAS ÉDITER -->\n\n# Architecture Score (préliminaire, structurel)\n\n';
md += '| Score | Valeur | Explication |\n|-------|--------|-------------|\n';
for (const [k, v] of Object.entries(scores)) md += `| ${k} | ${v.value ?? 'N/A'} | ${v.explanation} |\n`;
md += '\n## Détail\n';
for (const [k, v] of Object.entries(scores)) {
  md += `\n### ${k} — ${v.value ?? 'N/A'}\n- ${v.explanation}\n`;
  if (v.evidence.length) md += `- Preuves : ${v.evidence.join(' · ')}\n`;
  if (v.recommendations.length) md += `- Recommandations : ${v.recommendations.join(' · ')}\n`;
}
const outDir = join(ROOT, 'docs', 'generated'); mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'architecture-score.md'), md);
console.log('architecture-score.md généré : ' + Object.entries(scores).map(([k, v]) => `${k}=${v.value ?? 'N/A'}`).join(' '));
