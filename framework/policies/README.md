# policies/

**Policy Engine (ADR-020).** Source de vérité unique des constantes du framework. Aucune
de ces valeurs n'apparaît dans un agent (invariant vérifié par `selfcheck`).

| Fichier | Contenu |
|---------|---------|
| `budgets.yaml` | budgets de tokens, `maxSpecialists` |
| `models.yaml` | rôles + règles de routage modèle (Model Router) |
| `execution.yaml` | timeouts, retries, parallélisme (Scheduler) |
| `routing.yaml` | résolution des capacités + sélection knowledge |
| `quality.yaml` | gates, dimensions, poids (Quality Engine / Score) |
| `security.yaml` | politique de sécurité (bloquante, non relâchable par extension) |
| `memory.yaml` | préférences et rétention mémoire |

**Précédence** (résolue par `tools/policy.mjs`) :
`defaults(config) < policies/*.yaml < workflow.overrides < run.overrides`.

Lecture programmatique : `node tools/policy.mjs get budgets.perRun`. Aucun tool/agent ne
lit de littéral : tout passe par le Policy Engine.
