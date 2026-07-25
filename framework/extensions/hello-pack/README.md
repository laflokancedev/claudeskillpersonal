# hello-pack (extension d'exemple)

Feature Pack de démonstration (ADR-063). Prouve qu'une extension ajoute des capacités
**sans modifier le cœur** :

- **skill** `documentation.greeter` (capacité `greeting`) — découvert par `build-registry`
  qui scanne aussi `extensions/**/skill.json`.
- **hook** `afterScan` (handler pur) — enregistré via le SDK, dispatché par `sdk/hooks.mjs`.

Chargement : `node sdk/loader.mjs --write` (découverte + validation + lockfile). Manifest :
`extension.json` (schéma `schemas/sdk/extension-manifest.schema.json`).
