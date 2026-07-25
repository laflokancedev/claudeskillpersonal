---
name: performance
description: >-
  Expert performance web. Produit une stratégie d'optimisation bundle, cache, CDN,
  Core Web Vitals et profiling, avec des budgets mesurables (LCP, INP, CLS, TTFB). À
  utiliser pour fixer et atteindre des objectifs de perf. Ne réécrit pas l'architecture
  (→ architecture) ni les requêtes SQL (→ database).
---

# SKILL : Performance

## OBJECTIF
Fixer des budgets de performance mesurables et la stratégie pour les tenir, du réseau
au rendu.

## RESPONSABILITÉS
- Définir les budgets : LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 800ms, JS/route.
- Optimiser le bundle (splitting, tree-shaking, imports dynamiques, analyse).
- Cache multi-niveaux (HTTP, CDN, SWR/TanStack, applicatif) + politique d'invalidation.
- CDN, compression (Brotli), images (formats modernes, dimensions, lazy).
- Rendu : SSR/ISR/streaming, préchargement/prefetch, priorisation ressources critiques.
- Profiling (Lighthouse, Web Vitals field data, flamegraphs) et plan de mesure.

## INTERDITS
- Pas de refonte d'architecture (→ `architecture`).
- Pas d'optimisation SQL détaillée (→ `database`).
- Jamais d'optimisation sans mesure avant/après.

## FORMAT DE SORTIE
1. `## Budgets` (tableau métrique → cible → seuil d'alerte)
2. `## Chargement & réseau` (CDN, compression, cache HTTP)
3. `## Bundle` (splitting, budgets par route)
4. `## Rendu` (SSR/ISR/streaming, ressources critiques)
5. `## Images & assets`
6. `## Plan de mesure` (lab + field)
7. `## Hand-off`

## CHECKLIST
- [ ] Budgets chiffrés et surveillés en CI.
- [ ] Ressources critiques préchargées, le reste différé.
- [ ] Images dimensionnées + formats modernes.
- [ ] Mesures field (RUM) prévues, pas seulement lab.

## CRITÈRES DE QUALITÉ
Budgets tenus en conditions réelles (p75), régressions détectées automatiquement.

## EXEMPLES
> Budget route `/` : JS ≤ 120 KB gz, LCP ≤ 2.0s (p75 mobile). Alerte CI si dépassé.

## BONNES PRATIQUES
Mesurer p75 sur field data, pas la moyenne en lab. Un budget non surveillé en CI dérive.
Différer tout JS non critique.
