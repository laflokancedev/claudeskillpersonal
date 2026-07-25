#!/usr/bin/env node
// scaffold — génère un nouvel artefact conforme aux conventions, puis reconstruit le registry.
// Usage:
//   node tools/scaffold.mjs skill <category>/<slug>
//   node tools/scaffold.mjs workflow <id>
//   node tools/scaffold.mjs agent <slug>
//   node tools/scaffold.mjs command <slug>
//   node tools/scaffold.mjs template <slug>
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const [type, name] = process.argv.slice(2);
const CATS = ['engineering', 'design', 'operations', 'quality', 'documentation', 'ai'];

if (!type || !name) { console.error('Usage: scaffold <skill|workflow|agent|command|template> <name>'); process.exit(1); }

function write(path, content) {
  if (existsSync(path)) { console.error(`Existe déjà: ${path}`); process.exit(1); }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log('  + ' + path.replace(ROOT, ''));
}

if (type === 'skill') {
  const [category, slug] = name.split('/');
  if (!CATS.includes(category) || !slug) { console.error(`skill name attendu: <category>/<slug> (category ∈ ${CATS.join('|')})`); process.exit(1); }
  const id = `${category}.${slug}`;
  const dir = join(ROOT, 'skills', category, slug);
  write(join(dir, 'skill.json'), JSON.stringify({
    $schema: '../../../schemas/skill.schema.json',
    id, name: slug, version: '0.1.0',
    owner: { name: 'TODO', email: 'todo@example.com' },
    description: `TODO: expert ${slug}. Décrire le domaine, les déclencheurs, les livrables.`,
    category, tags: [], capabilities: [slug],
    dependencies: [], priority: 50,
    estimatedCost: { unit: 'tokens', typical: 6000 },
    qualityLevel: 'draft', maturityLevel: 'experimental',
    recommendedModels: ['claude-sonnet-5'],
    inputs: ['brief', 'files', 'prior'],
    outputs: { outputFormat: 'markdown', sections: ['TODO', 'Hand-off'] },
    compatibleCommands: [slug, 'orchestrate'],
    compatibility: { framework: '>=2.0.0 <3.0.0' },
    knowledge: [{ file: 'knowledge/overview.md', capabilities: [slug], tokensApprox: 400 }],
    examples: [], documentation: 'README.md', entry: 'SKILL.md'
  }, null, 2) + '\n');
  write(join(dir, 'SKILL.md'), `---\nname: ${id}\ndescription: >-\n  TODO expert ${slug}. Produit … . À utiliser pour … . Ne fait pas … .\n---\n\n# SKILL : ${slug}\n\n## OBJECTIF\nTODO\n\n## RESPONSABILITÉS\n- TODO\n\n## INTERDITS\n- TODO (renvoyer vers le skill responsable)\n\n## FORMAT DE SORTIE\n1. \`## …\`\n8. \`## Hand-off\`\n\n## CHECKLIST\n- [ ] TODO\n\n## CRITÈRES DE QUALITÉ\nTODO\n\n## EXEMPLES\n> TODO\n\n## BONNES PRATIQUES\nTODO\n`);
  write(join(dir, 'knowledge', 'overview.md'), `# ${slug} — knowledge: overview\n\nTODO: notes de référence chargées à la demande.\n`);
  write(join(dir, 'examples', '.gitkeep'), '');
  write(join(dir, 'tests', '.gitkeep'), '');
  write(join(dir, 'README.md'), `# ${id}\n\nTODO description. Capacités: \`${slug}\`. Voir \`SKILL.md\`, \`skill.json\`.\n`);
  console.log('Reconstruction du registry…');
  execSync('node ' + JSON.stringify(join(ROOT, 'tools/build-registry.mjs')), { stdio: 'inherit' });
} else if (type === 'workflow') {
  write(join(ROOT, 'workflows', `${name}.yaml`), `id: ${name}\nversion: 0.1.0\ndescription: TODO\ncompatibility: { framework: ">=2.0.0 <3.0.0" }\ninputs: [brief, lang]\nsteps:\n  - id: step1\n    uses: [TODO-capability]\n    with: { brief: "TODO {{brief}}" }\n    parallelGroup: 1\n    produces: step1\nmerge: { agent: synthesis-agent, outfile: "./${name}-{{slug}}.md" }\nvalidation:\n  agent: validator-agent\n  gates: { documentation: 90 }\n  maxReplan: 1\n`);
} else if (type === 'agent') {
  write(join(ROOT, 'agents', `${name}.md`), `---\nname: ${name}\ndescription: >-\n  TODO rôle et quand spawner.\ntools: Read, Grep, Glob\nmodel: inherit\n---\n\n# RÔLE — ${name}\nTODO\n`);
} else if (type === 'command') {
  write(join(ROOT, 'commands', `${name}.md`), `---\ndescription: TODO\nargument-hint: <args> [--lang fr|en|both]\n---\n\nBrief : $ARGUMENTS\n\nTODO orchestration.\n`);
} else if (type === 'template') {
  write(join(ROOT, 'templates', `${name}.template.md`), `# Template: ${name}\n\nTODO\n`);
} else {
  console.error(`Type inconnu: ${type}`); process.exit(1);
}
console.log('Scaffold terminé.');
