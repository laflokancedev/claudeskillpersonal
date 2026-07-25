---
description: <Ce que fait la commande, en une ligne, orientée résultat.>
argument-hint: <arguments attendus> [--lang fr|en|both]
---

Domaine : **<skill>**.   <!-- ou : pipeline multi-agent -->

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Brief vide → demander le contexte, stopper.
3. Lancer le(s) sous-agent(s) :
   - mono-domaine : `specialist` avec `SKILL=<skill>`, `BRIEF`, `LANG`, `FILES`, `OUTFILE`.
   - pipeline : `architect-orchestrator` → `specialist` (parallèle) → `synthesis-agent`.
4. Relayer : lien vers le fichier, livrable résumé, `Hand-off`, hypothèses `HYP-n`.

Règle de contexte : transmettre uniquement le contexte strictement nécessaire.
