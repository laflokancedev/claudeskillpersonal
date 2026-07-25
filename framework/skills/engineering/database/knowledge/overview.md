# Database — knowledge: overview

Chargé pour `indexing`, `migrations`.

- Index justifiés par une requête réelle (B-tree, partiel, GIN pour JSONB/recherche).
- Chaque FK : contrainte + index si utilisée en jointure/filtre.
- Types précis : `timestamptz`, `numeric`/entier (cents) pour la monnaie.
- Migrations **expand → migrate → contract** (zéro-downtime), réversibles, testées.
- Pagination keyset sur les grosses tables ; mesurer (EXPLAIN) avant de dénormaliser.
