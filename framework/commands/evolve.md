---
description: Couche méta — analyse le framework lui-même et produit un Self Evolution Report (propositions). LECTURE-SEULE, ne modifie jamais le cœur.
argument-hint: (aucun)
---

Faire s'auto-évaluer le framework (Phase 6). **Read-only** : produit des **propositions**,
jamais des modifications. Décision **humaine**.

1. Capturer/actualiser la baseline de compatibilité (une fois) :
   ```bash
   node tools/meta/compat.mjs --write-snapshot
   ```
2. Produire le rapport unique :
   ```bash
   node tools/meta/self-evolution-report.mjs
   ```
   Écrit `artifacts/meta/self-evolution-report.json` + `proposals/self-evolution/<date>.md`.
3. Relayer : dette technique, propositions `PROPOSED` (avec preuves), compatibilité
   (API v1 + SDK inchangés ?), métriques. Rappeler que toute implémentation passe par une
   **extension SDK** validée par la Gouvernance — le cœur reste gelé.

Analyses complémentaires : `node tools/meta/introspect.mjs` (modèle), `techdebt.mjs`,
`metrics.mjs`, `impact.mjs <capacité|fichier>`, `compat.mjs`.
