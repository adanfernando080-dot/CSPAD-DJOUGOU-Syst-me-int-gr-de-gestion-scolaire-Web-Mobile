/**
 * Familles de codes d'erreur métier (prompt maître §55).
 * Chaque code concret DOIT commencer par l'un de ces préfixes.
 */
export const ERROR_CODE_PREFIXES = [
  'AUTH',
  'AUTHORIZATION',
  'VALIDATION',
  'RESOURCE',
  'CONFLICT',
  'ACADEMIC_YEAR',
  'ADMISSION',
  'ENROLLMENT',
  'PEDAGOGY',
  'GRADE',
  'REPORT_CARD',
  'PROMOTION',
  'FINANCE',
  'CASH',
  'ACCOUNTING',
  'HR',
  'PAYROLL',
  'DOCUMENT',
  'IDEMPOTENCY',
  'CONCURRENCY',
  'EXPORT',
  'RATE_LIMIT',
  // Décision technique (ADR-0005) : erreurs purement techniques, sans sémantique métier.
  'SYSTEM',
] as const;

export type ErrorCodePrefix = (typeof ERROR_CODE_PREFIXES)[number];

/** Codes techniques utilisés par le socle (Phase 1). Les codes métier arrivent avec leurs modules. */
export const ErrorCodes = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  AUTH_UNAUTHENTICATED: 'AUTH_UNAUTHENTICATED',
  AUTHORIZATION_FORBIDDEN: 'AUTHORIZATION_FORBIDDEN',
  CONFLICT_STATE: 'CONFLICT_STATE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SYSTEM_PAYLOAD_TOO_LARGE: 'SYSTEM_PAYLOAD_TOO_LARGE',
  SYSTEM_UNSUPPORTED_MEDIA_TYPE: 'SYSTEM_UNSUPPORTED_MEDIA_TYPE',
  SYSTEM_HTTP_ERROR: 'SYSTEM_HTTP_ERROR',
  SYSTEM_INTERNAL_ERROR: 'SYSTEM_INTERNAL_ERROR',
  SYSTEM_SERVICE_UNAVAILABLE: 'SYSTEM_SERVICE_UNAVAILABLE',
} as const satisfies Record<string, `${ErrorCodePrefix}_${string}`>;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
