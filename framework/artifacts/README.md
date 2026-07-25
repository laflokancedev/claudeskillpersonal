# artifacts/

**Artifact Store (ADR-026).** Tous les composants travaillent sur des **artefacts
adressés par id** (jamais des chemins arbitraires). Contenu runtime git-ignoré.

| Sous-dossier | Contenu |
|--------------|---------|
| `runs/<runId>/events.jsonl` | Event Bus append-only (ADR-021) |
| `plans/` | PLAN générés (Execution Graph) |
| `reports/` | métriques/rapports d'observabilité |
| `validation/` | ValidationReport / QualityReport |
| `documents/` | documents finaux |

Enveloppe (schéma `../schemas/artifact.schema.json`) :
`{ id, kind, version, hash, date, workflow, origin, payload }`.

CLI : `node tools/artifacts.mjs put|get|list <kind> …`. Adressage par `hash` = dédup + cache.
