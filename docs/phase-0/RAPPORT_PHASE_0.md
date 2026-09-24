# CSPAD DJOUGOU — Rapport de Phase 0

**Phase :** PHASE 0 — Validation et gel de la spécification
**Date :** 2026-09-24
**Statut :** BLOCKED (partiellement) — inspection terminée ; gel de la spécification en attente des documents sources et des validations listées au §5.

---

## 1. Inspection du dépôt

| Élément | Constat |
|---|---|
| `git status` | Branche `claude/modest-archimedes-jqjrvv`, **aucun commit** |
| Refs distantes (`git ls-remote`, API GitHub) | **Aucune branche** — « Git Repository is empty » |
| Fichiers suivis | Aucun |
| `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json` | Absents |
| Prisma / migrations / seed | Absents |
| Applications `api` / `web` / `mobile` | Absentes |
| Tests | Absents |
| Variables d'environnement / `.env.example` | Absents |
| CI (`.github/workflows`) | Absente |
| Conventions existantes | Aucune — à établir en Phase 1 |
| **Documents sources** (`Specifications_…_V2_0_DEFINITIVE.docx`, `PROJET DE CAHIER DE CHARGE_….docx`) | **Introuvables** dans le dépôt et dans l'environnement |
| Document « V2.9 » (référence d'architecture) | **Introuvable** ; seulement cité dans le prompt maître |
| Images officielles des coefficients (6e/5e, 4e/3e) | **Introuvables** |

Outillage disponible dans l'environnement : Node 22.22, pnpm 10.33, npm 10.9, Docker 29.3, PostgreSQL 16.13 (client et serveur).

**Conséquence :** il n'existe aucun code à préserver ou à corriger. La seule source métier actuellement accessible est le **prompt maître V3.0**. Toute comparaison « existant ↔ V2.0 » est donc impossible tant que les documents ne sont pas fournis ; les règles du prompt maître sont traitées comme la meilleure source disponible, sous réserve de confirmation par la V2.0.

---

## 2. Matrice des écarts

Le dépôt étant vide, les colonnes **INCORRECT**, **À MODIFIER** et **À CONSERVER** sont vides.

| Domaine | EXISTANT | MANQUANT | INCORRECT | À MODIFIER | À CONSERVER |
|---|---|---|---|---|---|
| Monorepo (pnpm + Turborepo, tsconfig, ESLint, Prettier) | — | Tout | — | — | — |
| `apps/api` (NestJS) | — | Tout | — | — | — |
| `apps/web` (Next.js) | — | Tout | — | — | — |
| `apps/mobile` (Expo) | — | Tout | — | — | — |
| `packages/*` (types, validation, business-rules, ui, config, utils) | — | Tout | — | — | — |
| `database/prisma` (schéma, migrations, seed, sql) | — | Tout (~60 tables listées au §13 du prompt) | — | — | — |
| Auth (JWT, refresh, MFA/TOTP) | — | Tout | — | — | — |
| RBAC + scopes + isolation financière | — | Tout | — | — | — |
| Audit append-only, idempotence, outbox, numérotation | — | Tout | — | — | — |
| Composantes 1 à 6 | — | Tout | — | — | — |
| Tests (unit, intégration, sécurité, E2E, documents, mobile, continuité) | — | Tout | — | — | — |
| Docker / Nginx / CI / environnements | — | Tout | — | — | — |
| Documentation (`docs/*`) | Ce rapport | Le reste | — | — | — |
| Sources métier | Prompt maître V3.0 | V2.0, cahier des charges, V2.9, images des coefficients | — | — | — |

---

## 3. Règles métier comprises (d'après le prompt maître, à confirmer par la V2.0)

Elles seront centralisées dans `packages/business-rules`, testées en unitaire, et les valeurs chiffrées seront stockées comme **paramètres versionnés par année scolaire** et non en dur dans le code.

- **Structure :** Prématernelle (3 ans, demande enregistrable avant inscription) ; Maternelle M1/M2 (minimum 4 ans) ; Primaire (minimum 6 ans), Groupes A et B × CI…CM2 ; Collège 6e…3e. Les niveaux ne dépendent pas de l'année ; les classes, elles, sont liées à l'année.
- **Admission :** demande → test d'entrée (obligatoire pour les nouveaux élèves) → évaluation → décision → inscription.
- **Tarifs :** Primaire CI-CP 50 000, CE1-CE2 50 000, CM1-CM2 55 000 (3 tranches) ; Collège 6e/5e 35+25+15 = 75 000, 4e/3e 40+35+10 = 85 000. Tranche 1 et frais généraux payés à l'inscription ; frais généraux de 5 500 pour un ancien élève du primaire.
- **Cantine :** 6 000/mois ou 48 000/an par enfant, quelle que soit la classe.
- **Remises :** 5 % famille (plus de 3 enfants du même parent) ; 20 % sur la 6e pour un CM2 CSPAD qui continue au collège CSPAD.
- **Paiements :** paiements partiels, plusieurs versements, affectation à plusieurs charges ; aucune suppression physique ; reçu à référence unique ; tous les calculs faits côté serveur.
- **Notes :** au moins 2 interrogations, au plus 2 devoirs ; coefficients par matière ; formules de la §24 du prompt ; absence non justifiée = 0 ; absence justifiée = rattrapage ; ne jamais inventer de moyenne.
- **Moyennes et rangs :** pondération par coefficient ; annuelle = (T1+T2+T3)/3 ; arrondi à 2 décimales à l'affichage seulement ; rang par matière et rang général ; listes alphabétiques par défaut.
- **Passage collège :** moyenne annuelle ≥ 10 → passage, < 10 → redoublement ; décision automatique non modifiable par un conseil de classe.
- **Bulletins :** DRAFT → CALCULATED → VALIDATED → PUBLISHED, puis verrouillés ; toute correction est justifiée et auditée.
- **Paie :** distinction salarié / prestataire ; composantes par personne ; taux fiscaux et sociaux versionnés avec leur source réglementaire.

---

## 4. Décisions techniques proposées (sans impact métier)

| Sujet | Choix proposé | Justification |
|---|---|---|
| Gestionnaire de paquets | pnpm 10 + Turborepo | Déjà installé, imposé par la structure cible |
| Runtime | Node 22 LTS | Disponible, supporté par NestJS, Next.js et Expo |
| Racine du monorepo | La racine du dépôt (pas de sous-dossier `cspad-djougou/`) | Le dépôt est le monorepo |
| API | NestJS 11, préfixe global `/api/v1`, filtre d'erreurs au format du §37 | Conforme au prompt |
| ORM | Prisma 6, `@@map` / `@map` en snake_case, UUID, `Decimal(15,2)` pour les montants et `Decimal(5,2)` pour les notes | Conforme au prompt |
| Calcul décimal | `decimal.js` avec `ROUND_HALF_UP` pour l'affichage uniquement | Évite l'erreur binaire des flottants : `12.345` en float s'arrondit à `12.34` |
| Validation | Zod (schémas partagés dans `packages/validation`), avec un pipe NestJS basé sur Zod | Une seule source de validation pour le web, le mobile et l'API |
| Tests | Vitest (unitaires) ; Jest + Supertest ou Vitest pour l'API ; Playwright (E2E web) ; PostgreSQL réel pour l'intégration | Chromium et PostgreSQL disponibles |
| Numérotation | Table `document_sequences` + `SELECT … FOR UPDATE` dans la transaction | Aucune collision, aucun trou non tracé |
| Mots de passe | Argon2id | Recommandation OWASP |
| Audit | Table `audit_logs` + trigger PostgreSQL qui interdit `UPDATE` et `DELETE` | Append-only garanti au niveau de la base |
| Paiements | Trigger PostgreSQL qui interdit le `DELETE` des paiements et reçus validés | Règle non négociable n°3, appliquée en base et dans le service |

---

## 5. Points bloquants, ambiguïtés et contradictions à valider

### 5.1 Données sources manquantes (bloquantes)

| # | Point | Impact | Partie bloquée |
|---|---|---|---|
| B1 | `Specifications_…_V2_0_DEFINITIVE.docx` absent | Impossible de confirmer les règles | Gel de la spécification |
| B2 | `PROJET DE CAHIER DE CHARGE_….docx` absent | Idem | Idem |
| B3 | Document « V2.9 » absent (le prompt le cite comme référence d'architecture) | Architecture fondée sur le prompt seul | Validation de la Phase 1 |
| B4 | Images des coefficients 6e/5e et 4e/3e absentes | Aucun coefficient ne sera saisi dans le seed | Seed pédagogique, calculs réels |
| B5 | Taux CNSS, barème ITS, AIB, VPS non fournis avec leur source | Aucun taux ne sera codé | Calcul de paie (Phase 6) |
| B6 | Règles de passage Maternelle / Primaire absentes (§30 renvoie à la V2) | Aucun seuil ne sera inventé | Module de passage hors collège |

### 5.2 Ambiguïtés métier

| # | Point | Question |
|---|---|---|
| A1 | Tranches du primaire | Le montant de chacune des 3 tranches (CI-CP, CE1-CE2, CM1-CM2) n'est pas donné, contrairement au collège |
| A2 | Frais généraux | Quel est le montant pour un nouvel élève ? « Ancien élève du primaire = 5 500 » : s'applique-t-il à un ancien élève qui passe au collège, ou à toute réinscription au primaire ? Et pour la maternelle ou le collège ? |
| A3 | Frais de scolarité Prématernelle / Maternelle | Non fournis |
| A4 | Remise famille | « Plus de 3 enfants », soit au moins 4 : la remise s'applique-t-elle à tous les enfants ou à partir du 4e ? Sur la scolarité seule, ou aussi sur les frais généraux et la cantine ? Comment un « parent » est-il identifié (père, mère, tuteur) ? |
| A5 | Cumul des remises | Les remises de 5 % et de 20 % se cumulent-elles ? Dans quel ordre (additif ou successif) ? |
| A6 | Remise CM2 → 6e | Base de la remise : total de la 6e (75 000) ou une tranche ? Comment la répartir entre les tranches ? |
| A7 | Cantine | Combien de mois sont facturables (48 000/an contre 6 000 × n mois) ? Peut-on s'inscrire en cours d'année ? |
| A8 | Première tranche obligatoire | L'inscription reste-t-elle « en attente » tant que la tranche 1 n'est pas payée, ou est-elle bloquée ? |
| A9 | Échéances | Quelles sont les dates limites des tranches (nécessaires pour les impayés et les notifications) ? |
| A10 | Âge de référence | À quelle date calcule-t-on l'âge (3, 4 ou 6 ans) : rentrée, 31 décembre, autre ? Dérogations possibles ? |
| A11 | Seuil de passage et arrondi | Le seuil de 10 s'applique-t-il à la valeur exacte ou arrondie ? Exemple : 9,996 s'affiche 10,00 mais reste < 10, donc redoublement. **Proposition :** valeur exacte, cohérente avec « arrondi uniquement à l'affichage » |
| A12 | Évaluation au primaire et à la maternelle | Périodes (trimestres ou compositions ?), échelle de notes, appréciations : non décrites |
| A13 | Matière avec 0 devoir | Formule non donnée (moyenne des interrogations seule ?) |
| A14 | Moins de 2 interrogations sans rattrapage | Quel est le statut de la matière (non classé ?) et son effet sur la moyenne générale ? |
| A15 | Trimestre manquant | Comment calculer la moyenne annuelle s'il manque un trimestre (élève arrivé en cours d'année) ? |
| A16 | Ex-æquo | Règle de rang (rang partagé puis saut, ou autre) ? |
| A17 | 3e | Passage de fin de cycle (BEPC) : hors périmètre, ou décision spécifique ? |
| A18 | « VPS/VPS » | Coquille probable. Le VPS est habituellement une charge **patronale**, or le prompt le place dans les **retenues salariales**. À clarifier |
| A19 | Retenue « frais de scolarité » en paie | Lien avec le module finance (enfants du personnel) : quel rôle est autorisé à voir quoi ? |
| A20 | Notifications « parent/élève » | Les élèves ont-ils un compte ? Aucun rôle « Élève » n'est listé au §9 |
| A21 | Comptes privilégiés soumis au MFA | Liste exacte ? **Proposition :** PCA, Direction, Administrateur système, Finance, RH/Paie |
| A22 | Plan comptable | SYSCOHADA révisé ? Plan de comptes fourni ? |
| A23 | Format des références | Format des numéros de reçu, facture et bulletin de paie (préfixe, année, séquence) ? |
| A24 | Mandat de l'administrateur système | Peut-il attribuer un rôle financier sans l'avoir lui-même ? **Proposition :** l'attribution d'un rôle sensible exige la Direction ou le PCA |
| A25 | Durées de conservation | Pour l'audit, les pièces financières et la paie |
| A26 | Infrastructure | Hébergeur, fournisseur S3, SMS, push (Expo Push ?), nom de domaine |

---

## 6. Plan d'implémentation

Chaque phase suit : inspecter → planifier → implémenter → tester → vérifier → documenter → rapporter → **valider**.

### Phase 1 — Architecture + socle du dépôt (prochaine étape, après validation de ce rapport)
1. Socle du monorepo : `package.json` racine, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json` en mode strict, ESLint (flat config), Prettier, `.editorconfig`, `.gitignore`, `.env.example`, `README.md`.
2. Squelettes d'applications : `apps/api` (NestJS, `/api/v1`, `/health`, format d'erreur et `X-Request-Id`), `apps/web` (Next.js App Router), `apps/mobile` (Expo Router).
3. Paquets : `types`, `validation` (Zod), `business-rules` (vide mais testé), `config` (lecture typée de l'environnement), `utils` (Decimal, dates), `ui` (tokens de design).
4. Docker Compose de développement (PostgreSQL 16, MinIO), CI GitHub Actions (install, lint, typecheck, test, build).
5. Documentation : `docs/architecture` (ADR : monolithe modulaire, RBAC, audit, argent, dates), design system (tokens), flux principaux (admission, inscription, paiement, notes/bulletin, paie).
6. **Critère de sortie :** `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build` passent en local et en CI.

### Phase 2 — BDD + API + sécurité (critique)
Schéma Prisma complet (§13), migrations, triggers append-only et anti-suppression, `document_sequences`, `idempotency_keys`, `outbox_events` ; authentification (Argon2id, JWT d'accès court, refresh tokens rotatifs révocables, TOTP, limitation des tentatives) ; RBAC (Utilisateur → Rôle → Permission `module:action` → Scope) avec garde et vérification en service ; AuditService ; seed de rôles sans finance pour l'administrateur ; **tests de sécurité API** (isolation financière, compte désactivé, parent et enseignant isolés).

### Phase 3 — Administration + Élèves + Inscriptions
Années, cycles, niveaux, classes, groupes, salles ; élèves, responsables, documents ; demandes → tests → décisions ; inscription transactionnelle et idempotente (§16) ; règles d'âge paramétrées.

### Phase 4 — Pédagogie + Notes + Bulletins *(bloquée partiellement par B4, B6, A11-A16)*
Matières, coefficients versionnés, affectations ; appel, évaluations, notes, rattrapages ; GradeCalculation, Ranking, ReportCard (cycle de vie), Promotion (collège).

### Phase 5 — Finance + Caisse + Comptabilité *(bloquée partiellement par A1-A9, A22, A23)*
Grilles tarifaires paramétrées, charges, remises, paiements et allocations transactionnels, reçus, caisse (ouverture et clôture), dépenses, écritures, rapports, annulation par contrepassation.

### Phase 6 — Personnel + Paie *(bloquée partiellement par B5, A18, A19)*
### Phase 7 — Communication
### Phase 8 — Mobile (parent, enseignant)
### Phase 9 — Tests, sécurité, recette (matrice du §52)
### Phase 10 — Déploiement, sauvegarde et restauration testées, formation

---

## 7. Rapport de phase

- **Réalisé :** inspection complète du dépôt (vide), analyse du prompt maître, matrice des écarts, décisions techniques, liste des points à valider, plan d'implémentation.
- **Fichiers créés :** `docs/phase-0/RAPPORT_PHASE_0.md`
- **Fichiers modifiés :** aucun
- **Migrations :** aucune
- **Tests :** aucun (aucun code)
- **Problèmes :** documents sources absents (B1 à B6)
- **Validation requise :** §5 (en priorité B1 à B4 et A1 à A11) et accord sur les décisions techniques du §4
- **Dette technique :** aucune
- **Étape suivante proposée :** Phase 1 (socle du monorepo et architecture), qui **ne dépend d'aucun point bloquant métier** et peut démarrer dès l'accord sur ce rapport.
