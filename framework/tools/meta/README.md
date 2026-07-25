# tools/meta/

Couche **méta** (Phase 6) : le framework s'analyse lui-même et **propose** des évolutions.
**LECTURE-SEULE** — écrit uniquement dans `proposals/` et `artifacts/meta/`, **jamais** dans
le cœur/SDK/contrats. **Propose, n'applique pas.** Décision **humaine**. Déterministe.

| Script | ADR | Rôle |
|--------|-----|------|
| `introspect.mjs` | 066 | FrameworkModel (le framework vu comme un projet) |
| `techdebt.mjs` | 072 | dette : skills inutilisés, fichiers dupliqués |
| `metrics.mjs` | 077 | métriques communes déterministes |
| `impact.mjs` | 069 | dépendances inverses (capacité/fichier → impactés) |
| `compat.mjs` | 070 | **prouve** l'absence de régression (snapshot API v1 + SDK) |
| `self-evolution-report.mjs` | 080 | **rapport unique** agrégé + propositions PROPOSED |

Contrats : `schemas/meta/*` (`metaApiVersion` 1.0.0), famille **séparée** de l'API v1/SDK.
Baseline de compatibilité : `node tools/meta/compat.mjs --write-snapshot` (une fois), puis
`compat.mjs` compare. Toute implémentation d'une proposition passe par une **extension SDK**.

Stubs (Phase 6 complète) : evolution-engine, adr-gen, roadmap, advisor, benchmark,
release-planner, governance, continuous-evaluation (hook `afterReport`), meta-knowledge.
