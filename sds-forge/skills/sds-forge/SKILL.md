---
name: sds-forge
description: >-
  Utiliser quand l'utilisateur demande une spécification technique complète d'un
  projet web : "SDS", "software design specification", "design doc", "spec complète",
  "blueprint d'architecture", "document d'architecture", "cahier technique",
  "spec production-ready", ou décrit un produit/plugin web et veut une conception de
  bout en bout (architecture, stack, backend, frontend, UI/UX, API, modèle de
  données, sécurité, performance, IA/tokens, déploiement, tests, roadmap). Ne pas
  utiliser pour une simple question ponctuelle sur une seule techno.
---

# SDS-Forge

Génère une **Software Design Specification** production-ready via le sous-agent
`sds-architect`, qui applique une méthode en 16 étapes et écrit le résultat dans un
fichier `.md`.

## Quand se déclencher
L'utilisateur veut une conception technique complète / SDS / design doc / blueprint
d'un projet web, ou décrit un produit et demande "comment le construire" de A à Z.

## Quoi faire
1. Déterminer la **langue de sortie** : `fr`, `en`, ou `both` (bilingue) — défaut =
   langue de la demande.
2. Extraire le **BRIEF** (description du projet) depuis le message. Si absent ou trop
   vague sur l'essentiel, poser 1–3 questions ciblées avant de lancer.
3. Choisir un `OUTFILE` : `./SDS-<slug>.md`.
4. **Lancer le sous-agent `sds-architect`** (outil Agent/Task) avec `BRIEF`, `LANG`,
   `OUTFILE`. Le sous-agent isole le gros contexte et écrit le document.
5. **Relayer** à l'utilisateur : lien vers le fichier, résumé exécutif, stack
   recommandée, hypothèses `HYP-n`, questions ouvertes. Ne pas recopier tout le doc.

## Équivalent explicite
Identique à la commande `/sds <description> [--lang fr|en|both]`. La skill sert au
déclenchement automatique quand l'utilisateur ne tape pas la commande.
