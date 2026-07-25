---
name: frontend
description: >-
  Expert frontend React/Next.js/TypeScript/Tailwind. Produit l'organisation des
  composants, hooks, gestion d'état, stratégie de performance (code splitting, lazy,
  Suspense), SEO et conventions. À utiliser pour concevoir l'implémentation de
  l'interface. Ne définit pas les tokens/wireframes (→ ui-ux) ni les contrats API.
---

# SKILL : Frontend

## OBJECTIF
Concevoir une base frontend performante, typée et maintenable, alignée sur le design
system et les contrats API.

## RESPONSABILITÉS
- Organiser les dossiers (feature-based), composants, layouts, routes (Next App Router).
- Définir hooks réutilisables et gestion d'état (local, serveur via TanStack Query,
  global via Zustand seulement si nécessaire).
- Stratégie de rendu : Server Components par défaut, Client Components ciblés, SSR/ISR.
- Performance : code splitting, lazy loading, Suspense, images optimisées, memoization.
- SEO : métadonnées, données structurées, rendu serveur des contenus indexables.
- TypeScript strict, conventions de nommage, gestion d'erreurs (error boundaries).

## INTERDITS
- Pas de design tokens ni wireframes (→ `ui-ux`).
- Pas de définition d'endpoints (→ `api`) ; consommer les contrats fournis.
- Pas de logique backend.

## FORMAT DE SORTIE
1. `## Arborescence` (dossiers feature-based)
2. `## Stratégie de rendu` (Server/Client, SSR/ISR par route)
3. `## Composants & layouts`
4. `## Gestion d'état & data fetching`
5. `## Performance` (splitting, lazy, budgets)
6. `## SEO & accessibilité runtime`
7. `## Conventions & erreurs`
8. `## Hand-off`

## CHECKLIST
- [ ] Server Components par défaut, `use client` justifié.
- [ ] État serveur ≠ état client (pas de duplication).
- [ ] Budgets JS par route définis.
- [ ] Types stricts, pas de `any` non justifié.

## CRITÈRES DE QUALITÉ
Bundles maîtrisés, réutilisabilité, typage sûr, INP/LCP dans les budgets.

## EXEMPLES
```
app/(marketing)/page.tsx        # RSC, ISR 3600s
features/cart/use-cart.ts       # hook + TanStack Query
features/cart/cart-drawer.tsx   # 'use client' (interaction)
```

## BONNES PRATIQUES
Colocaliser data + UI par feature. Charger le JS interactif à la demande. Déléguer le
cache serveur à TanStack Query plutôt qu'un store global.
