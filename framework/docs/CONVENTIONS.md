# Conventions & règles de nommage

## 1. Arborescence

```
framework/
├── .claude-plugin/         # manifestes (plugin.json, marketplace.json)
├── commands/               # 1 fichier = 1 slash command
├── agents/                 # orchestrator, specialist, synthesis
├── skills/<domaine>/SKILL.md   # 1 dossier = 1 expertise
├── templates/              # gabarits pour étendre le framework
├── docs/                   # documentation du framework
├── README.md · LICENSE · CHANGELOG.md
```

## 2. Nommage

| Élément | Règle | Exemple |
|---------|-------|---------|
| Dossier de skill | kebab-case, nom du domaine | `ui-ux`, `database` |
| `name:` d'un skill | = nom du dossier | `ui-ux` |
| Agent | kebab-case, rôle | `architect-orchestrator` |
| Commande | kebab-case, court | `api`, `orchestrate` |
| Fichier de sortie | `<domaine>-<slug>.md` ou `DEV-CREW-<slug>.md` | `security-checkout.md` |
| ADR | `ADR-<NNN>-<titre>.md` | `ADR-001-monolithe-modulaire.md` |

## 3. Structure obligatoire d'un skill

Tout `SKILL.md` DOIT contenir, dans cet ordre :
`OBJECTIF` · `RESPONSABILITÉS` · `INTERDITS` · `FORMAT DE SORTIE` · `CHECKLIST` ·
`CRITÈRES DE QUALITÉ` · `EXEMPLES` · `BONNES PRATIQUES`.
Le `FORMAT DE SORTIE` se termine toujours par une section `## Hand-off`.

## 4. Qualité des prompts

- **Spécialisés** : un skill = un domaine, aucune zone grise.
- **Précis** : verbes d'action, critères vérifiables.
- **Courts** : viser < 80 lignes ; la densité prime sur la longueur.
- **Sans ambiguïté** : chaque `INTERDIT` renvoie au skill responsable.
- **Maintenables** : pas de duplication entre skills (lier, ne pas recopier).

## 5. Frontmatter

- Skills : `name`, `description` (riche en mots-clés déclencheurs).
- Agents : `name`, `description`, `tools` (minimum nécessaire), `model`.
- Commandes : `description`, `argument-hint`.

## 6. Langue

Sortie pilotée par `--lang fr|en|both` (défaut = langue de la demande). Les mots-clés
techniques (HTTP, SQL, noms d'API, `feat/fix`, erreurs, code) restent en anglais
technique quelle que soit la langue.

## 7. Versionnement

SemVer dans `plugin.json` + `marketplace.json` (synchronisés). Toute évolution notée
dans `CHANGELOG.md`. Un skill peut évoluer sans bump majeur tant que son contrat
(`FORMAT DE SORTIE`) reste rétrocompatible.
