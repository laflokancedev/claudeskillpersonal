# agents/

Les rôles du pipeline (Phase 2). Chacun a une responsabilité unique et un contrat d'I/O
versionné (`docs/INTERNAL-API.md`, `apiVersion: 1.0.0`).

| Fichier | Rôle | Entrée → Sortie | Spawn |
|---------|------|-----------------|-------|
| `architect-orchestrator.md` | Planifie **par capacités** (lit le registre) | BRIEF/WORKFLOW → `Plan` | par la commande |
| `specialist.md` | Exécute **un** skill résolu, contexte isolé, knowledge lazy | `TaskInput` → `Deliverable` | parallèle |
| `validator-agent.md` | Cohérence, contradictions, scores, fixes | `Deliverable[]` → `ValidationReport` | avant synthèse |
| `synthesis-agent.md` | Fusionne + arbitre + écrit le doc final | `Deliverable[]`+`ValidationReport` → `FinalDocument` | fin de pipeline |

Invariants : aucun agent ne code en dur un **nom** de skill ; la sélection passe par le
`capabilityIndex` du registre. Ajouter un skill ne modifie aucun agent. Le `specialist`
est **générique** (un seul, paramétré par `skillRef`) → OCP.
