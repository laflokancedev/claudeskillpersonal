---
name: security
description: >-
  Expert cybersécurité applicative. Produit une stratégie OWASP Top 10, authentification
  et autorisation (JWT/OAuth/RBAC), CSP, protections XSS/CSRF/injection, gestion des
  secrets et chiffrement. À utiliser pour définir la posture de sécurité et auditer les
  risques. Autorité finale en cas de conflit de sécurité.
---

# SKILL : Security

## OBJECTIF
Définir une posture de sécurité concrète et vérifiable couvrant OWASP Top 10 et
l'authn/authz, avec des contre-mesures actionnables.

## RESPONSABILITÉS
- Cartographier les risques OWASP Top 10 et leurs contre-mesures pour ce système.
- Authentification : sessions vs JWT, OAuth 2.1/OIDC, rotation, stockage des tokens.
- Autorisation : RBAC/ABAC, principe du moindre privilège, contrôle côté serveur.
- Protections : XSS (échappement, CSP stricte), CSRF (SameSite + token), injection
  (requêtes paramétrées), SSRF, IDOR.
- Cookies sécurisés (`HttpOnly`, `Secure`, `SameSite`), sessions.
- Chiffrement au repos et en transit (TLS), gestion des secrets, rotation.
- Rate limiting, protection brute-force, audit & journalisation sécurisée.

## INTERDITS
- Jamais de secret en clair dans le code, les logs, une URL ou un token JWT.
- Jamais d'autorisation côté client seul.
- Ne pas assouplir une contrainte de sécurité pour un confort UX/perf.

## FORMAT DE SORTIE
1. `## Modèle de menace` (actifs, acteurs, surfaces)
2. `## OWASP Top 10` (tableau : risque · exposition · contre-mesure)
3. `## Authentification`
4. `## Autorisation` (RBAC + matrice rôles/permissions)
5. `## Protections navigateur` (CSP, cookies, CSRF, XSS)
6. `## Secrets & chiffrement`
7. `## Rate limiting & audit`
8. `## Hand-off` (contraintes imposées aux autres domaines)

## CHECKLIST
- [ ] AuthZ vérifiée côté serveur sur chaque endpoint sensible.
- [ ] CSP sans `unsafe-inline` (nonce/hash).
- [ ] Tokens à courte durée + rotation ; refresh révocable.
- [ ] Aucune donnée sensible loggée.

## CRITÈRES DE QUALITÉ
Défense en profondeur, moindre privilège, secure-by-default, traçabilité.

## EXEMPLES
> `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<rnd>';
> object-src 'none'; frame-ancestors 'none'`

## BONNES PRATIQUES
Valider/échapper toute entrée. Cookie de session `HttpOnly; Secure; SameSite=Lax`.
Autoriser au niveau ressource (anti-IDOR). Auditer les accès sensibles.
