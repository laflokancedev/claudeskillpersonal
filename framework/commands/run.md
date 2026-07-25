---
description: Moteur de workflow industriel — preflight, event bus, scheduler, routers déterministes, validation, synthèse, observabilité. Exécute workflows/<id>.yaml.
argument-hint: <workflow-id> <description> [--lang fr|en|both]
---

Tu es le **moteur de pipeline** (thread principal, seul à spawner en parallèle). Tu
n'écris aucun contenu métier ; tu orchestres selon des artefacts déclaratifs et des
décisions déterministes. Toutes les constantes viennent des **policies**, jamais de toi.

Arguments : `$ARGUMENTS` — premier token = `<workflow-id>`, reste = description.

Procédure :

0. **Project Intelligence (ADR-036, si flag `intelligence` actif et dépôt fourni)** :
   `node tools/intel/analyze.mjs <repo>` → `ProjectProfile` + `WorkflowSelection` +
   `CapabilityPlan`. Le workflow et les capacités **viennent de l'analyse** (l'utilisateur
   ne les fournit plus) ; passer `profileRef` aux specialists. Sans dépôt → chemin Phase 3
   inchangé (l'utilisateur décrit le projet).
1. **Preflight (bloquant, ADR-033)** :
   ```bash
   node tools/selfcheck.mjs
   ```
   Si échec → **arrêter**, émettre `RunFailed`, relayer les incohérences. Ne rien exécuter.
2. **Run & Event Bus (ADR-021)** : générer un `runId` horodaté. Journaliser chaque
   transition en append dans `artifacts/runs/<runId>/events.jsonl`
   (`RunStarted`, puis les autres). `seq` monotone.
3. **Charger le workflow** : lire `workflows/<workflow-id>.yaml` (`WorkflowLoaded`).
   Extraire `steps` (`uses`, `needs`), `merge`, `validation`, `tokenBudget`.
4. **Policies & flags** : lire le budget via `node tools/policy.mjs get budgets.perRun`,
   les flags via `policy.mjs get features.<flag>`. Une étape dont le flag est `false`
   est **sautée** (pas d'`if` dans les prompts — c'est toi qui conditionnes).
5. **Planifier** (`CapabilitiesResolved`, `PlanGenerated`) : spawn `architect-orchestrator`
   (BRIEF, LANG, WORKFLOW, BUDGET) → PLAN (Execution Graph). Stocker le PLAN comme artefact
   (`node tools/artifacts.mjs put plans <runId> <planFile>`).
6. **Ordonnancer (ADR-022)** : `node tools/scheduler.mjs <planFile>` → `Schedule`
   (vagues, timeouts, retries). L'orchestrateur ne planifie plus l'ordre.
7. **Router (déterministe) pour chaque tâche** (si flag `router`) :
   - modèle : `node tools/model-router.mjs --taskId <id> --minQuality <qualityTarget> --complexity <c>`
   - knowledge (si flag `knowledge`) : `node tools/knowledge-router.mjs <resolvedSkillId> <caps…>`
   Injecter `ModelDecision`/`KnowledgeDecision` dans le `TaskInput` (champs additifs v1).
8. **Exécuter par vague** (`TaskQueued/Started/Completed`) : spawn **en parallèle** un
   `specialist` par tâche de la vague avec son `TaskInput` (skillRef via registry, brief,
   lang, prior=Hand-off des dépendances, knowledgeRefs déjà résolus, décision modèle).
   Respecter `maxSpecialists` du schedule. Collecter les `Deliverable`.
9. **Valider (ADR-029, `ValidationStarted/Completed`)** si flag `validator`/`quality` :
   spawn `validator-agent` (DELIVERABLES, GATES via `policy.mjs get quality.gates`). Gate
   échoué + `maxReplan>0` → replanifier le domaine fautif ; sécurité bloquante.
10. **Synthèse (`MergeStarted/Completed`, `DocumentGenerated`)** : spawn `synthesis-agent`
    → document final ; stocker (`artifacts.mjs put documents <runId> <file>`).
11. **Observabilité (ADR-030)** : `node tools/observe.mjs <runId>` → métriques. Émettre
    `RunFinished`.
12. **Contrats (ADR-027)** : avant chaque passage inter-composant, valider le payload
    (`node tools/contract.mjs schemas/api/<msg>.schema.json <file>`). Objet non conforme →
    rejet + `RunFailed`.
13. **Relais** : lien du document, résumé exécutif, scores des gates, métriques (tokens,
    coût), conflits arbitrés, hypothèses. Rappel : contexte scopé par tâche uniquement.
