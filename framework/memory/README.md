# memory/

Système de mémoire (ADR-011). **Politique : préférer résumés, contexte compressé et
références** à l'historique brut. Le contenu runtime est git-ignoré ; seuls la structure
et ce README sont versionnés.

| Sous-espace | Contenu |
|-------------|---------|
| `conversation/` | Résumés de session (court terme), pas les transcripts complets |
| `project/` | Faits durables du projet (objectifs, contraintes) référencés par chemin |
| `workflow/` | État/résultats intermédiaires d'un run de workflow |
| `skills/` | Notes de réutilisation par skill (livrables réutilisables) |
| `summaries/` | Résumés consolidés, chargés par référence plutôt que recopiés |

Lecture : l'orchestrateur charge `project/` + `summaries/` pertinents **par référence**,
jamais le contenu intégral. Rétention configurée dans `framework.config.json > memory`.
