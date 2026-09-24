/**
 * Enveloppes de réponse de l'API REST /api/v1 (prompt maître §37).
 */

/** Métadonnées de pagination d'une collection. */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Réponse contenant un objet unique : `{ "data": {} }`. */
export interface ApiObjectResponse<T> {
  data: T;
}

/** Réponse contenant une collection paginée : `{ "data": [], "meta": {...} }`. */
export interface ApiCollectionResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Détail d'une erreur (ex. champ invalide). */
export interface ApiErrorDetail {
  field?: string;
  code: string;
  message: string;
}

/** Corps d'une réponse d'erreur : `{ "error": {...} }`. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    status: number;
    requestId: string;
    timestamp: string;
    details: ApiErrorDetail[];
  };
}
