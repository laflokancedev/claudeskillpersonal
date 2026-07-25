# signatures/

**Base de signatures déclaratives** (ADR-038 / ADR-048). Reconnaître une technologie ou une
architecture = **ajouter une signature YAML**, jamais du code (OCP).

Structure d'un fichier : `{ category, signatures: [ {id, confidence, provides|style, match} ] }`.
`match` (OR entre critères) : `extensions[]`, `files[]` (basename), `pathContains[]`,
`depsAny[]` (dépendances de manifest). Schéma : `../schemas/intel/signature.schema.json`.

| Fichier | Catégorie |
|---------|-----------|
| `build.yaml` | runtime/build (node, typescript, json-schema, claude-code-plugin…) |
| `frontend.yaml` | react, nextjs, vue, svelte, tailwind |
| `backend.yaml` | express, nestjs, fastapi, django, go |
| `orm.yaml` | prisma, typeorm, drizzle, sqlalchemy |
| `docker.yaml` | dockerfile, docker-compose |
| `cicd.yaml` | github-actions, gitlab-ci, circleci |
| `monorepo.yaml` | nx, turborepo, pnpm-workspace |
| `architecture.yaml` | feature-sliced, hexagonal, layered, atomic, microservices, modular-plugin, event-driven |

Le `Technology Detector` (`tools/intel/detect-tech.mjs`) et le `build-profile` appliquent ces
signatures à l'inventaire. Chaque détection porte une `confidence` et des `evidence`.
Enrichissement : ajouter une signature puis `/sync`. Cloud/infra à compléter (extension).
