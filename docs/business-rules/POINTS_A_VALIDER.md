# Registre des points à valider

Ce registre recense toute information **absente, ambiguë ou contradictoire** dans les sources
disponibles. Tant qu'un point est `OUVERT`, la partie concernée **n'est pas implémentée**
comme règle définitive (prompt maître §1, §62).

- **Statuts :** `OUVERT` → `VALIDÉ` (décision + source + date) ou `SANS OBJET`.
- **Source actuellement disponible :** prompt maître V3.0 uniquement. SRC-01 à SRC-07 sont
  absents (voir `docs/sources/MANIFEST.json`).
- Un point validé doit citer sa source (`SRC-xx §…`) ou la personne qui a validé, avec la date.

## 1. Sources manquantes (bloquantes pour les parties concernées)

| ID  | Point                                                         | Partie bloquée                         | Statut |
| --- | ------------------------------------------------------------- | -------------------------------------- | ------ |
| B1  | Spécification V2.0 (SRC-01) absente                           | Gel de la spécification, règles métier | OUVERT |
| B2  | Cahier des charges (SRC-02) absent                            | Idem                                   | OUVERT |
| B3  | Document V2.9 (SRC-03) absent                                 | Confirmation de l'architecture         | OUVERT |
| B4  | Images officielles des coefficients (SRC-04, SRC-05) absentes | Seed des coefficients, calculs réels   | OUVERT |
| B5  | Textes réglementaires fiscaux et sociaux (SRC-07) absents     | Calcul de paie (Phase 6)               | OUVERT |
| B6  | Règles de passage Maternelle et Primaire absentes             | Module de passage hors collège         | OUVERT |
| B7  | Modèle réel de bulletin de paie (SRC-06) absent               | Présentation du bulletin de paie       | OUVERT |

## 2. Points fiscaux et réglementaires (paie)

> **Règle appliquée : aucun taux, barème, assiette ni traitement n'est codé en dur ou supposé.**
> Le système stockera ces paramètres en base, versionnés et reliés à leur source :
> `code_taxe`, libellé, taux, part employeur, part salarié, assiette, régime, date de début,
> date de fin, source réglementaire, actif (prompt §32).
> Tant que ces points sont `OUVERT`, le moteur de paie **refusera de calculer** une composante
> qui n'a pas de paramètre validé pour la période. Il ne prendra jamais de valeur par défaut.

