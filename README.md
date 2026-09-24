# CSPAD DJOUGOU — Système intégré de gestion scolaire

Plateforme Web et Mobile du **Complexe Scolaire Privé des Assemblées de Dieu de Djougou** :
administration, élèves et inscriptions, pédagogie, finance, personnel et paie, communication.
Périmètre : Prématernelle, Maternelle, Primaire et Collège. Année initiale : 2026–2027.

> **État : Phase 1 terminée (socle technique).** Aucune fonctionnalité métier n'est encore
> implémentée. Voir [`docs/phase-1/RAPPORT_PHASE_1.md`](docs/phase-1/RAPPORT_PHASE_1.md).

## Prérequis

- Node.js 22 (≥ 22.12), voir `.nvmrc`
- pnpm 10 (`corepack enable`)
- Docker, pour PostgreSQL en développement

## Démarrage

```bash
pnpm install
cp .env.example .env        # puis adapter les valeurs locales
pnpm build                  # compile les paquets partagés
pnpm db:up                  # PostgreSQL 16 local (utilisé à partir de la Phase 2)

pnpm --filter @cspad/api dev      # API     → http://localhost:3001/api/v1/health
pnpm --filter @cspad/web dev      # Web     → http://localhost:3000
pnpm --filter @cspad/mobile dev   # Mobile  → Expo
```

Swagger (développement, si `SWAGGER_ENABLED=true`) : <http://localhost:3001/api/docs>.

## Commandes

| Commande                 | Rôle                                                           |
| ------------------------ | -------------------------------------------------------------- |
| `pnpm check`             | Tout vérifier : format, lint, typecheck, tests, build, sources |
| `pnpm lint`              | ESLint                                                         |
| `pnpm typecheck`         | TypeScript strict                                              |
| `pnpm test`              | Tests (Vitest)                                                 |
| `pnpm build`             | Build de tous les paquets et applications                      |
| `pnpm format`            | Formatage Prettier                                             |
| `pnpm sources:verify`    | Intégrité des documents sources (`docs/sources/MANIFEST.json`) |
| `pnpm db:up` / `db:down` | PostgreSQL de développement                                    |

## Structure

```
apps/        api (NestJS) · web (Next.js) · mobile (Expo)
packages/    types · validation · business-rules · config · utils · ui
database/    prisma/ (schéma, migrations, seed, sql) — Phase 2
docs/        sources/ · architecture/ · business-rules/ · phase-N/ …
tests/       suites transverses (sécurité, e2e, …) — Phase 2+
docker/      environnement de développement
```

## Documentation

- [Architecture](docs/architecture/ARCHITECTURE.md) · [Décisions (ADR)](docs/architecture/DECISIONS.md)
  · [Design system](docs/architecture/DESIGN_SYSTEM.md) · [Flux principaux](docs/architecture/FLUX_PRINCIPAUX.md)
- [Documents sources](docs/sources/README.md) · [Points à valider](docs/business-rules/POINTS_A_VALIDER.md)

## Règles fondamentales

- Toute autorisation est contrôlée **côté serveur**. L'interface n'est jamais une frontière de sécurité.
- Aucune donnée financière n'est accessible sans permission financière, y compris pour l'administrateur système.
- Aucun calcul critique n'est confié au client (soldes, moyennes, rangs, remises, taxes).
- Aucune règle métier, aucun coefficient ni aucun taux fiscal n'est inventé : tout point manquant
  est inscrit au registre des points à valider.

## Licence

Propriétaire, tous droits réservés. Voir [LICENSE](LICENSE).
