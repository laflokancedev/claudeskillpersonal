---
description: Expert IA/LLM — prompts, agents, RAG, mémoire, optimisation tokens/coûts. Lance le specialist sur le skill `ai`.
argument-hint: <contexte / cas d'usage IA> [--lang fr|en|both]
---

Domaine : **ai**.

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Brief vide → demander le contexte, stopper.
3. Lancer le sous-agent `specialist` avec :
   `SKILL=ai`, `BRIEF`=brief nettoyé, `LANG`, `FILES`=fichiers cités,
   `OUTFILE=./ai-<slug>.md`.
4. Relayer : lien vers le fichier, livrable résumé, bloc `Hand-off`, hypothèses `HYP-n`.

Ne transmettre que le contexte strictement nécessaire.
