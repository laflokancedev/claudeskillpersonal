---
description: Reconstruit le registre des skills et régénère la documentation (inventaires, graphes). À lancer après ajout/modification d'un skill ou workflow.
argument-hint: (aucun)
---

Synchroniser l'index et la doc générée après un changement de skills/workflows.

1. Reconstruire le registre : exécuter
   ```bash
   node tools/build-registry.mjs
   ```
2. Régénérer la documentation dérivée :
   ```bash
   node tools/gen-docs.mjs
   ```
3. Valider l'ensemble :
   ```bash
   node tools/validate.mjs
   ```
4. Relayer : nombre de skills et de capacités indexés, warnings/erreurs éventuels, et
   les fichiers régénérés sous `docs/generated/`.
