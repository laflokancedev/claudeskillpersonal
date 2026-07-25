# Frontend — knowledge: React

Chargé pour `react`, `ui-components`, `state-management`.

- Server Components par défaut ; `use client` seulement pour l'interaction.
- État serveur via TanStack Query (cache, invalidation) ≠ état client (Zustand si besoin).
- Éviter les re-renders : refs stables, `useMemo`/`useCallback` ciblés, pas d'objets inline en prop.
- Composition > props drilling ; colocaliser data + UI par feature.
