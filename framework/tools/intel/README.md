# tools/intel/

Couche **Project Intelligence** (Phase 4). Outils **déterministes** : ils comprennent un
dépôt à partir de l'inventaire + des signatures + des policies, **sans IA** (l'IA est
optionnelle et gated dans `policies/intelligence.yaml`). Tous produisent des contrats
`schemas/intel/*`.

| Script | ADR | Rôle |
|--------|-----|------|
| `scan.mjs` | 037 | Repository Scanner — inventaire brut + `contentHash` |
| `detect-tech.mjs` | 038 | Technology Detector — applique `signatures/*` |
| `build-graph.mjs` | 039 | Project Graph (manifest+convention) |
| `build-profile.mjs` | 040 | assemble le ProjectProfile |
| `plan-capabilities.mjs` | 041 | Capability Planner (mapping déclaratif) |
| `resolve-workflow.mjs` | 042 | Workflow Resolver (règles déclaratives) |
| `change-detector.mjs` | 045 | diff de deux inventaires (hashes) |
| `project-memory.mjs` | 044 | cache profils/inventaires par `contentHash` |
| `analyze.mjs` | 036 | **coordinateur** : enchaîne tout, réutilise la mémoire |

Entrée principale : `node tools/intel/analyze.mjs [repoRoot]` → résumé (profil, workflow,
capacités). Les specialists reçoivent ensuite le `ProjectProfile` via `TaskInput.profileRef`.

Stubs (Phase 4 complète) : `detect-arch`, `project-health`, `intelligence-report`,
`semantic-index`, `resolve-resources`, `plan-execution`. Reproductibilité : même
`contentHash` ⇒ mêmes artefacts.
