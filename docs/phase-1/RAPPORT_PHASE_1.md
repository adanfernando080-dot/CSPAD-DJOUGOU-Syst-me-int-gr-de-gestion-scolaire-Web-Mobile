# CSPAD DJOUGOU — Rapport de Phase 1

**Phase :** PHASE 1 — Socle technique et architecture
**Date :** 2026-09-24
**Statut :** COMPLETE pour le socle technique. Aucune implémentation métier. Documents sources
toujours absents.

## 1. Résumé

- Monorepo pnpm + Turborepo opérationnel : 3 applications et 6 paquets partagés, TypeScript
  strict, ESLint, Prettier, CI GitHub Actions.
- **API NestJS** : préfixe `/api/v1`, `/health`, format d'erreur unique (§37), `X-Request-Id`,
  validation Zod, en-têtes de sécurité, CORS fermé par défaut, Swagger OpenAPI 3.1 protégé en
  staging et en production, configuration validée au démarrage.
- **Web Next.js** et **Mobile Expo** : squelettes compilables, reliés aux jetons de design
  partagés.
- **Documents sources** : structure `docs/sources/` avec manifeste SHA-256 et vérification
  d'intégrité en CI. **Aucun document n'a été fourni**, les 7 sources attendues sont `ABSENT`.
- **Registre des points à valider** créé. Il contient les points fiscaux et réglementaires
  REG-01 à REG-09, dont **REG-04 VPS/PVS**, sans aucun taux ni traitement supposé.

## 2. Fichiers créés

| Domaine         | Fichiers                                                                                                                                                                                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Racine          | `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`, `tsconfig.base.json`, `eslint.config.js`, `prettier.config.js`, `.prettierignore`, `.editorconfig`, `.gitignore`, `.npmrc`, `.nvmrc`, `.env.example`, `README.md`, `LICENSE`                                                                                                |
| CI              | `.github/workflows/ci.yml`                                                                                                                                                                                                                                                                                                                         |
| API             | `apps/api/` : `src/main.ts`, `app.factory.ts`, `app.module.ts`, `swagger.ts`, `version.ts`, `config/config.module.ts`, `health/*`, `common/errors/api-exception.ts`, `common/filters/api-exception.filter.ts`, `common/middleware/request-id.middleware.ts`, `common/pipes/zod-validation.pipe.ts`, `test/app.test.ts`, configuration TS et Vitest |
| Web             | `apps/web/` : `app/layout.tsx`, `app/page.tsx`, `app/page.test.tsx`, `app/globals.css`, `next.config.ts`, configuration TS et Vitest                                                                                                                                                                                                               |
| Mobile          | `apps/mobile/` : `app/_layout.tsx`, `app/index.tsx`, `app.json`, `tsconfig.json`                                                                                                                                                                                                                                                                   |
| Paquets         | `packages/{types,validation,config,utils,ui,business-rules}/` : `src/*`, tests, `tsconfig*.json`, `package.json` ; `business-rules/README.md`                                                                                                                                                                                                      |
| Base de données | `database/prisma/README.md` et dossiers `migrations/`, `seed/`, `sql/` (vides)                                                                                                                                                                                                                                                                     |
| Docker          | `docker/docker-compose.dev.yml` (PostgreSQL 16)                                                                                                                                                                                                                                                                                                    |
| Scripts         | `scripts/verify-sources.mjs`                                                                                                                                                                                                                                                                                                                       |
| Sources         | `docs/sources/README.md`, `docs/sources/MANIFEST.json`, 6 sous-dossiers vides                                                                                                                                                                                                                                                                      |
| Documentation   | `docs/architecture/{ARCHITECTURE,DECISIONS,DESIGN_SYSTEM,FLUX_PRINCIPAUX}.md`, `docs/business-rules/POINTS_A_VALIDER.md`, `tests/README.md`, ce rapport                                                                                                                                                                                            |

## 3. Fichiers modifiés

