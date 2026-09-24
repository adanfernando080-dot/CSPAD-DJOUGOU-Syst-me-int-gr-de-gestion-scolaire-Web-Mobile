/**
 * Scopes de données (prompt maître §8).
 * Modèle : Utilisateur → Rôle → Permission → Module → Action → Scope.
 * L'évaluation se fait TOUJOURS côté serveur (implémentation en Phase 2).
 */
export const DATA_SCOPES = [
  'ALL',
  'ASSIGNED_CLASSES',
  'ASSIGNED_SUBJECTS',
  'OWN_CHILDREN',
  'OWN_DATA',
] as const;

export type DataScope = (typeof DATA_SCOPES)[number];
