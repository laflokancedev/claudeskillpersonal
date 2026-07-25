# Contribuer à `dev-crew`

Merci de contribuer ! Ce framework vise à devenir une référence de conception assistée
par IA dans Claude Code. La cohérence prime.

## Périmètre d'une contribution

- **Nouveau skill** → suivre `docs/ADDING-A-SKILL.md`.
- **Amélioration d'un skill** → rester rétrocompatible sur le `FORMAT DE SORTIE`.
- **Agent / orchestration** → toucher au cœur ; exige une revue attentive et un ADR.
- **Docs / templates** → bienvenues, garder concis.

## Règles

1. Respecter `docs/CONVENTIONS.md` (nommage, structure, langue).
2. Un skill reste **court, spécialisé, sans ambiguïté** (< 80 lignes).
3. Pas de duplication d'expertise entre skills : lier plutôt que recopier.
4. Toute décision structurante → un ADR (`templates/ADR.template.md`).
5. Mettre à jour `CHANGELOG.md` (format Keep a Changelog) et bump SemVer si contrat
   modifié (`plugin.json` + `marketplace.json` synchronisés).

## Processus

1. Brancher (`feat/<skill>` ou `fix/<sujet>`).
2. Vérifier localement : le skill se charge, la commande route vers le bon skill.
3. Auto-audit avec `/review` sur le diff.
4. PR avec description : quoi, pourquoi, impact sur le périmètre des skills voisins.

## Definition of Done

- [ ] Structure et nommage conformes.
- [ ] Périmètre disjoint validé.
- [ ] Docs + CHANGELOG à jour.
- [ ] Exemple concret fourni.
- [ ] Aucune modification non déclarative d'un skill existant (sauf refonte assumée+ADR).
