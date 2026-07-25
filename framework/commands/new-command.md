---
description: Génère une nouvelle slash command.
argument-hint: <slug>
---

Créer une commande par scaffolding.

1. Exécuter :
   ```bash
   node tools/scaffold.mjs command $ARGUMENTS
   ```
2. Éditer `commands/$ARGUMENTS.md` : soit un lancement mono-domaine (spawn `specialist`),
   soit un workflow (`/run <id>`). Voir `templates/command.template.md`.
