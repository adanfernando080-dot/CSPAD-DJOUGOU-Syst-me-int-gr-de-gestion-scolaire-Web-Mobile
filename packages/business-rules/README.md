# @cspad/business-rules

Fonctions **pures** (sans base de données ni réseau) qui encodent les règles métier CSPAD :
calculs de notes, moyennes, rangs, passage, remises, soldes, paie.

## État

**Vide en Phase 1.** Aucune règle n'est implémentée avant la Phase 3.

## Conventions obligatoires

1. **Traçabilité de la source.** Chaque règle cite sa source dans son commentaire de tête :
   document de `docs/sources/` et section. Exemple : `Source : SPEC-V2.0 §x.y`.
   Une règle sans source n'est pas fusionnée.
2. **Aucune invention.** Si la source est absente, ambiguë ou contradictoire, la règle
   n'est pas codée. Le point est ajouté à `docs/business-rules/POINTS_A_VALIDER.md`.
3. **Paramètres, pas de constantes.** Les valeurs susceptibles d'évoluer sont reçues en
   paramètre et proviennent d'une configuration versionnée en base (par année scolaire ou
   période de validité). Cela concerne les tarifs, les pourcentages de remise, les seuils,
   les coefficients et les taux.
4. **Fiscal et social : aucun taux, aucun traitement codé en dur.** CNSS, ITS, AIB et
   VPS/PVS sont traités uniquement à partir de règles versionnées en base : code, taux,
   assiette, part salarié, part employeur, régime, dates de début et de fin, source
   réglementaire. Voir REG-01 à REG-05 dans `POINTS_A_VALIDER.md`.
5. **Décimaux exacts.** Utiliser `@cspad/utils` (`toDecimal`). Pas de `number` flottant pour
   l'argent ni les notes. L'arrondi se fait uniquement à l'affichage (`roundForDisplay`).
6. **Tests.** Chaque règle a ses tests unitaires, y compris les cas limites et les cas de
   données insuffisantes.
