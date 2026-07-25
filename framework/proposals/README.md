# proposals/

Sorties **PROPOSED** de la couche méta (Phase 6). **Aucune n'est appliquée** : ce sont des
propositions à arbitrer par la Gouvernance (humain). Contenu runtime git-ignoré (sauf ce
README).

| Sous-dossier | Contenu |
|--------------|---------|
| `self-evolution/` | Self Evolution Report daté (ADR-080) |
| `adr/` | brouillons d'ADR générés (ADR-068, statut PROPOSED) |
| `migrations/` | plans de migration générés (ADR-075) — jamais exécutés |

Règle : la couche méta est **lecture-seule** ; elle n'écrit que sous `proposals/` et
`artifacts/meta/`, jamais dans le cœur, le SDK ou les contrats.
