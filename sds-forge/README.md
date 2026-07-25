# SDS-Forge

Plugin Claude Code qui génère une **Software Design Specification (SDS)** complète et
production-ready pour une application ou un plugin web, via une méthode en **16 étapes**
(architecture, comparaison de stacks, backend, frontend, UI/UX, API, modèle de données,
sécurité OWASP, performance, optimisation IA/tokens, déploiement CI/CD, tests, roadmap
MVP→Prod, évaluation de maturité).

## Composants

| Composant | Fichier | Rôle |
|-----------|---------|------|
| Command | `commands/sds.md` | `/sds <projet> [--lang fr\|en\|both]` — lance la génération |
| Skill | `skills/sds-forge/SKILL.md` | Auto-trigger sur « SDS / design doc / spec complète » |
| Agent | `agents/sds-architect.md` | Méthode 16 étapes, isole le contexte, écrit le `.md` |

Flux : `command`/`skill` → spawn du sous-agent `sds-architect` → génération → écriture
de `./SDS-<slug>.md` → relais d'un résumé. Le gros contexte reste isolé dans le
sous-agent, le thread principal reste léger.

## Installation

### Via marketplace (recommandé)
Ce dépôt est **sa propre marketplace** (un seul plugin).

```bash
# depuis un terminal claude interactif
/plugin marketplace add F:\Info\sds-forge
/plugin install sds-forge@sds-forge-marketplace
```

Pour partager : pousser ce dossier sur GitHub, puis :

```bash
/plugin marketplace add <user>/<repo>
/plugin install sds-forge@sds-forge-marketplace
```

### Installation manuelle (globale, sans marketplace)
Copier les composants dans les dossiers utilisateur :

```bash
cp commands/sds.md            ~/.claude/commands/
cp agents/sds-architect.md    ~/.claude/agents/
cp -r skills/sds-forge        ~/.claude/skills/
```

Redémarrer la session pour charger `/sds`, la skill et l'agent.

## Usage

```bash
/sds Plugin web de gestion de tâches collaboratif temps réel avec IA de résumé --lang both
```

Ou décrire simplement le projet : la skill `sds-forge` se déclenche seule.

### Langue de sortie
- `--lang fr` → français
- `--lang en` → anglais
- `--lang both` → bilingue (FR + bloc `> EN:` condensé, économie de tokens)
- sans flag → langue du brief

## Sortie
Un fichier `SDS-<slug>.md` écrit dans le répertoire courant, plus un résumé exécutif,
la stack recommandée, les hypothèses `HYP-n` et les questions ouvertes relayés dans le
chat.

## Structure du dépôt

```
sds-forge/
├── .claude-plugin/
│   ├── plugin.json        # manifeste du plugin
│   └── marketplace.json   # marketplace mono-plugin (source ".")
├── commands/
│   └── sds.md
├── agents/
│   └── sds-architect.md
├── skills/
│   └── sds-forge/
│       └── SKILL.md
└── README.md
```

## Licence
MIT
