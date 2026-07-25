# sdk/ — Plugin SDK (Phase 5, `sdkApiVersion` 1.0.0)

**Seule API publique** du framework (ADR-051 / ADR-058). Une extension **importe uniquement
`sdk/index.mjs`** ; l'accès aux internes (`tools/*`) est interdit (`no-core-import`,
vérifié par la Validation SDK). Direction des dépendances : `Extensions → SDK → Core`.

## Surface publique (`index.mjs`)
| Namespace | Fonctions |
|-----------|-----------|
| `contracts` | `validate(payload, schemaRel)` |
| `policy` | `get(key)` (lecture) |
| `registry` | `getSkills()`, `resolveCapability(cap)` (lecture) |
| `hooks` | `register(name, handler, priority)`, `dispatch(name, payload)`, `known()` |
| `templates` | `render(str, vars)` |
| `define*` | `defineSkill/Workflow/Signature/Template/Policy/Hook` (valident la déclaration) |

## Moteurs (tooling)
| Fichier | ADR | Rôle |
|---------|-----|------|
| `loader.mjs` | 053 | découvre `extensions/`, valide, résout, écrit `extensions.lock.json` |
| `validate-extension.mjs` | 061 | valide manifest, fichiers, hooks, permissions, compat |
| `resolve-deps.mjs` | 054 | tri topologique + missing/cycle |
| `hooks.mjs` | 056 | dispatch déterministe (handlers purs → delta) |
| `templates.mjs` | 060 | substitution `{{var}}` pure |
| `generators/` | 064 | `new-extension` (via templates) |

## Sandbox contractuel (ADR-062)
Une extension déclare ses `permissions[]` (liste blanche) ; elle **ne peut pas** écrire dans le
cœur, modifier `schemas/api/*` v1, importer `tools/*`, ni relâcher `policies/security.yaml`.
Isolation **logique** (validation + permissions), pas OS.

## Créer une extension
`node sdk/generators/new-extension.mjs <name>` → `extensions/<name>/` (manifest + exemple).
Puis `node sdk/loader.mjs --write`. Manifest : `schemas/sdk/extension-manifest.schema.json`.

Stubs (Phase 5 complète) : service-container, marketplace (protocole distant), lifecycle
complet, governance tooling.
