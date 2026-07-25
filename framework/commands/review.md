---
description: Expert audit — dette technique, risques, score qualité, recommandations. Lance le specialist sur le skill `review`.
argument-hint: <fichier / diff / livrable à auditer> [--lang fr|en|both]
---

Domaine : **review**.

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Si aucune cible d'audit → demander le fichier/diff/livrable, stopper.
3. Lancer le sous-agent `specialist` avec :
   `SKILL=review`, `BRIEF`=brief nettoyé, `LANG`, `FILES`=cibles d'audit,
   `OUTFILE=./review-<slug>.md`.
4. Relayer : verdict + score global, risques P0/P1, recommandations, lien vers le fichier.

Ne transmettre que le contexte strictement nécessaire à l'audit.
