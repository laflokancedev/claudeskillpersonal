# features/

**Feature Flags (ADR-031).** `flags.yaml` active/désactive des étapes du pipeline. Les
moteurs lisent les drapeaux ; **aucun `if` dans un prompt** — la commande/tooling
conditionne l'entrée de l'agent selon les flags.

Flags : `validator, knowledge, parallel, memory, reports, quality, router, scheduler`
(+ `qualityDimensions`). Défaut = parité fonctionnelle avec Phase 2 (tout activé).

Précédence via Policy Engine : `run > workflow > features > defaults`. Schéma :
`../schemas/features.schema.json`.
