# contracts/

**Contract Engine (ADR-027).** Ce dossier documente la surface **contractuelle** ; les
schémas normatifs vivent dans `../schemas/` (source unique). Tout échange inter-composant
est validé par `tools/contract.mjs` ; **aucun objet libre** n'est accepté.

Chaîne contractuelle (tous portent `apiVersion`) :
`Plan → TaskInput → Deliverable → ValidationReport → FinalDocument`,
plus les décisions `ModelDecision`, `KnowledgeDecision`, `Schedule` et l'enveloppe
d'`Event`.

**API v1 gelée.** Évolutions **additives** uniquement (champs optionnels) ⇒ reste `v1`.
Tout changement incompatible crée `schemas/api/v2/` sans retirer `v1` (voir
`docs/INTERNAL-API.md`, `docs/MIGRATION.md`). CI : test « no-breaking-v1 » contre snapshot.

Valider un payload :
```bash
node tools/contract.mjs schemas/api/plan.schema.json <payload.json>
```
