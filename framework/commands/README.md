# commands/

Points d'entrée utilisateur (slash commands). **Une commande = un fichier `.md`.**

Une commande ne contient **aucune expertise** : elle parse les arguments, détermine la
langue, puis pilote les agents :

- **mono-domaine** (`/api`, `/database`, …) → lance un seul `specialist` sur le skill
  correspondant ;
- **pipeline** (`/orchestrate`, `/sds`) → `architect-orchestrator` → `specialist` en
  parallèle → `synthesis-agent`.

Ajouter une commande : copier `templates/command.template.md`. Voir
`docs/CONVENTIONS.md` (nommage) et `docs/ORCHESTRATION.md` (flux).
