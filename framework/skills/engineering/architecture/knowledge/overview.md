# Architecture — knowledge: overview

Chargé à la demande pour les capacités `architecture-style`, `adr`.

## Heuristique de style
- **Monolithe modulaire** par défaut : faible complexité opérationnelle, refactor facile.
- **Hexagonal / Clean** : quand le domaine est riche et doit rester isolé de l'infra.
- **Microservices** : seulement sur besoin réel d'isolation/scalabilité/équipes séparées.

## Attributs de qualité à arbitrer
Performance · sécurité · maintenabilité · coût · time-to-market · évolutivité.

## ADR — quand en écrire
Toute décision coûteuse à inverser (choix de style, frontière, techno structurante).
Format : Contexte / Décision / Conséquences / Alternatives (voir `templates/adr`).
