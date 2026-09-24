import { describe, expect, it } from 'vitest';
import { ConfigValidationError, loadApiConfig } from './api-config.js';

describe('loadApiConfig', () => {
  it('fournit des valeurs par défaut sûres', () => {
    const config = loadApiConfig({});
    expect(config.appEnv).toBe('development');
    expect(config.port).toBe(3001);
    expect(config.swagger.enabled).toBe(false);
    expect(config.corsOrigins).toEqual([]);
    expect(Object.isFrozen(config)).toBe(true);
  });

  it('découpe la liste des origines CORS', () => {
    const config = loadApiConfig({ API_CORS_ORIGINS: 'http://a.test, http://b.test ,' });
    expect(config.corsOrigins).toEqual(['http://a.test', 'http://b.test']);
  });

  it('refuse Swagger en production sans identifiants', () => {
    expect(() => loadApiConfig({ APP_ENV: 'production', SWAGGER_ENABLED: 'true' })).toThrow(
      ConfigValidationError,
    );
  });

  it('refuse un mot de passe Swagger trop court en staging', () => {
    expect(() =>
      loadApiConfig({
        APP_ENV: 'staging',
        SWAGGER_ENABLED: 'true',
        SWAGGER_USER: 'doc',
        SWAGGER_PASSWORD: 'court',
      }),
    ).toThrow(ConfigValidationError);
  });

  it('accepte Swagger protégé en production', () => {
    const config = loadApiConfig({
      APP_ENV: 'production',
      SWAGGER_ENABLED: 'true',
      SWAGGER_USER: 'doc',
      SWAGGER_PASSWORD: 'x'.repeat(24),
    });
    expect(config.isProductionLike).toBe(true);
    expect(config.swagger.credentials?.user).toBe('doc');
  });

  it("n'expose jamais la valeur d'une variable dans le message d'erreur", () => {
    const secret = 'valeur-secrete-ne-pas-afficher';
    try {
      loadApiConfig({ API_PORT: secret });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigValidationError);
      expect((error as Error).message).not.toContain(secret);
    }
  });

  it('rejette un environnement inconnu', () => {
    expect(() => loadApiConfig({ APP_ENV: 'prod' })).toThrow(ConfigValidationError);
  });
});
