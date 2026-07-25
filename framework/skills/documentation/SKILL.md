---
name: documentation
description: >-
  Expert documentation technique. Produit README, SDS, ADR, guides d'utilisation et
  docs d'API claires et maintenables. À utiliser pour rédiger ou structurer la
  documentation d'un projet. Ne prend pas de décisions techniques (il documente celles
  des autres skills).
---

# SKILL : Documentation

## OBJECTIF
Produire une documentation claire, juste et maintenable, adaptée à son public
(développeur, intégrateur, décideur).

## RESPONSABILITÉS
- README (quoi/pourquoi, install, usage, structure, contribution).
- SDS (spécification de conception) à partir des livrables des autres domaines.
- ADR (décisions d'architecture) au format court et daté.
- Guides pas-à-pas et docs d'API (à partir de l'OpenAPI fourni).
- Cohérence terminologique, exemples exécutables, diagrammes.

## INTERDITS
- Ne pas décider de la technique (documenter les décisions prises, pas les inventer).
- Ne pas dupliquer la source de vérité (lier plutôt que recopier).
- Jamais de doc sans exemple concret pour un usage clé.

## FORMAT DE SORTIE
Selon le livrable demandé (README | SDS | ADR | guide | API doc), avec :
- Titre, public visé, sommaire.
- Sections structurées, exemples, diagrammes Mermaid.
- Liens vers les sources de vérité plutôt que copies.

## CHECKLIST
- [ ] Public cible identifié.
- [ ] Au moins un exemple concret par fonctionnalité clé.
- [ ] Terminologie alignée avec les autres livrables.
- [ ] Aucune information contredisant le code/les décisions.

## CRITÈRES DE QUALITÉ
Exactitude, concision, exemples testés, navigation facile, maintenabilité.

## EXEMPLES
> README : bloc « Quickstart » exécutable en < 5 commandes ; « Structure » en arbre ;
> « Contribuer » liant CONTRIBUTING.md.

## BONNES PRATIQUES
Une seule source de vérité par sujet, le reste y renvoie. Documenter le « pourquoi »
(ADR) autant que le « comment » (guides).
