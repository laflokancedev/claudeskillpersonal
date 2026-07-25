---
description: Expert UI/UX — parcours, wireframes, design system, WCAG. Lance le specialist sur le skill `ui-ux`.
argument-hint: <contexte / écran / besoin> [--lang fr|en|both]
---

Domaine : **ui-ux**.

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Brief vide → demander le contexte, stopper.
3. Lancer le sous-agent `specialist` avec :
   `SKILL=ui-ux`, `BRIEF`=brief nettoyé, `LANG`, `FILES`=fichiers cités,
   `OUTFILE=./ui-ux-<slug>.md`.
4. Relayer : lien vers le fichier, livrable résumé, bloc `Hand-off`, hypothèses `HYP-n`.

Ne transmettre que le contexte strictement nécessaire.
