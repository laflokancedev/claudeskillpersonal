<!-- GÉNÉRÉ PAR tools/score.mjs — NE PAS ÉDITER -->

# Architecture Score (préliminaire, structurel)

| Score | Valeur | Explication |
|-------|--------|-------------|
| Architecture | 100 | Séparation déclaratif/tooling/prompt, contrats schématisés, policies externalisées. |
| Extensibility | 100 | Ajout par fichiers (OCP) : registry, policies, features, workflows, schemas, SDK. |
| Documentation | 88 | Couverture README par dossier + docs générées. |
| Maintainability | 95 | Constantes centralisées (policies), contrats validés, agents sans logique. |
| Complexity | 71 | Nombre de composants (plus bas = plus simple). Préliminaire. |
| Risk | 80 | Fondé sur la maturité des skills et la présence de garde-fous (selfcheck, sécurité bloquante). |
| Quality | N/A | Nécessite un run (Quality Engine). Renseigné par le dernier QualityReport. |

## Détail

### Architecture — 100
- Séparation déclaratif/tooling/prompt, contrats schématisés, policies externalisées.
- Preuves : 7 policies · 17 schémas · 5 skills indexés

### Extensibility — 100
- Ajout par fichiers (OCP) : registry, policies, features, workflows, schemas, SDK.
- Preuves : 6/6 piliers déclaratifs présents

### Documentation — 88
- Couverture README par dossier + docs générées.
- Preuves : 15/17 dossiers avec README

### Maintainability — 95
- Constantes centralisées (policies), contrats validés, agents sans logique.
- Preuves : constantes → policies · contract engine présent

### Complexity — 71
- Nombre de composants (plus bas = plus simple). Préliminaire.
- Preuves : 5 skills + 7 policies + 17 schémas
- Recommandations : Surveiller la croissance ; regrouper par catégories

### Risk — 80
- Fondé sur la maturité des skills et la présence de garde-fous (selfcheck, sécurité bloquante).
- Preuves : selfcheck: true · security policy: true

### Quality — N/A
- Nécessite un run (Quality Engine). Renseigné par le dernier QualityReport.
- Recommandations : Lancer /run pour produire un QualityReport
