---
description: Génère un nouveau skill conforme (dossier, skill.json, SKILL.md, knowledge, examples, tests, README) puis reconstruit le registre.
argument-hint: <category>/<slug>   (category ∈ engineering|design|operations|quality|documentation|ai)
---

Créer un skill par scaffolding déterministe.

1. Vérifier l'argument `$ARGUMENTS` = `<category>/<slug>`.
2. Exécuter :
   ```bash
   node tools/scaffold.mjs skill $ARGUMENTS
   ```
3. Le scaffolder crée le dossier + `skill.json` + `SKILL.md` (8 sections) + `knowledge/`
   + `examples/` + `tests/` + `README.md`, puis reconstruit `skills/registry.json`.
4. Relayer le chemin créé et rappeler : remplir les `TODO` du `SKILL.md`/`skill.json`,
   puis `/sync`. Voir `docs/ADDING-A-SKILL.md`.
