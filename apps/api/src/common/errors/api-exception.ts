import { type ApiErrorDetail } from '@cspad/types';
import { HttpException } from '@nestjs/common';

/**
 * Exception applicative portant un code d'erreur explicite (§55).
 * Les modules métier lèvent cette exception (ou une sous-classe) plutôt qu'une HttpException brute.
 */
export class ApiException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: number,
    public readonly details: ApiErrorDetail[] = [],
  ) {
    super(message, status);
  }
}
