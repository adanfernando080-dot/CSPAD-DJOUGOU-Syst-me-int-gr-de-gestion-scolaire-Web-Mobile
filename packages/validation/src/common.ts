import { z } from 'zod';

/** Identifiant UUID (prompt maître §37 : identifiants UUID). */
export const uuidSchema = z.uuid();

/** Taille de page maximale autorisée (décision technique, ADR-0005). */
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;

/** Paramètres de pagination reçus en query string (valeurs texte converties). */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
