import { ErrorCodes } from '@cspad/types';
import { toApiErrorDetails } from '@cspad/validation';
import { HttpStatus, Injectable, type PipeTransform } from '@nestjs/common';
import { type z } from 'zod';
import { ApiException } from '../errors/api-exception.js';

/** Valide une entrée (body, query, param) avec un schéma Zod partagé (@cspad/validation). */
@Injectable()
export class ZodValidationPipe<TSchema extends z.ZodType> implements PipeTransform {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown): z.output<TSchema> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new ApiException(
        ErrorCodes.VALIDATION_FAILED,
        'Les données envoyées sont invalides.',
        HttpStatus.BAD_REQUEST,
        toApiErrorDetails(result.error),
      );
    }
    return result.data;
  }
}
