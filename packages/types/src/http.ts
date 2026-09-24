/** En-têtes HTTP transverses (prompt maître §37). */
export const HttpHeaders = {
  REQUEST_ID: 'X-Request-Id',
  IDEMPOTENCY_KEY: 'Idempotency-Key',
} as const;

/** Préfixe versionné de l'API. */
export const API_PREFIX = 'api/v1';