| ID     | Point                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Statut |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| REG-01 | **CNSS** : taux salarié, taux employeur, assiette, plafond éventuel, branches concernées, date d'effet, texte de référence.                                                                                                                                                                                                                                                                                                                               | OUVERT |
| REG-02 | **ITS** : barème applicable à la date de paie (tranches, taux), éléments de l'assiette imposable, abattements ou réductions éventuels, texte de référence.                                                                                                                                                                                                                                                                                                | OUVERT |
| REG-03 | **AIB** : applicabilité aux prestataires, taux selon le statut et le régime fiscal du prestataire, pièces justificatives, texte de référence.                                                                                                                                                                                                                                                                                                             | OUVERT |
| REG-04 | **VPS / PVS** : (a) **dénomination exacte** (le prompt maître écrit « VPS/VPS », la demande de Phase 1 écrit « VPS/PVS ») ; (b) **nature** : charge patronale ou retenue salariale (le prompt le place dans les RETENUES du bulletin, ce qui est à confirmer) ; (c) taux ; (d) assiette ; (e) conditions d'assujettissement du CSPAD (« activé uniquement selon le régime légal applicable ») ; (f) texte de référence. **Aucune hypothèse n'est faite.** | OUVERT |
| REG-05 | **Autres charges patronales** (« autres charges applicables », §31) : liste exhaustive, taux, assiettes, sources.                                                                                                                                                                                                                                                                                                                                         | OUVERT |
| REG-06 | **Salarié ou prestataire** : critères de qualification et traitement fiscal et social de chacun (quelles retenues s'appliquent à qui).                                                                                                                                                                                                                                                                                                                    | OUVERT |
| REG-07 | **Retenues internes** (frais de scolarité, remboursement d'avance) : règles de calcul, plafonds éventuels, lien avec le module Finance, droits de consultation (A19).                                                                                                                                                                                                                                                                                     | OUVERT |
| REG-08 | **Gains** (déplacement, rentrée, encouragement, direction, communication) : imposables ou non, soumis ou non à cotisation. Ce traitement relève de REG-01 et REG-02.                                                                                                                                                                                                                                                                                      | OUVERT |
| REG-09 | **Vérification avant production** : une personne habilitée (comptable ou expert) valide chaque paramètre et sa source (§32 : « les taux doivent être vérifiés avant la mise en production »).                                                                                                                                                                                                                                                             | OUVERT |

## 3. Ambiguïtés métier (reprises de la Phase 0)

| ID  | Point                                                                                                                 | Statut |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| A1  | Montant de chacune des 3 tranches du primaire                                                                         | OUVERT |
| A2  | Frais généraux : montant pour un nouvel élève ; portée exacte des « 5 500 FCFA ancien élève du primaire »             | OUVERT |
| A3  | Frais de scolarité de la Prématernelle et de la Maternelle                                                            | OUVERT |
| A4  | Remise famille : bénéficiaires (tous les enfants ou à partir du 4e), charges concernées, identification du « parent » | OUVERT |
| A5  | Cumul et ordre d'application des remises de 5 % et de 20 %                                                            | OUVERT |
| A6  | Remise CM2 → 6e : base de calcul et répartition entre les tranches                                                    | OUVERT |
| A7  | Cantine : nombre de mois facturables, inscription en cours d'année                                                    | OUVERT |
| A8  | Tranche 1 obligatoire : effet sur le statut de l'inscription (en attente ou bloquée)                                  | OUVERT |
| A9  | Dates d'échéance des tranches                                                                                         | OUVERT |
| A10 | Date de référence pour le calcul de l'âge ; dérogations                                                               | OUVERT |
| A11 | Seuil de 10/20 appliqué à la valeur exacte ou arrondie (proposition : valeur exacte)                                  | OUVERT |
| A12 | Système d'évaluation Primaire et Maternelle (périodes, échelle, appréciations)                                        | OUVERT |
| A13 | Formule pour une matière sans devoir                                                                                  | OUVERT |
| A14 | Moins de 2 interrogations sans rattrapage : statut de la matière et effet sur la moyenne générale                     | OUVERT |
| A15 | Moyenne annuelle avec un trimestre manquant                                                                           | OUVERT |
| A16 | Règle de rang en cas d'ex-æquo                                                                                        | OUVERT |
| A17 | Fin de cycle en 3e (BEPC)                                                                                             | OUVERT |
| A18 | Remplacé par REG-04 (VPS/PVS)                                                                                         | —      |
| A19 | Retenue « frais de scolarité » en paie : droits de consultation entre la RH/Paie et la Finance                        | OUVERT |
| A20 | Les élèves ont-ils un compte ? (notifications « parent/élève »)                                                       | OUVERT |
| A21 | Liste des comptes soumis au MFA (proposition : PCA, Direction, Administrateur, Finance, RH/Paie)                      | OUVERT |
| A22 | Plan comptable de référence                                                                                           | OUVERT |
| A23 | Format des numéros de reçu, de facture et de bulletin                                                                 | OUVERT |
| A24 | Mandat de l'administrateur système pour attribuer des rôles sensibles                                                 | OUVERT |
| A25 | Durées de conservation                                                                                                | OUVERT |
| A26 | Infrastructure : hébergeur, S3, SMS, push, nom de domaine                                                             | OUVERT |

## 4. Points techniques ou institutionnels introduits en Phase 1

Valeurs **provisoires** choisies pour faire fonctionner le socle. Elles n'ont aucun impact
métier mais doivent être confirmées par le CSPAD.

| ID      | Point                                                        | Valeur provisoire                     | Statut |
| ------- | ------------------------------------------------------------ | ------------------------------------- | ------ |
| UI-01   | Charte graphique CSPAD (logo, couleurs institutionnelles)    | Palette neutre (`@cspad/ui`)          | OUVERT |
| TECH-01 | Licence du logiciel et titulaire des droits                  | « Tous droits réservés », à confirmer | OUVERT |
| TECH-02 | Identifiant des applications mobiles (App Store, Play Store) | `bj.cspad.djougou`                    | OUVERT |
| TECH-03 | Nom de domaine de production                                 | Aucun                                 | OUVERT |
