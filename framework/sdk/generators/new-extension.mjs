#!/usr/bin/env node
// SDK Generator (ADR-064). Scaffolde une extension via le Template Engine. Usage:
//   node sdk/generators/new-extension.mjs <name>
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { render } from '../templates.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));
const name = process.argv[2];
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) { console.error('Usage: new-extension.mjs <name-kebab>'); process.exit(1); }
const dir = join(FRAMEWORK, 'extensions', name);
if (existsSync(dir)) { console.error(`existe déjà: extensions/${name}`); process.exit(1); }

const w = (rel, content) => { const p = join(dir, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content); console.log('  + extensions/' + name + '/' + rel); };

const MANIFEST = `{
  "$schema": "../../schemas/sdk/extension-manifest.schema.json",
  "name": "{{name}}",
  "version": "0.1.0",
  "kind": "extension",
  "sdk": ">=1.0.0 <2.0.0",
  "sdkApiVersion": "1.0.0",
  "author": "TODO",
  "license": "MIT",
  "dependencies": [],
  "capabilities": [],
  "provides": { "skills": [], "signatures": [], "workflows": [], "policies": [], "templates": [] },
  "hooks": [],
  "permissions": ["read:registry"],
  "assets": []
}
`;

w('extension.json', render(MANIFEST, { name }));
w('README.md', render('# {{name}}\n\nExtension dev-crew. Importer UNIQUEMENT `sdk/index.mjs`.\nCharger : `node sdk/loader.mjs --write`.\n', { name }));
console.log(`Extension '${name}' créée. Éditer extension.json (provides/hooks/permissions) puis charger.`);
