import { type ApiConfig } from '@cspad/config';
import {
  type DynamicModule,
  type MiddlewareConsumer,
  Module,
  type NestModule,
  type Type,
} from '@nestjs/common';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { ConfigModule } from './config/config.module.js';
import { HealthModule } from './health/health.module.js';

/**
 * Module racine du monolithe modulaire.
 * Chaque composante (administration, élèves, pédagogie, finance, paie, communication)
 * sera un module Nest isolé, ajouté ici à partir de la Phase 2.
 */
@Module({})
export class AppModule implements NestModule {
  static forRoot(config: ApiConfig, extraImports: Type[] = []): DynamicModule {
    return {
      module: AppModule,
      imports: [ConfigModule.forRoot(config), HealthModule, ...extraImports],
    };
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*path');
  }
}
