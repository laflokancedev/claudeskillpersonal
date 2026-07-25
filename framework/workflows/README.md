# workflows/

Workflows **déclaratifs** (YAML). Aucune logique de workflow n'est codée dans les agents
(ADR-006) : un workflow décrit des étapes qui référencent des **capacités** (`uses`), pas
des noms de skills. Le moteur (`/run <id>`) + l'orchestrateur résolvent capacités → skills
via `skills/registry.json`.

## Schéma
`../schemas/workflow.schema.json`. Champs : `id, version, description, compatibility,
inputs, tokenBudget, steps[] (id, uses, with, needs, parallelGroup, when, produces),
merge, validation (gates, maxReplan), rollback, onError`.

## Contraintes du parseur (tooling)
Le lint (`tools/validate.mjs`) lit un **sous-ensemble YAML** : maps imbriquées
(indentation 2 espaces), séquences de blocs, tableaux flow `[a, b]`. Éviter ancres,
block scalars (`|`, `>`) et multi-docs. Les agents, eux, lisent le YAML nativement.

## Ajouter un workflow
`node tools/scaffold.mjs workflow <id>` (ou `/new-workflow <id>`), puis éditer et
`node tools/validate.mjs` (DAG acyclique, capacités existantes).

## Fourni
- `sds.yaml` — SDS bout-en-bout sur la catégorie `engineering` (arch → data → api →
  {backend ∥ frontend} → validation → synthèse). Les étapes `security`, `ui-ux`, etc.
  s'ajoutent quand ces catégories sont migrées (Phase 2 complète).
