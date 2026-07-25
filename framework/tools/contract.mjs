#!/usr/bin/env node
// contract — Contract Engine (ADR-027). Mini-validateur JSON Schema (sous-ensemble, zéro
// dépendance) : type, required, properties, additionalProperties:false, items, enum, const,
// pattern, minItems, minimum, maximum, minLength. Rejette tout objet libre non conforme.
// Usage: node tools/contract.mjs <schema.json> <payload.json>
import { fileURLToPath } from 'node:url';
import { join, isAbsolute } from 'node:path';
import { readJson } from './lib/fsutil.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const typeOf = (v) => Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v === 'number' && Number.isInteger(v) ? 'integer' : typeof v;

export function validate(schema, data, path = '$', errors = []) {
  if (schema.const !== undefined && JSON.stringify(data) !== JSON.stringify(schema.const))
    errors.push(`${path}: const attendu ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(data)))
    errors.push(`${path}: valeur hors enum`);
  if (schema.type) {
    const t = typeOf(data);
    const ok = schema.type === 'number' ? (t === 'number' || t === 'integer') : t === schema.type;
    if (!ok) { errors.push(`${path}: type ${t} ≠ ${schema.type}`); return errors; }
  }
  if (typeof data === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) errors.push(`${path}: pattern non respecté`);
    if (schema.minLength != null && data.length < schema.minLength) errors.push(`${path}: minLength ${schema.minLength}`);
  }
  if (typeof data === 'number') {
    if (schema.minimum != null && data < schema.minimum) errors.push(`${path}: < minimum ${schema.minimum}`);
    if (schema.maximum != null && data > schema.maximum) errors.push(`${path}: > maximum ${schema.maximum}`);
  }
  if (typeOf(data) === 'array') {
    if (schema.minItems != null && data.length < schema.minItems) errors.push(`${path}: minItems ${schema.minItems}`);
    if (schema.items) data.forEach((it, i) => validate(schema.items, it, `${path}[${i}]`, errors));
  }
  if (typeOf(data) === 'object') {
    for (const req of schema.required || []) if (!(req in data)) errors.push(`${path}: champ requis '${req}' manquant`);
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(data)) {
      if (props[k]) validate(props[k], v, `${path}.${k}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}: propriété non permise '${k}'`);
    }
  }
  return errors;
}

if (process.argv[1]?.endsWith('contract.mjs')) {
  const [sp, pp] = process.argv.slice(2);
  if (!sp || !pp) { console.error('Usage: contract.mjs <schema.json> <payload.json>'); process.exit(1); }
  const schema = readJson(isAbsolute(sp) ? sp : join(ROOT, sp));
  const data = readJson(isAbsolute(pp) ? pp : join(ROOT, pp));
  const errs = validate(schema, data);
  if (errs.length) { errs.forEach((e) => console.error('❌ ' + e)); process.exit(1); }
  console.log('✅ Payload conforme au contrat.');
}
