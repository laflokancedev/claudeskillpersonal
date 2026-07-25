---
description: Génère une nouvelle extension SDK conforme (manifest + structure), sans modifier le cœur.
argument-hint: <name-kebab>
---

Créer une extension via le SDK Generator (ADR-064).

1. Générer :
   ```bash
   node sdk/generators/new-extension.mjs $ARGUMENTS
   ```
2. Éditer `extensions/$ARGUMENTS/extension.json` : `provides` (skills/workflows/…), `hooks`,
   `capabilities`, `permissions` (liste blanche). L'extension importe **uniquement**
   `sdk/index.mjs`.
3. Charger et valider :
   ```bash
   node sdk/loader.mjs --write
   ```
4. Si l'extension ajoute des skills : `node tools/build-registry.mjs` puis `/sync`.
