---
description: Gère les extensions (SDK) — découverte, validation, cycle de vie. Le cœur ne connaît aucune extension ; le Loader est l'unique pont.
argument-hint: list|load|validate <name> [--write]
---

Piloter l'écosystème d'extensions via le SDK (Phase 5).

- **Découvrir + valider + résoudre** (écrit `extensions.lock.json`) :
  ```bash
  node sdk/loader.mjs --write
  ```
- **Valider une extension précise** :
  ```bash
  node sdk/validate-extension.mjs extensions/<name>
  ```
- **Après ajout d'un skill par extension**, réindexer le registre :
  ```bash
  node tools/build-registry.mjs
  ```

Relayer : extensions découvertes, verdict de validation (valid/erreurs), ce que chaque
extension fournit (skills/hooks/…), ordre de chargement (lockfile). Cycle de vie
(`install/enable/disable/update/rollback/remove`) : voir `docs/PHASE5-ECOSYSTEM-SDK.md`
(ADR-055) — stub d'implémentation dans ce slice.
