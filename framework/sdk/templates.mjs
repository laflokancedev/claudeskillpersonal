// Template Engine (ADR-060). Substitution pure {{var}} — aucune exécution arbitraire.
import { readFileSync } from 'node:fs';

export function render(templateStr, vars = {}) {
  return templateStr.replace(/{{\s*([\w.]+)\s*}}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function renderFile(path, vars = {}) {
  return render(readFileSync(path, 'utf8'), vars);
}
