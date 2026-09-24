# Base de données (Prisma + PostgreSQL 16)

**Vide en Phase 1. Ce dossier est rempli en Phase 2.**

| Dossier         | Contenu (Phase 2)                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema.prisma` | Modèles du §13, UUID, snake_case (`@@map` / `@map`), `Decimal(15,2)` pour les montants, `Decimal(5,2)` pour les notes, `timestamptz` / `date` |
| `migrations/`   | Migrations Prisma versionnées. Aucune modification manuelle de la base (§58)                                                                  |
| `seed/`         | Seed de développement : données fictives clairement identifiées, sans données réelles (§59)                                                   |
| `sql/`          | SQL complémentaire : triggers d'audit en ajout seul, interdiction de suppression des paiements et reçus validés                               |

Les coefficients officiels ne seront ajoutés au seed qu'après transcription validée de SRC-04 et
SRC-05 (B4). Aucun taux fiscal ou social ne sera ajouté au seed sans validation (REG-01 à REG-09).
