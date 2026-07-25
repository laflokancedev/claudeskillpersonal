# Gestion du contexte & optimisation des tokens

Règle d'or : **aucun agent ne reçoit le contexte complet.** Chaque expert ne voit que ce
dont il a besoin pour sa tâche.

## 1. Périmètre de contexte par étape

| Étape | Reçoit | Ne reçoit pas |
|-------|--------|---------------|
| Orchestrateur | Le brief utilisateur + la liste des skills | Le contenu des skills, les fichiers |
| Specialist | `BRIEF` scopé, `FILES` utiles, `PRIOR` (résumés) | L'historique, les autres livrables complets |
| Synthesis | Les livrables + l'objectif | Les fichiers sources, l'historique |

## 2. Stratégies

### Résumé (Hand-off)
Chaque `specialist` termine par un bloc `## Hand-off` compact. **Seul ce bloc** est
propagé aux tâches dépendantes — pas le livrable entier. Compression typique 5–10×.

### Compression
Les briefs sont réécrits par l'orchestrateur au strict nécessaire. Les fichiers sont
passés par **chemin**, lus à la demande (et partiellement) par le specialist.

### Mémoire
- **Court terme** : les blocs `Hand-off` du run courant.
- **Long terme** (optionnel) : persister le document final et les ADR dans le dépôt ;
  les runs suivants les référencent par chemin plutôt que par recopie.

### Cache
- **Prompt caching** : les prompts système des skills sont **stables** → préfixes
  cachés, tokens d'entrée facturés fortement réduits sur les appels répétés.
- **Réutilisation** : un livrage de domaine inchangé n'est pas régénéré ; on réutilise
  le `.md` existant (comparer le brief au précédent).

### Contexte glissant
Sur une session longue, ne conserver que : objectif + derniers `Hand-off` + décisions
ouvertes. Les détails clos sont archivés dans le fichier de sortie.

## 3. Interdits (anti-gaspillage)

- ❌ Passer tout l'historique de conversation à un specialist.
- ❌ Recopier un livrable complet en entrée d'un autre (utiliser le `Hand-off`).
- ❌ Ouvrir tous les fichiers « au cas où » — lire uniquement les `FILES` du brief.
- ❌ Régénérer un domaine dont l'entrée n'a pas changé.

## 4. Choix de modèle par rôle (coût vs qualité)

| Rôle | Modèle conseillé | Pourquoi |
|------|------------------|----------|
| `architect-orchestrator` | `sonnet` | Routage simple, volume d'appels, coût bas |
| `specialist` | `inherit` (souvent `sonnet`/`opus` selon domaine) | Qualité du livrable |
| `synthesis-agent` | `opus` | Cohérence globale, arbitrages délicats |

Le skill `ai` fournit la méthode détaillée (routage par tâche, mesure des coûts).

## 5. Mesure

Suivre par run : nombre de specialists, tokens in/out par agent, coût total. Objectif :
le pipeline scopé doit coûter **moins** qu'une génération monolithique équivalente, à
qualité égale ou supérieure.
