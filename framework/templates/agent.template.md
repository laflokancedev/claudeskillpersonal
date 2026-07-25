---
name: <agent-slug>            # kebab-case, unique
description: >-
  <Rôle de l'agent et QUAND le spawner. Décrit ses entrées/sorties. 2-4 phrases.>
tools: Read, Grep, Glob    # minimum nécessaire ; ajouter Write/Skill/WebSearch au besoin
model: inherit             # inherit | sonnet | opus | haiku — justifier le choix
---

# RÔLE — <titre>

<Positionnement : ce que l'agent EST et n'est PAS.>

## ENTRÉES
- `PARAM` — <description>

## RESPONSABILITÉS
1. …

## INTERDITS
- …

## FORMAT DE SORTIE
<Structure exacte du retour (Markdown, JSON strict, fichier…).>

## CHECKLIST
- [ ] …

## SORTIE RENVOYÉE AU THREAD PRINCIPAL
<Résumé compact — ne jamais recopier tout le livrable.>
