# Policies & Feature Flags

Le comportement du framework est **piloté par des fichiers déclaratifs**, pas par les
prompts (ADR-020 / ADR-031). Les agents ne contiennent aucune constante.

## Résolution (précédence)
`tools/policy.mjs` calcule la valeur effective :
```
defaults (framework.config.json, shim) < policies/*.yaml < workflow.overrides < run.overrides
```
Lecture : `node tools/policy.mjs get <namespace.clé>` — ex. `budgets.perRun`,
`models.roles.synthesis`, `execution.retry.max`, `features.scheduler`.

## Namespaces (policies/)
| Namespace | Clés notables |
|-----------|---------------|
| `budgets` | `perRun, perStep, perSkill, warnAtPct, maxSpecialists` |
| `models` | `roles.*`, `routing[]` (règles), `default` |
| `execution` | `maxSpecialists, timeoutMsPerTask, retry, parallelism` |
| `routing` | `capabilityResolution.order`, `knowledge.maxDocsPerTask, selectBy` |
| `quality` | `gates.*, dimensions[], weights, requireEvidence` |
| `security` | `blocking, minSecurityScore, denyExtensionOverride` |
| `memory` | `prefer[], retention` |

## Feature flags (features/flags.yaml)
`validator, knowledge, parallel, memory, reports, quality, router, scheduler`,
`qualityDimensions.*`. Une étape désactivée est **sautée par la commande/tooling** —
jamais par un `if` de prompt. Défaut = parité Phase 2.

## Consommateurs
- Model Router → `models.yaml` · Scheduler → `execution.yaml` · Knowledge Router →
  `routing.yaml` · Quality Engine / Score → `quality.yaml` · Extensions → `security.yaml`.

## Règle d'or
Changer un comportement = éditer une policy/flag, **jamais** un prompt d'agent. Le
`selfcheck` refuse un run si une policy requise est absente ou illisible.
