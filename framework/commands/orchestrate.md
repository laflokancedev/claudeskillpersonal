---
description: Pipeline multi-agent complet — orchestrateur → experts en parallèle → synthèse. Pour toute demande couvrant plusieurs domaines.
argument-hint: <description du besoin> [--lang fr|en|both] [--skills a,b,c]
---

Tu pilotes le pipeline `dev-crew` depuis le thread principal (seul habilité à lancer
des sous-agents en parallèle). Ne produis aucun contenu métier toi-même.

Demande (arguments bruts) :

$ARGUMENTS

Procédure :

1. **Parsing** : extraire `--lang` (`fr|en|both`, défaut = langue de la demande) et
   `--skills` (liste blanche optionnelle). Retirer les flags du brief. Générer un slug
   → `OUTFILE = ./DEV-CREW-<slug>.md`. Si le brief est vide, demander le besoin et stopper.
2. **Planification** : lancer le sous-agent `architect-orchestrator` avec le brief et la
   langue. Récupérer son **PLAN JSON** (tâches, `depends_on`, `parallel_groups`). Si
   `--skills` est fourni, ne conserver que les tâches de ces skills.
3. **Exécution** : pour chaque `parallel_group` dans l'ordre :
   - lancer **en parallèle** un sous-agent `specialist` par tâche (un seul message,
     plusieurs appels Agent), en passant `SKILL`, `BRIEF`, `LANG`, `FILES`, et `PRIOR`
     = résumés `Hand-off` des tâches dont elle dépend.
   - attendre le groupe avant de passer au suivant (respect des dépendances).
4. **Synthèse** : lancer `synthesis-agent` avec `DELIVERABLES` (toutes les sorties),
   `OBJECTIVE`, `OUTFILE`, `LANG`. Il écrit le document final.
5. **Relais** : présenter à l'utilisateur le lien vers `OUTFILE`, le résumé exécutif,
   les conflits arbitrés et les hypothèses/questions ouvertes. Ne pas recopier le doc.

Règle de contexte : ne transmettre à chaque `specialist` que son `BRIEF` scopé + les
`FILES` utiles + les `PRIOR` nécessaires — jamais l'historique complet.
