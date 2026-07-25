---
description: Project Intelligence — analyse déterministe d'un dépôt (scan, technologies, graphe, profil) AVANT toute orchestration. Produit un ProjectProfile, choisit le workflow et les capacités.
argument-hint: [repoRoot] [--run] [--lang fr|en|both]
---

Comprendre automatiquement un dépôt avant d'orchestrer. **Aucune IA par défaut**
(déterministe ; l'IA de jugement est gated dans `policies/intelligence.yaml`).

Procédure :

1. Lancer l'analyse (coordinateur ADR-036) :
   ```bash
   node tools/intel/analyze.mjs $ARGUMENTS
   ```
   Enchaîne : scan → technologies (signatures) → graphe → ProjectProfile, réutilise la
   Project Memory si le dépôt est inchangé (hash), applique le Change Detector sinon.
2. **Relayer** : langages, frameworks, architecture (+ confiance), taille, risques, le
   **workflow choisi** + justification (Workflow Resolver) et les **capacités** retenues
   (Capability Planner).
3. Si `--run` : enchaîner `/run <workflowId> <objectif>` en passant `profileRef` (le
   `ProjectProfile` en mémoire) — les specialists ne redécouvrent plus le projet.

Le `ProjectProfile` est l'entrée principale des specialists (`TaskInput.profileRef`,
champ additif — l'API v1 reste intacte).
