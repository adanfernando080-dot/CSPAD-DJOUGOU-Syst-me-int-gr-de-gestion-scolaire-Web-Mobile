import { ConfigValidationError, loadApiConfig } from '@cspad/config';
import { Logger } from '@nestjs/common';
import { createApp } from './app.factory.js';

async function bootstrap(): Promise<void> {
  const config = loadApiConfig(process.env);
  const app = await createApp(config);
  await app.listen(config.port);
  new Logger('Bootstrap').log(`API CSPAD démarrée (${config.appEnv}) sur le port ${config.port}`);
}

bootstrap().catch((error: unknown) => {
  // Échec au démarrage : message explicite, sans valeurs de configuration (§57).
  const message = error instanceof ConfigValidationError ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
