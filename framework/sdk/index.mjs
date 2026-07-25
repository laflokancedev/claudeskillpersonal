// SDK — API PUBLIQUE STABLE (ADR-051 / ADR-058). Seule surface autorisée pour les extensions.
// Les extensions importent UNIQUEMENT ce module ; l'accès aux internes `tools/*` est interdit.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { validate as validateContract } from '../tools/contract.mjs';
import { get as policyGet } from '../tools/policy.mjs';
import { registerHook, dispatch, known as knownHooks } from './hooks.mjs';
import { render } from './templates.mjs';

const FRAMEWORK = fileURLToPath(new URL('..', import.meta.url));
export const sdkApiVersion = '1.0.0';
const loadSchema = (rel) => JSON.parse(readFileSync(join(FRAMEWORK, rel), 'utf8'));
const readJson = (rel) => JSON.parse(readFileSync(join(FRAMEWORK, rel), 'utf8'));

export const contracts = {
  validate(payload, schemaRel) { const errs = validateContract(loadSchema(schemaRel), payload); return { valid: errs.length === 0, errors: errs }; }
};

export const policy = { get: (key) => policyGet(key) };

export const registry = {
  getSkills() { return readJson('skills/registry.json').skills; },
  resolveCapability(cap) { return readJson('skills/registry.json').capabilityIndex[cap] || []; }
};

export const hooks = { register: registerHook, dispatch, known: knownHooks };
export const templates = { render };

function define(obj, schemaRel, label) {
  const r = contracts.validate(obj, schemaRel);
  if (!r.valid) throw new Error(`${label} invalide: ${r.errors.join(' ; ')}`);
  return obj;
}
export const defineSkill = (o) => define(o, 'schemas/skill.schema.json', 'skill');
export const defineWorkflow = (o) => define(o, 'schemas/workflow.schema.json', 'workflow');
export const defineSignature = (o) => define(o, 'schemas/intel/signature.schema.json', 'signature');
export const defineTemplate = (o) => define(o, 'schemas/sdk/template-descriptor.schema.json', 'template');
export const definePolicy = (o) => o; // policies libres (YAML), fusionnées sous précédence cœur
export const defineHook = (name, handler, priority) => { registerHook(name, handler, priority); return { name, priority }; };

export default { sdkApiVersion, contracts, policy, registry, hooks, templates, defineSkill, defineWorkflow, defineSignature, defineTemplate, definePolicy, defineHook };
