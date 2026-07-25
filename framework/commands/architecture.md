---
description: Expert architecture — style, découpage, diagrammes, ADR. Lance le specialist sur le skill `architecture`.
argument-hint: <contexte / besoin> [--lang fr|en|both]
---

Domaine : **architecture**.

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Brief vide → demander le contexte, stopper.
3. Lancer le sous-agent `specialist` (outil Agent/Task) avec :
   `SKILL=architecture`, `BRIEF`=brief nettoyé, `LANG`, `FILES`=fichiers cités,
   `OUTFILE=./architecture-<slug>.md`.
4. Relayer : lien vers le fichier, livrable résumé, bloc `Hand-off`, hypothèses `HYP-n`.

Ne transmettre que le contexte strictement nécessaire.
