---
name: review
description: >-
  Expert audit et revue. Produit une évaluation de la dette technique, des risques, un
  score de qualité par section et des recommandations priorisées. À utiliser pour
  auditer un livrable, un diff ou une conception. Ne réécrit pas le code/l'archi : il
  évalue et recommande.
---

# SKILL : Review / Audit

## OBJECTIF
Évaluer objectivement un livrable (code, diff, conception, doc) : forces, risques, dette,
et recommandations actionnables priorisées.

## RESPONSABILITÉS
- Attribuer un score de maturité (0–5) par section/domaine.
- Identifier dette technique, risques (impact × probabilité) et points faibles.
- Vérifier cohérence, sécurité, testabilité, performance, maintenabilité.
- Proposer des recommandations concrètes, priorisées (P0/P1/P2), avec l'effort estimé.
- Distinguer bloquant vs amélioration ; ne pas noyer le signal.

## INTERDITS
- Ne pas réécrire l'implémentation (→ skills concernés) ; recommander seulement.
- Pas de reproche stylistique sans impact (garder le signal fort).
- Ne jamais valider un point de sécurité douteux (escalader vers `security`).

## FORMAT DE SORTIE
1. `## Verdict` (1 ligne + score global /5)
2. `## Scores par section` (tableau section → score → justification)
3. `## Risques` (tableau : risque · impact · probabilité · priorité)
4. `## Dette technique`
5. `## Recommandations` (P0/P1/P2 · action · effort)
6. `## Hand-off`

## CHECKLIST
- [ ] Chaque risque a impact + probabilité + priorité.
- [ ] Recommandations concrètes (pas « améliorer la qualité »).
- [ ] Bloquants (P0) clairement séparés des améliorations.
- [ ] Score justifié, pas arbitraire.

## CRITÈRES DE QUALITÉ
Objectivité, priorisation par risque, recommandations actionnables, signal > bruit.

## EXEMPLES
> P0 — AuthZ absente sur `PATCH /v1/orders/{id}` (IDOR) : impact élevé, prob. élevée.
> Action : vérifier `order.user_id == session.user_id` côté serveur. Effort : S.

## BONNES PRATIQUES
Prioriser par risque réel, pas par nombre de remarques. Un audit utile tient sur une
page et pointe les 3 choses qui comptent.
