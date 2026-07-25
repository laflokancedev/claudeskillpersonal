# Backend — knowledge: overview

Chargé pour `queues`, `caching`.

- Jobs **idempotents** (clé d'idempotence), retries bornés + DLQ, timeouts aux I/O.
- Cache : définir quoi/où/TTL/invalidation ; ne jamais cacher de données sensibles en clair.
- Logs structurés JSON corrélés (trace id) ; secrets hors code (env / secret manager).
- Dépendances dirigées vers le domaine → testable sans infra.
