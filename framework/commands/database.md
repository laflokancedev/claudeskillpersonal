---
description: Expert PostgreSQL — schéma, index, migrations, perf données. Lance le specialist sur le skill `database`.
argument-hint: <contexte / entités> [--lang fr|en|both]
---

Domaine : **database**.

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Brief vide → demander le contexte, stopper.
3. Lancer le sous-agent `specialist` avec :
   `SKILL=database`, `BRIEF`=brief nettoyé, `LANG`, `FILES`=fichiers cités,
   `OUTFILE=./database-<slug>.md`.
4. Relayer : lien vers le fichier, livrable résumé, bloc `Hand-off`, hypothèses `HYP-n`.

Ne transmettre que le contexte strictement nécessaire.
