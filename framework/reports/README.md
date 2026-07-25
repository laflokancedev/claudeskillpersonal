# reports/

Observabilité (ADR-014). Contenu git-ignoré.

- `traces/<runId>/*.json` — une trace par étape (schéma `schemas/trace.schema.json`) :
  `durationMs, tokensIn/Out, estCostUsd, model, status, warnings, errors`.
- `<runId>.md` — rapport agrégé produit par `node tools/report.mjs <runId>` : durée,
  tokens, coût, taux de succès, scores des quality gates.

Objectif : rendre coût et performance mesurables par run, base de l'optimisation.
