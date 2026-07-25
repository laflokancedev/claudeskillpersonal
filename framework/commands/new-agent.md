---
description: Génère un nouvel agent (rare — le cœur du pipeline est stable).
argument-hint: <slug>
---

Créer un agent par scaffolding.

1. Exécuter :
   ```bash
   node tools/scaffold.mjs agent $ARGUMENTS
   ```
2. Éditer `agents/$ARGUMENTS.md` (frontmatter `name/description/tools/model`, rôle,
   contrats d'I/O). Respecter l'API interne (`docs/INTERNAL-API.md`) si l'agent
   s'insère dans le pipeline.
