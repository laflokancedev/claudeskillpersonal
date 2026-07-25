# extensions/

**Extension System (ADR-034).** Emplacement local (convention) où des extensions tierces
déposent `skills/`, `knowledge/`, `templates/`, `workflows/`, `commands/`, `policies/`
**sans modifier le dépôt principal**.

Découverte automatique :
- `build-registry` scanne aussi `extensions/**/skill.json` → fusion dans le registry.
- `policy.mjs` fusionne les `extensions/**/policies/*` **sous** les policies du cœur
  (précédence cœur) — une extension **ne peut pas** relâcher `policies/security.yaml`
  (`denyExtensionOverride: true`).

Résolution de collision de capacités : `priority` puis `maturityLevel`. Les extensions
distribuées via la marketplace Claude Code sont découvertes de la même façon.

> Vide par défaut (`.gitkeep`). Déposer une extension puis `/sync`.
