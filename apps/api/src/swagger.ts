import { type ApiConfig } from '@cspad/config';
import { HttpHeaders } from '@cspad/types';
import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { APP_VERSION } from './version.js';

export const SWAGGER_PATH = 'api/docs';

/**
 * Documentation OpenAPI 3.1 (§41).
 * - désactivée par défaut ;
 * - en staging/production : protégée par authentification HTTP Basic (identifiants obligatoires,
 *   vérifiés au démarrage par @cspad/config).
 */
export function setupSwagger(app: INestApplication, config: ApiConfig): void {
  if (!config.swagger.enabled) return;

  if (config.isProductionLike) {
    const credentials = config.swagger.credentials;
    if (!credentials) throw new Error('Swagger activé sans identifiants en staging/production');
    app.use(
      [`/${SWAGGER_PATH}`, `/${SWAGGER_PATH}-json`, `/${SWAGGER_PATH}-yaml`],
      basicAuth({ users: { [credentials.user]: credentials.password }, challenge: true }),
    );
  }

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setOpenAPIVersion('3.1.0')
      .setTitle('CSPAD DJOUGOU — API')
      .setDescription(
        'API REST du système intégré de gestion scolaire. Toutes les règles d’autorisation sont appliquées côté serveur.',
      )
      .setVersion(APP_VERSION)
      .addGlobalParameters({
        name: HttpHeaders.REQUEST_ID,
        in: 'header',
        required: false,
        description: 'Identifiant de corrélation (généré par le serveur s’il est absent).',
        schema: { type: 'string' },
      })
      .build(),
  );
  SwaggerModule.setup(SWAGGER_PATH, app, document, { jsonDocumentUrl: `${SWAGGER_PATH}-json` });
}
