import { z } from 'zod';

/**
 * Environnements applicatifs (prompt maître §3 : development / staging / production).
 * `test` est réservé à l'exécution des tests automatisés.
 */
export const APP_ENVIRONMENTS = ['development', 'test', 'staging', 'production'] as const;
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

const booleanFromEnv = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

const apiEnvSchema = z
  .object({
    APP_ENV: z.enum(APP_ENVIRONMENTS).default('development'),
    API_PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    API_CORS_ORIGINS: z
      .string()
      .default('')
      .transform((value) =>
        value
          .split(',')
          .map((origin) => origin.trim())
          .filter((origin) => origin.length > 0),
      ),
    API_BODY_LIMIT: z.string().default('1mb'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    SWAGGER_ENABLED: booleanFromEnv,
    SWAGGER_USER: z.string().optional(),
    SWAGGER_PASSWORD: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    // §41 : Swagger protégé en staging/production.
    const exposed =
      env.SWAGGER_ENABLED && (env.APP_ENV === 'staging' || env.APP_ENV === 'production');
    if (
      exposed &&
      (!env.SWAGGER_USER || !env.SWAGGER_PASSWORD || env.SWAGGER_PASSWORD.length < 16)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['SWAGGER_PASSWORD'],
        message:
          'SWAGGER_USER et SWAGGER_PASSWORD (16 caractères minimum) sont obligatoires pour activer Swagger en staging/production',
      });
    }
  });

export interface ApiConfig {
  readonly appEnv: AppEnvironment;
  readonly isProductionLike: boolean;
  readonly port: number;
  readonly corsOrigins: readonly string[];
  readonly bodyLimit: string;
  readonly logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  readonly swagger: {
    readonly enabled: boolean;
    readonly credentials: { readonly user: string; readonly password: string } | null;
  };
}

export class ConfigValidationError extends Error {
  constructor(public readonly problems: string[]) {
    // Ne jamais inclure les VALEURS des variables : elles peuvent contenir des secrets (§57).
    super(`Configuration invalide :\n - ${problems.join('\n - ')}`);
    this.name = 'ConfigValidationError';
  }
}

/** Valide et fige la configuration de l'API. Lève `ConfigValidationError` si invalide. */
export function loadApiConfig(env: Record<string, string | undefined>): ApiConfig {
  const parsed = apiEnvSchema.safeParse(env);
  if (!parsed.success) {
    throw new ConfigValidationError(
      parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    );
  }
  const e = parsed.data;
  const isProductionLike = e.APP_ENV === 'staging' || e.APP_ENV === 'production';
  return Object.freeze({
    appEnv: e.APP_ENV,
    isProductionLike,
    port: e.API_PORT,
    corsOrigins: Object.freeze([...e.API_CORS_ORIGINS]),
    bodyLimit: e.API_BODY_LIMIT,
    logLevel: e.LOG_LEVEL,
    swagger: Object.freeze({
      enabled: e.SWAGGER_ENABLED,
      credentials:
        isProductionLike && e.SWAGGER_USER && e.SWAGGER_PASSWORD
          ? Object.freeze({ user: e.SWAGGER_USER, password: e.SWAGGER_PASSWORD })
          : null,
    }),
  });
}
