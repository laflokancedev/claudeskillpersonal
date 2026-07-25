# tools/

Scripts déterministes **tooling-time** (Node ESM, zéro dépendance). Loi de placement :
déterministe → tooling ; jugement → prompt ; constantes/règles → déclaratif (`policies/`,
`features/`). Voir ADR-001 et ADR-020→035.

## Phase 2 (base)
| Script | Rôle |
|--------|------|
| `build-registry.mjs` | `skills/**/skill.json` → `skills/registry.json` (+ `--check`) |
| `validate.mjs` | manifestes + fraîcheur registry + workflows (DAG, capacités) |
| `gen-docs.mjs` | `docs/generated/` (inventaires + graphes) |
| `report.mjs` | agrège les traces d'un run |
| `scaffold.mjs` | génère skill/workflow/agent/command/template |

## Phase 3 (industrialisation)
| Script | ADR | Rôle |
|--------|-----|------|
| `policy.mjs` | 020 | Policy Engine — résout une clé avec précédence (`get`, `dump`) |
| `scheduler.mjs` | 022/023 | Execution Graph → Schedule (vagues, barrières, retries) |
| `model-router.mjs` | 024 | choisit le modèle depuis `policies/models.yaml` |
| `knowledge-router.mjs` | 025 | sélectionne les knowledge utiles (capacités ∩) |
| `artifacts.mjs` | 026 | Artifact Store (`put/get/list`, hash + métadonnées) |
| `contract.mjs` | 027 | mini-validateur de contrats (schéma ⇄ payload) |
| `observe.mjs` | 030 | agrège l'event bus → métriques |
| `depgraph.mjs` | 032 | graphe de dépendances (Mermaid + JSON) |
| `selfcheck.mjs` | 033 | **preflight bloquant** avant tout run |
| `score.mjs` | 035 | Architecture Score (structurel, expliqué) |

`lib/` : `fsutil.mjs`, `yaml.mjs` (sous-ensemble). Prérequis : Node ≥ 18 (testé 24).
Les commandes `/run`, `/sync`, `/new-*` enveloppent ces scripts. En CI, `selfcheck.mjs`
est bloquant.
