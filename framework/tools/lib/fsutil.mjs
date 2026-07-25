// Utilitaires FS partagés (zéro dépendance).
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { createHash } from 'node:crypto';

/** Parcourt récursivement `dir` et renvoie les chemins de fichiers dont le nom = `filename`. */
export function findFiles(dir, filename, acc = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const e of entries) {
    if (e === 'node_modules' || e === '.git') continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) findFiles(p, filename, acc);
    else if (e === filename) acc.push(p);
  }
  return acc;
}

/** Parcourt récursivement `dir` et renvoie les fichiers dont le nom matche `regex`. */
export function findByRegex(dir, regex, acc = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const e of entries) {
    if (e === 'node_modules' || e === '.git') continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) findByRegex(p, regex, acc);
    else if (regex.test(e)) acc.push(p);
  }
  return acc;
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function sha256(text) {
  return 'sha256:' + createHash('sha256').update(text).digest('hex');
}

/** Chemin relatif POSIX (slashes) depuis la racine du framework. */
export function toPosix(path) {
  return path.split(sep).join('/');
}
