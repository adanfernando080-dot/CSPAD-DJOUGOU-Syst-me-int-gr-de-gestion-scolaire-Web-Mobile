import type { ApiErrorDetail } from '@cspad/types';
import type { z } from 'zod';

/** Convertit les erreurs Zod en détails d'erreur de l'enveloppe API (§37). */
export function toApiErrorDetails(error: z.ZodError): ApiErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.map(String).join('.') : undefined,
    code: `VALIDATION_${issue.code.toUpperCase()}`,
    message: issue.message,
  }));
}
