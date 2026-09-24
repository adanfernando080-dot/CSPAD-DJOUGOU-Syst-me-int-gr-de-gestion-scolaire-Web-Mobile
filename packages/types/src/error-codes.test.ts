import { describe, expect, it } from 'vitest';
import { ERROR_CODE_PREFIXES, ErrorCodes } from './error-codes.js';

describe('ErrorCodes', () => {
  it('chaque code commence par un préfixe autorisé (§55)', () => {
    for (const code of Object.values(ErrorCodes)) {
      const ok = ERROR_CODE_PREFIXES.some((prefix) => code.startsWith(`${prefix}_`));
      expect(ok, code).toBe(true);
    }
  });

  it('les codes sont uniques', () => {
    const values = Object.values(ErrorCodes);
    expect(new Set(values).size).toBe(values.length);
  });
});