- `docs/phase-0/RAPPORT_PHASE_0.md` : **formatage Prettier uniquement** (alignement des tableaux,
  marqueurs d'emphase). Le contenu est inchangé.

## 4. Migrations

Aucune. Prisma est reporté en Phase 2, voir ADR-0003.

## 5. Décisions prises

Toutes sont techniques et sans impact métier. Le détail figure dans `docs/architecture/DECISIONS.md`.

| ADR  | Décision                                                                                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0001 | Monorepo pnpm + Turborepo, placé à la racine du dépôt                                                                                                                 |
| 0002 | **ESM partout**, car NestJS 12 est publié uniquement en ESM                                                                                                           |
| 0003 | TypeScript **6.0** (TS 7 n'est pas encore pris en charge par l'outillage), Next.js 16, Expo SDK 57, Zod 4, Vitest 5 ; Prisma reporté (la version `latest` est une RC) |
| 0004 | `decimal.js` : les `number` non entiers sont refusés ; arrondi au demi supérieur **à l'affichage uniquement**                                                         |
| 0005 | Codes d'erreur des familles §55, plus une famille `SYSTEM_*` pour les erreurs purement techniques ; `pageSize` plafonné à 100                                         |
| 0006 | Vitest avec SWC pour l'API ; tests HTTP sur l'application réelle ; bundle Metro comme test du Mobile                                                                  |
| 0007 | helmet, CORS fermé, `X-Request-Id` filtré, Swagger protégé (l'API refuse de démarrer sinon), aucune valeur de configuration dans les erreurs                          |
| 0008 | Dates métier `AAAA-MM-JJ`, sans `Date` ni fuseau horaire                                                                                                              |
| 0009 | Documents sources immuables, contrôlés par empreinte SHA-256 en CI                                                                                                    |

## 6. Fonctionnalités terminées

- Socle monorepo et chaîne qualité (`pnpm check`).
- API : sonde de vie, enveloppes de réponse et d'erreur, corrélation des requêtes, validation,
  sécurité HTTP de base, documentation OpenAPI 3.1.
- Jetons de design Web et Mobile, avec contraste WCAG AA testé.
- Contrôle d'intégrité des documents sources.

## 7. Règles métier implémentées

**Aucune, volontairement.** Seuls des mécanismes techniques exigés par le prompt ont été mis en
place : arrondi d'affichage (§22, §49), scopes déclarés (§8) et format d'API (§37). Ils ne
contiennent aucune valeur métier (tarif, coefficient, seuil ou taux).

## 8. Tests exécutés et résultats

Installation propre (`pnpm install --frozen-lockfile`), puis `pnpm check --force` (sans cache) :
**tout est vert.**

| Espace de travail     | Tests                 | Contenu                                                                                                                                                                                                         |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/types`      | 3 ✅                  | Préfixes des codes d'erreur (§55), unicité, scopes (§8)                                                                                                                                                         |
| `packages/validation` | 9 ✅                  | Pagination (valeurs par défaut, bornes, conversion), UUID, conversion des erreurs Zod                                                                                                                           |
| `packages/config`     | 7 ✅                  | Valeurs par défaut, CORS, Swagger refusé sans identifiants en production, **aucun secret dans les messages d'erreur**                                                                                           |
| `packages/utils`      | 20 ✅                 | 12,345 → 12,35 ; piège du float 1,005 ; pas d'arrondi prématuré ; refus des float ; dates bissextiles                                                                                                           |
| `packages/ui`         | 4 ✅                  | Contraste ≥ 4,5:1 dans les deux thèmes, cohérence des thèmes, variables CSS                                                                                                                                     |
| `apps/api`            | 18 ✅                 | health, préfixe, X-Request-Id (généré, repris, filtré), 400 / 404 / 413 / 500 au format §37, **aucune fuite SQL ni stack trace**, helmet, CORS, Swagger (désactivé, 3.1.0, 401 sans identifiants en production) |
| `apps/web`            | 1 ✅                  | Rendu de la page d'accueil                                                                                                                                                                                      |
| `apps/mobile`         | Typecheck + bundle ✅ | `expo export --platform android` : bundle Hermes produit                                                                                                                                                        |
| **Total**             | **62 tests ✅**       |                                                                                                                                                                                                                 |

Vérifications complémentaires :

- **Test de mutation :** en retirant le filtre global d'erreurs, 5 tests échouent. Les tests
  détectent donc bien la régression.
- **Lint :** un fichier piège contenant `any` est bien détecté, en `.ts` comme en `.tsx`.
- **Démarrage réel** de l'API compilée : `GET /api/v1/health` renvoie 200 et `/api/docs-json`
  renvoie 200 en développement. En production, avec Swagger activé mais sans identifiants,
  l'API **refuse de démarrer** (code de sortie 1).
- **`pnpm sources:verify` :** les cas d'échec ont été testés (fichier non déclaré, fichier
  altéré, fichier déclaré mais absent) et renvoient bien le code 1.
- **Docker Compose :** fichier validé par `docker compose config`.

## 9. Problèmes détectés et écarts

| #   | Constat                                                                                                                      | Traitement                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| P1  | **Documents sources toujours absents** : V2.0, cahier des charges, V2.9, coefficients, modèle de paie, textes réglementaires | Structure prête. Le respect « strict de V2.0–V2.9 » **ne peut pas être vérifié** tant qu'ils manquent              |
| P2  | Le démon Docker n'est pas disponible dans l'environnement de construction                                                    | Compose validé syntaxiquement mais **pas démarré**. À tester sur un poste de développement                         |
| P3  | Le proxy réseau bloque `api.expo.dev`                                                                                        | Mode hors-ligne d'Expo, qui s'appuie sur la table de compatibilité embarquée dans `expo` : même source, sans perte |
| P4  | Écarts avec le plan de Phase 0 : NestJS 12 au lieu de 11, Vitest au lieu de Jest, pas de MinIO                               | Justifiés dans les ADR 0002, 0003 et 0006. Stockage S3 reporté en Phase 3                                          |
| P5  | Nomenclature « VPS/VPS » (prompt) contre « VPS/PVS » (demande de Phase 1)                                                    | REG-04 : dénomination, nature, taux, assiette et assujettissement à valider                                        |
| P6  | Deux versions de React coexistent : 19.3 (Web) et 19.2.3 (Mobile, imposée par Expo SDK 57)                                   | Sans conflit grâce à l'isolation pnpm. À réaligner lors d'une future mise à jour d'Expo                            |

## 10. Points nécessitant validation

Voir `docs/business-rules/POINTS_A_VALIDER.md`. En priorité :

1. **Déposer les documents sources** dans `docs/sources/` (B1 à B7).
2. **REG-01 à REG-09**, y compris **REG-04 VPS/PVS** : pas bloquants avant la Phase 6, mais
   aucun calcul de paie ne se fera sans eux.
3. Points techniques et institutionnels : UI-01 (charte graphique), TECH-01 (licence),
   TECH-02 (identifiant `bj.cspad.djougou`), TECH-03 (nom de domaine).
4. A21 (liste des comptes soumis au MFA) et A24 (mandat de l'administrateur) : **nécessaires
   pour la Phase 2**.

## 11. Dette technique

- Pas encore de tests de composants mobiles (jest-expo) : prévus en Phase 8.
- `apps/api` : le script `dev` repose sur `tsc --watch` et `node --watch`, sans rechargement
  à chaud du module Nest (suffisant pour l'instant).
- Pas encore de limitation de débit (rate limiting) : elle sera ajoutée en Phase 2 avec l'authentification.

## 12. Étape suivante proposée

**PHASE 2 — Base de données, API et sécurité** (phase critique). Elle comprend :

- le schéma Prisma (§13) et les migrations ;
- les triggers d'audit en ajout seul et l'interdiction de suppression des paiements ;
- `document_sequences`, `idempotency_keys` et `outbox_events` ;
- l'authentification : Argon2id, JWT, refresh tokens rotatifs, TOTP, limitation des tentatives ;
- le RBAC avec scopes, contrôlé dans les gardes et dans les services ;
- l'`AuditService` ;
- le seed des rôles : **l'administrateur système n'a aucune permission financière** ;
- les tests de sécurité API : isolation financière, compte désactivé, parent et enseignant
  isolés, appel direct à l'API.

**Prérequis de validation pour la Phase 2 :** A21, A24 et, idéalement, SRC-01 (liste des rôles
et des permissions de la V2.0).

**Je n'engage pas la Phase 2 sans votre accord.**
