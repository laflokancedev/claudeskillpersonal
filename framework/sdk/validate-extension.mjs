#!/usr/bin/env node
// Validation SDK (ADR-061). Vérifie une extension AVANT chargement : manifest, fichiers
// fournis, hooks connus, permissions autorisées, compatibilité SDK. Aucune IA.
// Usage: node sdk/validate-extension.mjs <extensionDir>
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { validate as validateContract } from '../tools/contract.mjs';
import { KNOWN_HOOKS } from './hooks.mjs';

const FRAMEWORK = fileURLToPath(new URL('..', import.meta.url));
export const SDK_API_VERSION = '1.0.0';
const ALLOWED_PERMISSIONS = new Set([
  'read:registry', 'read:policy', 'read:intel',
  'register:skill', 'register:workflow', 'register:signature', 'register:policy',
  'register:command', 'register:agent', 'register:router', 'register:validator',
  'register:template', 'register:hook', 'emit:event'
]);

export function validateExtension(extDir) {
  const errors = [], warnings = [];
  const mfPath = join(extDir, 'extension.json');
  if (!existsSync(mfPath)) return { name: extDir, valid: false, errors: ['extension.json manquant'] };
  let mf;
  try { mf = JSON.parse(readFileSync(mfPath, 'utf8')); } catch (e) { return { name: extDir, valid: false, errors: ['extension.json illisible: ' + e.message] }; }

  const schema = JSON.parse(readFileSync(join(FRAMEWORK, 'schemas/sdk/extension-manifest.schema.json'), 'utf8'));
  for (const e of validateContract(schema, mf)) errors.push('manifest: ' + e);

  // Compatibilité SDK (slice : version exacte de la famille).
  if (mf.sdkApiVersion && mf.sdkApiVersion !== SDK_API_VERSION) errors.push(`sdkApiVersion ${mf.sdkApiVersion} ≠ ${SDK_API_VERSION}`);

  // Fichiers fournis existent.
  const prov = mf.provides || {};
  for (const grp of Object.keys(prov)) for (const rel of prov[grp] || []) {
    const p = join(extDir, rel);
    if (!existsSync(p) && !existsSync(join(p, 'skill.json')) && !existsSync(join(p, 'SKILL.md')))
      warnings.push(`fourniture '${grp}' introuvable: ${rel}`);
  }
  // Hooks connus + handlers présents.
  for (const h of mf.hooks || []) {
    if (!KNOWN_HOOKS.includes(h.name)) errors.push(`hook inconnu: ${h.name}`);
    if (h.handler && !existsSync(join(extDir, h.handler))) errors.push(`handler manquant: ${h.handler}`);
  }
  // Permissions dans la liste autorisée (Sandbox contractuel, ADR-062).
  for (const perm of mf.permissions || []) if (!ALLOWED_PERMISSIONS.has(perm)) errors.push(`permission non autorisée: ${perm}`);

  return { name: mf.name || extDir, valid: errors.length === 0, errors, warnings };
}

if (process.argv[1]?.endsWith('validate-extension.mjs')) {
  const dir = join(process.cwd(), process.argv[2] || '.');
  const r = validateExtension(dir);
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.valid ? 0 : 1);
}
