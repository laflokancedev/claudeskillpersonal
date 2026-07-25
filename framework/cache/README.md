# cache/

Caches multi-niveaux (ADR-012). Contenu git-ignoré ; clé d'invalidation = **hash de
contenu + versions**.

| Niveau | Clé / invalidation |
|--------|--------------------|
| Prompt | Prompt caching LLM ; invalide au bump de version d'un prompt |
| Knowledge | hash du `.md` source (packs pré-résumés) |
| Workflow | hash(`workflow.yaml` + inputs + `registry.schemaVersion`) |
| Skill (index) | hash de `skills/**/skill.json` (= `registry.sourceHash`) |
| Documents | hash(brief scopé + versions des skills) |
| API | TTL + ETag |

Aucun secret ni donnée sensible en cache. Purge : supprimer le dossier régénère à la
demande.
