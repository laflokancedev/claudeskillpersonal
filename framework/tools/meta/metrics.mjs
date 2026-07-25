#!/usr/bin/env node
// metrics — Metrics Engine (ADR-077). Métriques communes déterministes. LECTURE-SEULE.
// Usage: node tools/meta/metrics.mjs
import { fileURLToPath } from 'node:url';
import { introspect } from './introspect.mjs';

export function metrics() {
  const m = introspect();
  const c = m.counts;
  return {
    metaApiVersion: '1.0.0', generatedAt: new Date().toISOString(),
    metrics: {
      skills: c.skills, capabilities: c.capabilities, extensions: c.extensions,
      schemas: c.schemas, policies: c.policies, workflows: c.workflows,
      agents: c.agents, signatures: c.signatures, tools: c.tools, sdk: c.sdk,
      // Ratio de couverture contractuelle (schémas / composants exécutables) — proxy structurel.
      contractDensity: +(c.schemas / Math.max(1, c.tools + c.sdk)).toFixed(2)
    }
  };
}

if (process.argv[1]?.endsWith('metrics.mjs')) console.log(JSON.stringify(metrics(), null, 2));
