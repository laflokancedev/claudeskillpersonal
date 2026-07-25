---
description: Génère un nouveau workflow YAML conforme au schéma.
argument-hint: <workflow-id>
---

Créer un workflow par scaffolding.

1. Exécuter :
   ```bash
   node tools/scaffold.mjs workflow $ARGUMENTS
   ```
2. Éditer `workflows/$ARGUMENTS.yaml` : définir `steps[].uses` (capacités du registre),
   `needs`, `parallelGroup`, `merge`, `validation.gates`.
3. Valider : `node tools/validate.mjs` (DAG acyclique, capacités existantes).
