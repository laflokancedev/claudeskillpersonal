// Dependency Resolver (ADR-054). Tri topologique déterministe + détection missing/cycle.
export function resolveDeps(manifests, sdkApiVersion = '1.0.0') {
  const byName = new Map(manifests.map((m) => [m.name, m]));
  const order = [], state = new Map(); // 1=en cours, 2=fini
  const errors = [];

  function visit(name, stack = []) {
    if (state.get(name) === 2) return;
    if (state.get(name) === 1) { errors.push(`cycle: ${[...stack, name].join(' → ')}`); return; }
    const m = byName.get(name);
    if (!m) { errors.push(`dépendance introuvable: ${name}`); return; }
    state.set(name, 1);
    for (const d of m.dependencies || []) visit(d.name, [...stack, name]);
    state.set(name, 2);
    order.push(name);
  }
  for (const m of manifests) visit(m.name);
  if (errors.length) throw new Error(errors.join(' ; '));

  return {
    sdkApiVersion, generatedAt: new Date().toISOString(),
    resolved: order.map((n) => { const m = byName.get(n); return { name: n, version: m.version, source: m._source || 'local', sdk: m.sdk }; }),
    order
  };
}
