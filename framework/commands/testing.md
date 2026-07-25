---
description: Expert QA — pyramide de tests, Vitest, Playwright, couverture. Lance le specialist sur le skill `testing`.
argument-hint: <contexte / périmètre> [--lang fr|en|both]
---

Domaine : **testing**.

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Brief vide → demander le contexte, stopper.
3. Lancer le sous-agent `specialist` avec :
   `SKILL=testing`, `BRIEF`=brief nettoyé, `LANG`, `FILES`=fichiers cités,
   `OUTFILE=./testing-<slug>.md`.
4. Relayer : lien vers le fichier, livrable résumé, bloc `Hand-off`, hypothèses `HYP-n`.

Ne transmettre que le contexte strictement nécessaire.
