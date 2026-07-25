# Stratégie de migration

Versionnement indépendant par artefact (framework, agent, skill, workflow, template,
knowledge). Compatibilité déclarée par plages semver (`compatibility.framework`,
`dependencies[].range`). Principe général : **expand → migrate → contract**.

## Phase 1 → Phase 2 (en cours — vertical slice livré)

| Étape | Action | Statut |
|-------|--------|--------|
| Expand | Ajout `schemas/`, `tools/`, `workflows/`, `memory/`, `cache/`, `reports/`, `framework.config.json`, `validator-agent`, `registry.json` | ✅ |
| Move | `skills/<skill>/` → `skills/<category>/<skill>/` (catégorie `engineering` migrée : architecture, frontend, backend, database, api) | ✅ (engineering) |
| Migrate | Orchestrateur : sélection **par capacités** via registre (plus de liste en dur). Specialist : résolution `path/entry` via registre | ✅ |
| Contract | Retirer alias de noms + fallbacks une fois toutes catégories migrées ; bump framework majeur | ⏳ après migration complète |

### Reste à migrer (Phase 2 complète)
Catégories `design` (ui-ux), `operations` (security, devops), `quality` (review,
testing, performance), `documentation`, `ai`. Procédure par skill :
`node tools/scaffold.mjs skill <category>/<slug>` **ou** ajout d'un `skill.json` au skill
existant, déplacement sous `skills/<category>/`, puis `/sync`. Aucun agent n'est modifié.

## Compatibilité & rollback
- Un retrait passe d'abord par `maturityLevel: deprecated` (≥ 1 version mineure).
- Rollback : restaurer le `registry.json` précédent (artefacts versionnés) et rétablir
  le dossier déplacé. Les manifestes déclarant `compatibility.framework` hors plage sont
  écartés par l'orchestrateur, jamais exécutés silencieusement.
- Interfaces : `apiVersion` par message ; `v1`/`v2` coexistent pendant la dépréciation.

## Migration du format de registre
`registry.schemaVersion` versionne le **format**. Un changement de format fournit un
convertisseur dans `tools/` et une entrée `CHANGELOG.md`. Les tests de migration
(`tests/`) chargent des fixtures d'anciennes versions.
