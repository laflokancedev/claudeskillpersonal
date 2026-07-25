#!/usr/bin/env node
// introspect — Framework Introspection (ADR-066). Le framework vu comme un projet analysable.
// LECTURE-SEULE. Sortie = FrameworkModel. Usage: node tools/meta/introspect.mjs
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { findByRegex, readJson } from '../lib/fsutil.mjs';
import { discover } from '../../sdk/loader.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));
const countIn = (dir, re) => existsSync(join(FRAMEWORK, dir)) ? findByRegex(join(FRAMEWORK, dir), re).length : 0;

export function introspect() {
  const reg = existsSync(join(FRAMEWORK, 'skills/registry.json')) ? readJson(join(FRAMEWORK, 'skills/registry.json')) : { skills: [], capabilityIndex: {} };
  const extensions = discover().map((m) => ({ name: m.name, version: m.version, kind: m.kind || 'extension' }));
  const counts = {
    skills: reg.skills.length,
    capabilities: Object.keys(reg.capabilityIndex).length,
    extensions: extensions.length,
    agents: countIn('agents', /\.md$/),
    commands: countIn('commands', /\.md$/),
    workflows: countIn('workflows', /\.ya?ml$/),
    policies: countIn('policies', /\.ya?ml$/),
    signatures: countIn('signatures', /\.ya?ml$/),
    schemas: countIn('schemas', /\.json$/),
    tools: countIn('tools', /\.mjs$/),
    sdk: countIn('sdk', /\.mjs$/)
  };
  return {
    metaApiVersion: '1.0.0', generatedAt: new Date().toISOString(),
    counts,
    components: {
      skills: reg.skills.map((s) => s.id),
      extensions,
      capabilities: Object.keys(reg.capabilityIndex).sort()
    }
  };
}

if (process.argv[1]?.endsWith('introspect.mjs')) console.log(JSON.stringify(introspect(), null, 2));
