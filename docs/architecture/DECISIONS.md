# Décisions d'architecture (ADR)

Seules des décisions **techniques sans impact métier** figurent ici (§62). Toute décision métier
est soumise à validation du CSPAD : voir les points ouverts au §5 de
[`docs/phase-0/RAPPORT_PHASE_0.md`](../phase-0/RAPPORT_PHASE_0.md).

## ADR-0001 — Monorepo pnpm + Turborepo, à la racine du dépôt

- **Contexte :** le prompt §4 impose un monorepo `apps/`, `packages/`, `database/`, `docs/`…
- **Décision :** pnpm 10 (installation isolée, scripts d'installation refusés par défaut) et
  Turborepo 2 (orchestration et cache). Le dépôt Git **est** la racine `cspad-djougou/`.
- **Conséquence :** `pnpm check` exécute format, lint, typecheck, tests, build et vérification
  des sources.

## ADR-0002 — ESM partout

- **Contexte :** NestJS 12 (version stable actuelle) est publié **uniquement en ESM**.
- **Décision :** tous les paquets et l'API sont en ESM (`"type": "module"`,
  `module: nodenext`, imports relatifs en `.js`). Le Web (Next.js) et le Mobile (Metro)
  consomment les paquets compilés (`dist/`).
- **Écart avec la Phase 0 :** le rapport de Phase 0 citait NestJS 11. On retient la version
  stable courante, sans impact métier.

## ADR-0003 — Versions de référence

| Outil      | Version                        | Remarque                                                                                                             |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Node.js    | 22 LTS (≥ 22.12)               |                                                                                                                      |
| TypeScript | 6.0.x                          | TS 7 (compilateur natif) n'est pas encore pris en charge par typescript-eslint ni le CLI NestJS                      |
| NestJS     | 12.x                           |                                                                                                                      |
| Next.js    | 16.x (React 19.3)              |                                                                                                                      |
| Expo       | SDK 57 (RN 0.86, React 19.2.3) | Versions imposées par la table de compatibilité d'Expo                                                               |
| Zod        | 4.x                            |                                                                                                                      |
| Vitest     | 5.x                            |                                                                                                                      |
| ESLint     | 10.x (flat config)             |                                                                                                                      |
| Prisma     | **reporté en Phase 2**         | La balise `latest` de Prisma pointe actuellement vers une RC (8.0.0-rc). Une version stable sera épinglée en Phase 2 |
| PostgreSQL | 16                             | §12                                                                                                                  |

## ADR-0004 — Nombres décimaux exacts et arrondi d'affichage

- **Décision :** `decimal.js` (instance isolée, précision 40) via `@cspad/utils`.
  `toDecimal()` **refuse** un `number` non entier, car il porte déjà une erreur binaire.
  `roundForDisplay()` arrondit au demi supérieur (12,345 → 12,35), **uniquement à l'affichage**.
- **En base (Phase 2) :** `DECIMAL(15,2)` pour les montants et `DECIMAL(5,2)` pour les notes (§12).
- **Point ouvert lié :** A11 (le seuil de passage s'applique-t-il à la valeur exacte ou arrondie ?).

## ADR-0005 — Format d'erreur et codes

- Enveloppe `{ "error": { code, message, status, requestId, timestamp, details } }` (§37).
- Codes préfixés par les familles du §55. Ajout d'une famille **`SYSTEM_*`** pour les erreurs
  purement techniques (500, 413, 415, 503), absentes de la liste §55. Ce n'est pas une règle métier.
- Les erreurs 5xx renvoient un message générique ; le détail n'est écrit que dans le journal
  technique, avec le `requestId`.
- Pagination : `pageSize` par défaut à 20 (§37), plafonné à 100 (limite technique contre les
  requêtes abusives).

## ADR-0006 — Tests

- **Décision :** Vitest pour les paquets, l'API (plugin SWC, nécessaire aux métadonnées de
  décorateurs NestJS) et le Web. L'API est testée par HTTP (`supertest`) sur l'application
  réellement construite par `createApp()`, avec le même pipeline qu'en production.
- **Mobile :** typecheck, lint et **bundle Metro réel** (`export:check`) en Phase 1. Les tests
  de composants (jest-expo) arrivent en Phase 8.
- **Écart avec la Phase 0 :** Jest était envisagé pour l'API. Vitest unifie l'outillage.

## ADR-0007 — Sécurité du socle

- `helmet`, `X-Powered-By` masqué, CORS fermé par défaut, corps JSON limité à 1 Mo par défaut.
- `X-Request-Id` client accepté seulement s'il correspond à `^[A-Za-z0-9._-]{8,128}$`. Sinon,
  un UUID est généré (protection contre l'injection dans les journaux).
- Swagger désactivé par défaut. En staging et en production, il exige une authentification
  Basic, et l'API **refuse de démarrer** si les identifiants manquent (§41).
- Configuration validée au démarrage. Les messages d'erreur n'affichent jamais les valeurs (§57).
- `trust proxy` activé uniquement en staging et en production (derrière Nginx).

## ADR-0008 — Dates métier

- `@cspad/utils` fournit `BusinessDate` (`AAAA-MM-JJ` strict, sans `Date` JavaScript ni fuseau),
  pour les dates métier (§50). Les horodatages techniques restent en ISO 8601 UTC.

## ADR-0009 — Documents sources immuables

- `docs/sources/` est exclu de Prettier. Chaque fichier est déclaré dans `MANIFEST.json` avec
  son SHA-256. `pnpm sources:verify` (exécuté en CI) échoue en cas d'altération, de fichier
  manquant ou de fichier non déclaré.
