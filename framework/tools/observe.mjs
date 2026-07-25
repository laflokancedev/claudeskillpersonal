#!/usr/bin/env node
// observe — Observability (ADR-030). Agrège l'event bus (events.jsonl) d'un run en métriques
// exportables. Source unique = les événements.
// Usage: node tools/observe.mjs <runId>
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const runId = process.argv[2];
if (!runId) { console.error('Usage: observe.mjs <runId>'); process.exit(1); }

const evPath = join(ROOT, 'artifacts', 'runs', runId, 'events.jsonl');
if (!existsSync(evPath)) { console.log(`Aucun événement pour ${runId} (${evPath} absent).`); process.exit(0); }

const events = readFileSync(evPath, 'utf8').split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const byType = {};
let tokensIn = 0, tokensOut = 0, cost = 0, durationMs = 0, cacheHit = 0, knowledgeHit = 0;
for (const e of events) {
  byType[e.type] = (byType[e.type] || 0) + 1;
  const m = e.payload?.metrics || {};
  tokensIn += m.tokensIn || 0; tokensOut += m.tokensOut || 0; cost += m.estCostUsd || 0;
  durationMs += m.durationMs || 0; cacheHit += m.cacheHit ? 1 : 0; knowledgeHit += m.knowledgeHit ? 1 : 0;
}
const metrics = { runId, events: events.length, byType, tokensIn, tokensOut, estCostUsd: +cost.toFixed(4), durationMs, cacheHit, knowledgeHit };
const out = join(ROOT, 'artifacts', 'reports'); mkdirSync(out, { recursive: true });
writeFileSync(join(out, `${runId}-metrics.json`), JSON.stringify(metrics, null, 2) + '\n');
console.log(JSON.stringify(metrics, null, 2));
