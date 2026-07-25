#!/usr/bin/env node
// scan — Repository Scanner (ADR-037). Inventaire déterministe, AUCUNE interprétation.
// Usage: node tools/intel/scan.mjs [repoRoot] [--out file]
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, extname, relative, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { parseYaml } from '../lib/yaml.mjs';

const FRAMEWORK = fileURLToPath(new URL('../..', import.meta.url));
const sha = (b) => 'sha256:' + createHash('sha256').update(b).digest('hex');
const MANIFESTS = ['package.json', 'pyproject.toml', 'go.mod', 'Cargo.toml', 'pom.xml', 'requirements.txt', 'plugin.json', 'marketplace.json', 'tsconfig.json'];

export function scanRepo(root, policy = {}) {
  const deny = new Set(policy.scan?.denylist || ['node_modules', '.git', 'artifacts', 'reports', 'cache']);
  const ignoreExt = new Set(policy.scan?.ignoreExtensions || ['.png', '.jpg', '.gif', '.lock']);
  const maxBytes = policy.scan?.maxFileBytes || 524288;
  const files = [], extensions = {}, manifests = [], licenses = [];

  (function walk(dir) {
    for (const e of readdirSync(dir).sort()) {
      if (deny.has(e)) continue;
      const p = join(dir, e);
      const st = statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      const ext = extname(e).toLowerCase();
      const rel = relative(root, p).split('\\').join('/');
      extensions[ext || '(none)'] = (extensions[ext || '(none)'] || 0) + 1;
      let hash;
      if (!ignoreExt.has(ext) && st.size <= maxBytes) hash = sha(readFileSync(p));
      else hash = `size:${st.size}`;
      files.push({ path: rel, ext: ext || '', size: st.size, hash });
      if (MANIFESTS.includes(e)) manifests.push(rel);
      if (/^LICENSE/i.test(e)) { try { if (/MIT/.test(readFileSync(p, 'utf8'))) licenses.push('MIT'); } catch {} }
    }
  })(root);

  files.sort((a, b) => a.path.localeCompare(b.path));
  const contentHash = sha(files.map((f) => f.path + ':' + f.hash).join('\n'));
  return {
    apiVersion: '1.0.0', root: root.split('\\').join('/'), contentHash, generatedAt: new Date().toISOString(),
    totalFiles: files.length, totalBytes: files.reduce((a, f) => a + f.size, 0),
    extensions, files, manifests, licenses: [...new Set(licenses)]
  };
}

if (process.argv[1]?.endsWith('scan.mjs')) {
  const root = process.argv[2] ? join(process.cwd(), process.argv[2]) : FRAMEWORK;
  let policy = {};
  try { policy = { scan: parseYaml(readFileSync(join(FRAMEWORK, 'policies/intelligence.yaml'), 'utf8')).scan }; } catch {}
  const inv = scanRepo(root, policy);
  const oi = process.argv.indexOf('--out');
  if (oi > -1) { writeFileSync(process.argv[oi + 1], JSON.stringify(inv, null, 2)); console.log(`inventory → ${process.argv[oi + 1]} (${inv.totalFiles} fichiers, hash ${inv.contentHash.slice(0, 20)}…)`); }
  else console.log(JSON.stringify(inv, null, 2));
}
