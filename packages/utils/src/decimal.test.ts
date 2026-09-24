import { describe, expect, it } from 'vitest';
import { formatDecimalFr, roundForDisplay, toDecimal } from './decimal.js';

describe('toDecimal', () => {
  it('conserve la précision exacte des chaînes', () => {
    expect(toDecimal('0.1').plus('0.2').toString()).toBe('0.3');
  });

  it('refuse les number non entiers (erreur binaire déjà présente)', () => {
    expect(() => toDecimal(12.345)).toThrow(TypeError);
  });

  it('accepte les entiers sûrs', () => {
    expect(toDecimal(50000).toString()).toBe('50000');
  });

  it('refuse les valeurs non finies', () => {
    expect(() => toDecimal('Infinity')).toThrow(TypeError);
    expect(() => toDecimal('abc')).toThrow();
  });
});

describe("roundForDisplay (§22 : arrondi à l'affichage uniquement)", () => {
  it('12,345 → 12,35 (exemple du prompt maître §22)', () => {
    expect(roundForDisplay('12.345')).toBe('12.35');
    expect(formatDecimalFr('12.345')).toBe('12,35');
  });

  it('1,005 → 1,01, là où le float binaire donne 1,00', () => {
    expect((1.005).toFixed(2)).toBe('1.00'); // piège du float binaire
    expect(roundForDisplay('1.005')).toBe('1.01');
  });

  it("ne modifie pas la valeur interne (pas d'arrondi prématuré)", () => {
    const internal = toDecimal('37.035').dividedBy(3); // 12.345
    expect(internal.toString()).toBe('12.345');
    expect(roundForDisplay(internal)).toBe('12.35');
  });

  it('complète avec des zéros', () => {
    expect(roundForDisplay('10')).toBe('10.00');
  });

  it('arrondit les négatifs au demi « loin de zéro »', () => {
    expect(roundForDisplay('-1.005')).toBe('-1.01');
  });
});
