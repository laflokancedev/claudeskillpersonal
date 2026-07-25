# Changelog

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).
Versionnement [SemVer](https://semver.org/lang/fr/).

## [Unreleased]

## [6.0.0] - 2026-07-25
### Added (Meta-Framework — vertical slice « meta-core déterministe »)
- **Couche méta lecture-seule** : le framework s'analyse lui-même et **propose** ses
  évolutions, sans jamais modifier son code. Décision humaine.
- **Framework Introspection** (ADR-066) → `FrameworkModel`. **Technical Debt Engine** (ADR-072,
  skills inutilisés, fichiers dupliqués). **Metrics Engine** (ADR-077).
- **Impact Analyzer** (ADR-069, dépendances inverses). **Compatibility Analyzer** (ADR-070) —
  **prouve** l'absence de régression par diff de snapshot (API v1 + surface SDK).
- **Self Evolution Report** (ADR-080) : rapport unique agrégé + propositions `PROPOSED`.
- Schémas `schemas/meta/*` (`metaApiVersion` 1.0.0, famille séparée), policies
  `metrics/evolution/governance`, dossier `proposals/`, commande `/evolve`, flag `meta`.
### Changed
- `framework.config.json` expose `metaApiVersion`. `selfcheck` vérifie les schémas méta.
### Compatibility
- **Read-only prouvé** : les outils méta n'écrivent que dans `proposals/` et `artifacts/meta/`.
  **API v1 + SDK gelés** (famille méta séparée, snapshot de compatibilité). Couche derrière le
  flag `meta` ⇒ désactivée = Phase 5 stricte. Stubs : evolution-engine, adr-gen, roadmap,
  advisor, benchmark, release-planner, governance-state, continuous-evaluation, meta-knowledge.

## [5.0.0] - 2026-07-25
### Added (Ecosystem & SDK — vertical slice « Core SDK »)
- **Plugin SDK** (`sdk/`, `sdkApiVersion` 1.0.0) : **seule API publique** (`sdk/index.mjs`) —
  `contracts, policy, registry, hooks, templates, define*`. Les extensions importent
  uniquement le SDK ; l'accès aux internes est interdit.
- **Extension Manifest** (`extension.json`) + schémas `schemas/sdk/*` (manifest, lockfile,
  validation-report, hook-registration, template-descriptor).
- **Extension Loader** (ADR-053) : découverte `extensions/`, validation, résolution, lockfile.
- **Dependency Resolver** (ADR-054, tri topologique) · **Validation SDK** (ADR-061) ·
  **Hook System** (ADR-056, dispatch pur) · **Template Engine** (ADR-060) · **SDK Generator**
  `new-extension` (ADR-064).
- **Sandbox contractuel** (ADR-062) : permissions déclarées + validation (no-core-import/write)
  + garde-fous policies.
- Extension d'exemple `extensions/hello-pack` (skill `documentation.greeter` + hook `afterScan`).
- `build-registry` découvre aussi `extensions/**/skill.json` (additif). Flag `extensions`,
  policy `marketplace.yaml`, commandes `/ext`, `/new-extension`.
### Changed
- `framework.config.json` expose `sdkApiVersion`. Le cœur devient privé ; nouvelles capacités
  = extensions.
### Compatibility
- **API v1 gelée** ; le SDK est une **nouvelle famille versionnée** séparée. Loader désactivable
  (flag `extensions`) ⇒ comportement Phase 4 strict. Stubs : service-container, marketplace
  distant, lifecycle complet, governance (Phase 5 complète).

## [4.0.0] - 2026-07-25
### Added (Project Intelligence — vertical slice « core déterministe »)
- **Couche Project Intelligence** en tête de pipeline : le framework comprend un dépôt
  avant de choisir un workflow ; les specialists reçoivent un `ProjectProfile` prêt.
- **Repository Scanner** (ADR-037) déterministe + `contentHash` reproductible.
- **Technology Detector** (ADR-038) + **Architecture** via **signatures déclaratives**
  (`signatures/*.yaml`) : reconnaître = ajouter un YAML.
- **Project Graph** (ADR-039) manifest+convention ; **ProjectProfile** (ADR-040) versionné.
- **Capability Planner** (ADR-041) + **Workflow Resolver** (ADR-042) pilotés par policies.
- **Project Memory** (ADR-044, réutilisation si inchangé) + **Change Detector** (ADR-045).
- **Project Analyzer** coordinateur (ADR-036) : `tools/intel/analyze.mjs`.
- Schémas `schemas/intel/*` (9), policies `intelligence/capability-mapping/workflow-selection`,
  flag `intelligence`, commande `/analyze`.
### Changed
- `/run` intègre une étape 0 Project Intelligence (si dépôt + flag). `selfcheck` vérifie
  signatures + schémas intel.
- Contrats v1 étendus **additivement** : `TaskInput.profileRef?`, `plan.intentRef?`.
### Compatibility
- **API v1 gelée**, aucune évolution cassante. Couche derrière le flag `intelligence` :
  désactivée ⇒ pipeline Phase 3 inchangé. Stubs : architecture-detector, project-health,
  intelligence-report, semantic-index, resource/execution planner (Phase 4 complète).

## [3.0.0] - 2026-07-25
### Added (industrialisation — vertical slice « core »)
- **Policy Engine** (ADR-020) : `policies/*.yaml` + `tools/policy.mjs` (précédence). Toutes
  les constantes sortent des agents ; `framework.config.json` devient un shim.
- **Event Bus** (ADR-021) : `artifacts/runs/<runId>/events.jsonl` append-only, 14 événements
  + enveloppe schématisée.
- **Scheduler** (ADR-022) + **Execution Graph** (ADR-023) : `tools/scheduler.mjs` construit
  le DAG et les vagues ; champs de plan additifs (dependencies, priority, estimated*, qualityTarget).
- **Model Router** (ADR-024) + **Knowledge Router** (ADR-025) déterministes (`tools/*`).
- **Artifact Store** (ADR-026), **Contract Engine** (ADR-027, mini-validateur), **Feature
  Flags** (ADR-031), **Observability** (ADR-030), **Dependency Graph** (ADR-032),
  **Self-Validation** preflight (ADR-033), **Architecture Score** structurel (ADR-035).
- Dossiers `policies/`, `features/`, `contracts/`, `artifacts/`, `sdk/` (stub), `extensions/`.
- Schémas : `api/{model-decision,knowledge-decision,schedule}`, `artifact`, `events/*`, `features`.
- Docs : PHASE3-INDUSTRIAL-ARCHITECTURE (ADR-020→035), POLICIES, EVENTS.
### Changed
- Commande `/run` réécrite en moteur industriel (preflight → events → scheduler → routers →
  validation → synthèse → observabilité).
- Contrats v1 étendus **additivement** (champs optionnels) — **aucun breaking**.
### Compatibility
- **API v1 gelée.** Toute évolution incompatible créera `schemas/api/v2/`. Stub SDK /
  Quality Engine / Architecture Score à compléter (Phase 3 complète).

## [2.0.0] - 2026-07-25
### Added
- **Plateforme** : passage d'une collection de skills à une plateforme extensible.
- Registre central `skills/registry.json` (généré) + index de capacités ; sélection
  **par capacités**, plus aucun nom de skill en dur dans l'orchestrateur.
- Manifeste `skill.json` par skill + JSON Schemas (`schemas/`), config `framework.config.json`.
- Moteur de workflows déclaratif (`workflows/*.yaml`) + commande `/run`.
- Agent `validator-agent` (avant synthèse) + quality gates chiffrés.
- Tooling déterministe Node (`tools/`) : `build-registry`, `validate`, `gen-docs`,
  `report`, `scaffold` (+ parseur YAML minimal).
- Commandes `/sync`, `/new-skill|workflow|agent|command|template` (scaffolding).
- Sous-systèmes `memory/`, `cache/`, `reports/` (observabilité, traces).
- API interne v1 documentée (`docs/INTERNAL-API.md`) + `docs/MIGRATION.md`.
- Taxonomie par catégories ; migration de la catégorie `engineering` (architecture,
  frontend, backend, database, api) avec manifestes + knowledge packs.
### Changed
- Agents `architect-orchestrator`, `specialist`, `synthesis-agent` réécrits pour les
  contrats versionnés et la résolution via registre (path/entry, plus de chemin fixe).
### Migration
- Voir `docs/MIGRATION.md` (expand → move → migrate → contract). Catégories restantes
  (design, operations, quality, documentation, ai) à migrer sans modifier les agents.

## [0.1.0] - 2026-07-25
### Added
- Structure initiale du plugin `dev-crew` (`.claude-plugin/plugin.json`, `marketplace.json`).
- Agent orchestrateur `architect-orchestrator` (planificateur, renvoie un PLAN JSON).
- Agent runner générique `specialist` (exécute n'importe quel skill en contexte isolé).
- Agent `synthesis-agent` (fusion, déduplication, harmonisation).
- 13 skills experts : architecture, ui-ux, frontend, backend, api, database, security,
  performance, devops, testing, ai, documentation, review.
- 15 commandes : orchestrate, sds, architecture, ui, frontend, backend, api, database,
  security, performance, devops, testing, ai, docs, review.
- Templates (`skill`, `agent`, `command`, `ADR`).
- Documentation : ARCHITECTURE, ORCHESTRATION, CONTEXT-MANAGEMENT, CONVENTIONS,
  ADDING-A-SKILL, CONTRIBUTING.

[Unreleased]: https://github.com/cmm07t83/dev-crew/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/cmm07t83/dev-crew/releases/tag/v0.1.0
