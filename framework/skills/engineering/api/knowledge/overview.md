# API — knowledge: overview

Chargé pour `error-format`, `pagination`, `idempotency`.

- Erreurs uniformes : RFC 9457 `application/problem+json`.
- Pagination **cursor** par défaut (scalable) ; tri + filtres cohérents sur les collections.
- Idempotence : header `Idempotency-Key` sur les mutations rejouables.
- Codes : 201 création, 204 sans corps, 409 conflit, 422 validation. Collections au pluriel.
- Rétrocompat : ne jamais casser `v1` → introduire `v2`.
