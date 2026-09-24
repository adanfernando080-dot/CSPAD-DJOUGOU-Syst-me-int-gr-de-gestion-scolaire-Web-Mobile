import { readFileSync } from 'node:fs';
import { loadApiConfig } from '@cspad/config';
import { type ApiErrorBody } from '@cspad/types';
import { paginationQuerySchema, type PaginationQuery } from '@cspad/validation';
import { Body, Controller, Get, type INestApplication, Module, Post, Query } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.factory.js';
import { ZodValidationPipe } from '../src/common/pipes/zod-validation.pipe.js';
import { APP_VERSION } from '../src/version.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SECRET = 'SELECT * FROM users WHERE password_hash = secret';

/** Contrôleur de test : exerce le socle (validation, erreurs) sans aucune logique métier. */
@Controller('__socle-test')
class SocleTestController {
  @Get('items')
  list(@Query(new ZodValidationPipe(paginationQuerySchema)) query: PaginationQuery) {
    return { data: [], meta: { ...query, total: 0, totalPages: 0 } };
  }

  @Post('echo')
  echo(@Body() body: unknown) {
    return { data: body };
  }

  @Get('boom')
  boom(): never {
    throw new Error(SECRET);
  }
}

@Module({ controllers: [SocleTestController] })
class SocleTestModule {}

async function start(env: Record<string, string> = {}): Promise<INestApplication> {
  const app = await createApp(loadApiConfig({ APP_ENV: 'test', LOG_LEVEL: 'fatal', ...env }), {
    extraImports: [SocleTestModule],
  });
  await app.init();
  return app;
}

function expectErrorEnvelope(body: ApiErrorBody, status: number, code: string): void {
  expect(body.error.status).toBe(status);
  expect(body.error.code).toBe(code);
  expect(typeof body.error.message).toBe('string');
  expect(body.error.requestId).toBeTruthy();
  expect(Number.isNaN(Date.parse(body.error.timestamp))).toBe(false);
  expect(Array.isArray(body.error.details)).toBe(true);
}

describe('API — socle technique', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await start();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/health', () => {
    it('répond 200 au format { data }', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
      expect(res.body.data).toMatchObject({
        status: 'ok',
        service: 'cspad-api',
        version: APP_VERSION,
      });
    });

    it('n’est pas servi hors du préfixe /api/v1', async () => {
      await request(app.getHttpServer()).get('/health').expect(404);
    });
  });

  describe('X-Request-Id', () => {
    it('génère un UUID si absent', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health');
      expect(res.headers['x-request-id']).toMatch(UUID);
    });

    it('réutilise un identifiant client valide', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .set('X-Request-Id', 'client-req-12345');
      expect(res.headers['x-request-id']).toBe('client-req-12345');
    });

    it('remplace un identifiant client dangereux', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .set('X-Request-Id', '<script>alert(1)</script>');
      expect(res.headers['x-request-id']).toMatch(UUID);
    });
  });

  describe('format des erreurs (§37, §55)', () => {
    it('404 : route inconnue', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/inexistant').expect(404);
      expectErrorEnvelope(res.body, 404, 'RESOURCE_NOT_FOUND');
      expect(res.body.error.requestId).toBe(res.headers['x-request-id']);
    });

    it('400 : validation Zod avec détails par champ', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/__socle-test/items?pageSize=500')
        .expect(400);
      expectErrorEnvelope(res.body, 400, 'VALIDATION_FAILED');
      expect(res.body.error.details[0].field).toBe('pageSize');
    });

    it('200 : pagination valide au format collection', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/__socle-test/items?page=2')
        .expect(200);
      expect(res.body).toEqual({
        data: [],
        meta: { page: 2, pageSize: 20, total: 0, totalPages: 0 },
      });
    });

    it('400 : JSON malformé', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/__socle-test/echo')
        .set('Content-Type', 'application/json')
        .send('{"a":')
        .expect(400);
      expectErrorEnvelope(res.body, 400, 'VALIDATION_FAILED');
    });

    it('413 : corps trop volumineux', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/__socle-test/echo')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ blob: 'x'.repeat(1_100_000) }))
        .expect(413);
      expectErrorEnvelope(res.body, 413, 'SYSTEM_PAYLOAD_TOO_LARGE');
    });

    it('500 : aucune fuite de message interne, SQL ou stack trace', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/__socle-test/boom').expect(500);
      expectErrorEnvelope(res.body, 500, 'SYSTEM_INTERNAL_ERROR');
      const raw = JSON.stringify(res.body);
      expect(raw).not.toContain('SELECT');
      expect(raw).not.toContain('secret');
      expect(raw).not.toContain('.ts:');
    });
  });

  describe('en-têtes de sécurité', () => {
    it('applique helmet et masque X-Powered-By', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('CORS fermé par défaut', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .set('Origin', 'https://malveillant.example');
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  it('Swagger désactivé par défaut', async () => {
    await request(app.getHttpServer()).get('/api/docs-json').expect(404);
  });
});

describe('API — CORS configuré', () => {
  it('autorise uniquement les origines déclarées', async () => {
    const app = await start({ API_CORS_ORIGINS: 'https://web.cspad.test' });
    try {
      const allowed = await request(app.getHttpServer())
        .get('/api/v1/health')
        .set('Origin', 'https://web.cspad.test');
      expect(allowed.headers['access-control-allow-origin']).toBe('https://web.cspad.test');
      const denied = await request(app.getHttpServer())
        .get('/api/v1/health')
        .set('Origin', 'https://autre.example');
      expect(denied.headers['access-control-allow-origin']).toBeUndefined();
    } finally {
      await app.close();
    }
  });
});

describe('API — Swagger / OpenAPI 3.1 (§41)', () => {
  it('servi en développement quand activé', async () => {
    const app = await start({ APP_ENV: 'development', SWAGGER_ENABLED: 'true' });
    try {
      const res = await request(app.getHttpServer()).get('/api/docs-json').expect(200);
      expect(res.body.openapi).toBe('3.1.0');
      expect(Object.keys(res.body.paths)).toContain('/api/v1/health');
    } finally {
      await app.close();
    }
  });

  it('protégé par authentification en production', async () => {
    const password = 'p'.repeat(24);
    const app = await start({
      APP_ENV: 'production',
      SWAGGER_ENABLED: 'true',
      SWAGGER_USER: 'doc',
      SWAGGER_PASSWORD: password,
    });
    try {
      await request(app.getHttpServer()).get('/api/docs-json').expect(401);
      await request(app.getHttpServer()).get('/api/docs').expect(401);
      await request(app.getHttpServer()).get('/api/docs-json').auth('doc', 'mauvais').expect(401);
      await request(app.getHttpServer()).get('/api/docs-json').auth('doc', password).expect(200);
    } finally {
      await app.close();
    }
  });
});

describe('version', () => {
  it('APP_VERSION est synchronisée avec package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      version: string;
    };
    expect(APP_VERSION).toBe(pkg.version);
  });
});
