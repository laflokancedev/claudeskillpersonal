---
description: Génère une Software Design Specification (SDS) production-ready via le sous-agent sds-architect. Écrit le doc dans un fichier .md.
argument-hint: <description du projet> [--lang fr|en|both]
---

Objectif : produire une **Software Design Specification** complète et
production-ready pour le projet décrit ci-dessous, en isolant le gros contexte dans
un sous-agent dédié.

Brief projet (arguments bruts) :

$ARGUMENTS

Procédure :

1. **Langue de sortie** — analyser un éventuel flag `--lang` dans le brief :
   - `--lang fr` → français · `--lang en` → anglais · `--lang both` → bilingue FR+EN.
   - Aucun flag → langue du brief.
   - Retirer le flag `--lang …` du brief avant de le transmettre.
2. Si le brief nettoyé est **vide**, demander à l'utilisateur la description du projet
   puis stopper (ne rien inventer).
3. Générer un slug court depuis le brief pour nommer le fichier cible :
   `./SDS-<slug>.md`.
4. **Lancer le sous-agent `sds-architect`** (via l'outil Agent/Task) en lui passant :
   - `BRIEF` = brief nettoyé
   - `LANG` = langue déterminée
   - `OUTFILE` = `./SDS-<slug>.md`
   - consigne : suivre les 16 étapes, écrire la SDS dans `OUTFILE`, renvoyer un résumé.
5. À la fin, **relayer à l'utilisateur** (le rapport du sous-agent ne lui est pas
   montré automatiquement) : chemin du fichier écrit sous forme de lien markdown
   cliquable, résumé exécutif (5–8 lignes), stack recommandée, hypothèses `HYP-n`, et
   les questions ouvertes bloquantes.
