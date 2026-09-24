import 'reflect-metadata';
import { type ApiConfig } from '@cspad/config';
import { API_PREFIX, HttpHeaders } from '@cspad/types';
import { type INestApplication, type LogLevel, type Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { ApiExceptionFilter } from './common/filters/api-exception.filter.js';
import { setupSwagger } from './swagger.js';

const NEST_LOG_LEVELS: Record<ApiConfig['logLevel'], LogLevel[]> = {
  fatal: ['fatal'],
  error: ['fatal', 'error'],
  warn: ['fatal', 'error', 'warn'],
  info: ['fatal', 'error', 'warn', 'log'],
  debug: ['fatal', 'error', 'warn', 'log', 'debug'],
  trace: ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'],
};

export interface CreateAppOptions {
  /** Modules supplémentaires — réservé aux tests (ex. contrôleurs de test du socle). */
  extraImports?: Type[];
}

/** Construit l'application (utilisé par main.ts et par les tests d'API). */
export async function createApp(
  config: ApiConfig,
  options: CreateAppOptions = {},
): Promise<INestApplication> {
  const root = AppModule.forRoot(config, options.extraImports);
  const app = await NestFactory.create<NestExpressApplication>(root, {
    bodyParser: false,
    logger: NEST_LOG_LEVELS[config.logLevel],
  });

  app.disable('x-powered-by');
  app.set('trust proxy', config.isProductionLike ? 1 : false); // derrière Nginx en staging/production
  app.use(helmet());
  app.useBodyParser('json', { limit: config.bodyLimit });
  app.enableCors(
    config.corsOrigins.length > 0
      ? {
          origin: [...config.corsOrigins],
          credentials: true,
          exposedHeaders: [HttpHeaders.REQUEST_ID],
        }
      : { origin: false },
  );
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableShutdownHooks();

  setupSwagger(app, config);
  return app;
}
