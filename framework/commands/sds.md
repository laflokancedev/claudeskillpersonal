---
description: Génère une Software Design Specification (SDS) complète via le pipeline multi-agent (tous les domaines pertinents + synthèse).
argument-hint: <description du projet> [--lang fr|en|both]
---

Produit une **Software Design Specification** de bout en bout en orchestrant tous les
experts pertinents, puis en fusionnant leurs livrables.

Projet (arguments bruts) :

$ARGUMENTS

Procédure :

1. **Parsing** : `--lang` (`fr|en|both`, défaut = langue du brief) ; retirer le flag ;
   slug → `OUTFILE = ./SDS-<slug>.md`. Brief vide → demander la description, stopper.
2. **Planification** : lancer `architect-orchestrator` avec la consigne de couvrir une
   SDS complète — inclure au minimum les skills : `architecture`, `database`, `backend`,
   `api`, `frontend`, `ui-ux`, `security`, `performance`, `testing`, `devops`, `ai`
   (si le projet a une dimension IA) et `documentation`. Récupérer le PLAN JSON.
3. **Exécution** : lancer les sous-agents `specialist` par `parallel_groups`, en passant
   à chacun `SKILL`, `BRIEF` scopé, `LANG`, `FILES`, `PRIOR`.
4. **Synthèse** : lancer `synthesis-agent` (`DELIVERABLES`, `OBJECTIVE`, `OUTFILE`,
   `LANG`) pour produire la SDS finale (sommaire, résumé exécutif, sections par domaine,
   cohérence inter-domaines, hypothèses, roadmap).
5. **Relais** : lien vers `OUTFILE`, résumé exécutif, stack recommandée, conflits
   arbitrés, hypothèses `HYP-n` et questions ouvertes.

Contexte minimal par expert (jamais l'historique complet).
