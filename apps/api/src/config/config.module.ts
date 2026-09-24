import { type ApiConfig } from '@cspad/config';
import { type DynamicModule, Global, Module } from '@nestjs/common';

/** Jeton d'injection de la configuration validée. */
export const API_CONFIG = Symbol('API_CONFIG');

@Global()
@Module({})
export class ConfigModule {
  static forRoot(config: ApiConfig): DynamicModule {
    return {
      module: ConfigModule,
      providers: [{ provide: API_CONFIG, useValue: config }],
      exports: [API_CONFIG],
    };
  }
}
