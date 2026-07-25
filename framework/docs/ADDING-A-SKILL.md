# Ajouter un nouveau skill (extensibilité)

Le framework est **ouvert** : on ajoute des dizaines de skills sans modifier les
existants. Un nouveau domaine ne touche ni les autres skills, ni le `specialist`.

## Étapes

1. **Créer le dossier** `skills/<mon-domaine>/` et le fichier `SKILL.md` à partir de
   `templates/SKILL.template.md`. Respecter les 8 sections obligatoires (voir
   `docs/CONVENTIONS.md`).

2. **Rédiger un prompt spécialisé** : périmètre net, `INTERDITS` qui renvoient aux
   autres skills, `FORMAT DE SORTIE` terminé par `## Hand-off`.

3. **Déclarer le skill à l'orchestrateur** : ajouter une ligne dans la section
   « SKILLS DISPONIBLES » de `agents/architect-orchestrator.md`
   (`- \`<mon-domaine>\` — quand le choisir`). C'est la **seule** modification d'un
   fichier existant, et elle est purement déclarative.

4. **(Optionnel) Ajouter une commande** `commands/<mon-domaine>.md` à partir de
   `templates/command.template.md` pour un accès direct `/mon-domaine`.

5. **Documenter** : entrée dans `CHANGELOG.md` ; mention dans le tableau des skills du
   `README.md`.

## Ce qu'il ne faut PAS faire

- ❌ Créer un nouvel agent par domaine — `specialist` exécute déjà n'importe quel skill.
- ❌ Modifier d'autres `SKILL.md` — un skill ignore les autres.
- ❌ Dupliquer de l'expertise déjà couverte — sinon fusionner ou affiner les périmètres.

## Checklist d'acceptation

- [ ] 8 sections présentes, `Hand-off` inclus.
- [ ] Périmètre disjoint des skills voisins (aucune zone grise).
- [ ] Déclaré dans l'orchestrateur.
- [ ] < 80 lignes, exemples concrets.
- [ ] CHANGELOG + README à jour.
