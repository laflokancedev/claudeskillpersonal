# schemas/events/

Enveloppe d'événement de l'**Event Bus (ADR-021)** : `event-envelope.schema.json`.
Chaque événement partage l'enveloppe `{ eventId, type, runId, seq, ts, payload }` ; le
champ `type` discrimine parmi les 14 événements. Payloads indicatifs par type :

| type | payload |
|------|---------|
| `RunStarted` | `{ workflow, inputs }` |
| `WorkflowLoaded` | `{ workflow, steps }` |
| `CapabilitiesResolved` | `{ capabilities[] }` |
| `PlanGenerated` | `{ planRef, taskCount }` |
| `TaskQueued` / `TaskStarted` / `TaskCompleted` | `{ taskId, skillId, status?, metrics? }` |
| `ValidationStarted` / `ValidationCompleted` | `{ scores?, verdict? }` |
| `MergeStarted` / `MergeCompleted` | `{ outfile? }` |
| `DocumentGenerated` | `{ artifactId, outfile }` |
| `RunFinished` | `{ metricsRef }` |
| `RunFailed` | `{ error, stage }` |

Le bus est **append-only** (`artifacts/runs/<runId>/events.jsonl`), `seq` monotone.
`metrics` (tokens, coût, durée, cacheHit, knowledgeHit) alimente `tools/observe.mjs`.
