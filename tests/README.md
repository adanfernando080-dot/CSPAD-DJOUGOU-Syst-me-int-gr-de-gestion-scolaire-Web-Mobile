# Tests transverses

- **Tests unitaires et tests d'API d'un module :** placés à côté du code (`*.test.ts` dans
  `packages/*/src` et `apps/api/test`), lancés par `pnpm test`.
- **Ce dossier :** réservé aux suites transverses, qui couvrent plusieurs applications ou
  nécessitent un environnement complet. Elles sont ajoutées à partir de la Phase 2 :

| Dossier        | Contenu                                                                            |
| -------------- | ---------------------------------------------------------------------------------- |
| `integration/` | Prisma, transactions, sur PostgreSQL réel                                          |
| `api/`         | Scénarios API de bout en bout                                                      |
| `security/`    | Finance interdite, parent isolé, enseignant isolé, compte désactivé, exports (§51) |
| `e2e/`         | Admission, inscription, paiement, notes, bulletin, paie (Playwright)               |
| `mobile/`      | Parcours parent et enseignant                                                      |
| `documents/`   | Reçu, bulletin scolaire, bulletin de paie                                          |
| `performance/` | Charge                                                                             |
| `regression/`  | Non-régression                                                                     |
| `fixtures/`    | Données de test fictives                                                           |
