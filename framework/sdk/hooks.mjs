// Hook System (ADR-056). Dispatch déterministe, handlers purs (renvoient un delta contractuel).
export const KNOWN_HOOKS = [
  'beforeScan', 'afterScan', 'beforeWorkflow', 'afterWorkflow',
  'beforeSpecialist', 'afterSpecialist', 'beforeMerge', 'afterMerge',
  'beforeReport', 'afterReport'
];

const registry = new Map();

export function registerHook(name, handler, priority = 50) {
  if (!KNOWN_HOOKS.includes(name)) throw new Error(`hook inconnu: ${name}`);
  if (typeof handler !== 'function') throw new Error('handler doit être une fonction');
  if (!registry.has(name)) registry.set(name, []);
  registry.get(name).push({ handler, priority });
}

// Dispatch pur : chaque handler reçoit une copie et renvoie un delta fusionné dans le payload.
export function dispatch(name, payload = {}) {
  const handlers = (registry.get(name) || []).slice().sort((a, b) => a.priority - b.priority);
  let p = { ...payload };
  for (const h of handlers) { const delta = h.handler({ ...p }) || {}; p = { ...p, ...delta }; }
  return p;
}

export const known = () => [...KNOWN_HOOKS];
export const clear = () => registry.clear();
export const count = (name) => (registry.get(name) || []).length;
