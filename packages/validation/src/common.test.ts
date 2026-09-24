import { describe, expect, it } from 'vitest';
import { DEFAULT_PAGE_SIZE, paginationQuerySchema, uuidSchema } from './common.js';
import { toApiErrorDetails } from './errors.js';

describe('paginationQuerySchema', () => {
  it('applique les valeurs par défaut', () => {
    expect(paginationQuerySchema.parse({})).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  });

  it('convertit les valeurs texte de la query string', () => {
    expect(paginationQuerySchema.parse({ page: '3', pageSize: '50' })).toEqual({
      page: 3,
      pageSize: 50,
    });
  });

  it.each([{ page: '0' }, { page: '-1' }, { page: '1.5' }, { pageSize: '101' }, { pageSize: 'x' }])(
    'rejette %o',
    (input) => {
      expect(paginationQuerySchema.safeParse(input).success).toBe(false);
    },
  );
});

describe('uuidSchema', () => {
  it('accepte un UUID et rejette le reste', () => {
    expect(uuidSchema.safeParse('3f2c1a52-8a4e-4c1b-9f6e-2b7d5c9a1e30').success).toBe(true);
    expect(uuidSchema.safeParse('123').success).toBe(false);
  });
});

describe('toApiErrorDetails', () => {
  it('produit des détails avec champ et code VALIDATION_*', () => {
    const result = paginationQuerySchema.safeParse({ pageSize: '500' });
    expect(result.success).toBe(false);
    if (result.success) return;
    const [detail] = toApiErrorDetails(result.error);
    expect(detail?.field).toBe('pageSize');
    expect(detail?.code).toMatch(/^VALIDATION_/);
  });
});
