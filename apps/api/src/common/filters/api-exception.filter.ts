import { type ApiErrorBody, type ApiErrorDetail, ErrorCodes } from '@cspad/types';
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { ApiException } from '../errors/api-exception.js';

/** Code d'erreur par défaut selon le statut HTTP (§38). */
const CODE_BY_STATUS: Record<number, string> = {
  400: ErrorCodes.VALIDATION_FAILED,
  401: ErrorCodes.AUTH_UNAUTHENTICATED,
  403: ErrorCodes.AUTHORIZATION_FORBIDDEN,
  404: ErrorCodes.RESOURCE_NOT_FOUND,
  409: ErrorCodes.CONFLICT_STATE,
  413: ErrorCodes.SYSTEM_PAYLOAD_TOO_LARGE,
  415: ErrorCodes.SYSTEM_UNSUPPORTED_MEDIA_TYPE,
  429: ErrorCodes.RATE_LIMIT_EXCEEDED,
  503: ErrorCodes.SYSTEM_SERVICE_UNAVAILABLE,
};

/** Messages génériques : on n'expose jamais le message interne d'une erreur inattendue (§55). */
const MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'Requête invalide.',
  401: 'Authentification requise.',
  403: 'Accès refusé.',
  404: 'Ressource introuvable.',
  409: "Conflit avec l'état actuel de la ressource.",
  413: 'Contenu de la requête trop volumineux.',
  415: 'Type de contenu non pris en charge.',
  429: 'Trop de requêtes. Réessayez plus tard.',
  500: 'Erreur interne du serveur.',
  503: 'Service temporairement indisponible.',
};

/** Erreurs levées par body-parser (Express) avant l'arrivée dans Nest. */
interface BodyParserError {
  type: string;
  status: number;
}

function isBodyParserError(error: unknown): error is BodyParserError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as BodyParserError).type === 'string' &&
    typeof (error as BodyParserError).status === 'number'
  );
}

/**
 * Filtre global : toute erreur sort au format `{ "error": {...} }` (§37).
 * - aucune stack trace, requête SQL ou valeur interne n'est renvoyée au client ;
 * - les erreurs inattendues sont journalisées côté serveur avec le requestId (journal technique, §56).
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ApiExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const requestId = request.requestId ?? 'unknown';

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ErrorCodes.SYSTEM_INTERNAL_ERROR;
    let message = MESSAGE_BY_STATUS[500] as string;
    let details: ApiErrorDetail[] = [];

    if (exception instanceof ApiException) {
      status = exception.getStatus();
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = CODE_BY_STATUS[status] ?? ErrorCodes.SYSTEM_HTTP_ERROR;
      message = MESSAGE_BY_STATUS[status] ?? exception.message;
    } else if (isBodyParserError(exception) && exception.status >= 400 && exception.status < 500) {
      status = exception.status;
      code = CODE_BY_STATUS[status] ?? ErrorCodes.VALIDATION_FAILED;
      message =
        exception.type === 'entity.parse.failed'
          ? 'Le corps de la requête n’est pas un JSON valide.'
          : (MESSAGE_BY_STATUS[status] ?? 'Requête invalide.');
    }

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(
        `[${requestId}] ${request.method} ${request.originalUrl} → ${status}`,
        stack,
      );
    }

    const body: ApiErrorBody = {
      error: { code, message, status, requestId, timestamp: new Date().toISOString(), details },
    };
    response.status(status).json(body);
  }
}
