import { randomUUID } from 'node:crypto';
import { HttpHeaders } from '@cspad/types';
import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type NextFunction, type Request, type Response } from 'express';

/** Identifiant fourni par le client accepté seulement s'il est court et sans caractère spécial. */
const SAFE_REQUEST_ID = /^[A-Za-z0-9._-]{8,128}$/;

declare module 'express' {
  interface Request {
    requestId?: string;
  }
}

/** Attribue un X-Request-Id à chaque requête et le renvoie dans la réponse (§37). */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.header(HttpHeaders.REQUEST_ID);
    const requestId = incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
    req.requestId = requestId;
    res.setHeader(HttpHeaders.REQUEST_ID, requestId);
    next();
  }
}
