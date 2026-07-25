---
description: Expert sécurité — OWASP, authn/authz, JWT/OAuth/RBAC, CSP, chiffrement. Lance le specialist sur le skill `security`.
argument-hint: <contexte / surface> [--lang fr|en|both]
---

Domaine : **security**.

Brief (arguments bruts) : $ARGUMENTS

1. Déterminer `LANG` (`--lang fr|en|both`, défaut = langue du brief) ; retirer le flag.
2. Brief vide → demander le contexte, stopper.
3. Lancer le sous-agent `specialist` avec :
   `SKILL=security`, `BRIEF`=brief nettoyé, `LANG`, `FILES`=fichiers cités,
   `OUTFILE=./security-<slug>.md`.
4. Relayer : lien vers le fichier, livrable résumé, bloc `Hand-off`, hypothèses `HYP-n`.

Ne transmettre que le contexte strictement nécessaire.
