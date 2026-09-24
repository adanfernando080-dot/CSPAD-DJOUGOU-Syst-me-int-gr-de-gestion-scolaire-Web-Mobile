import { describe, expect, it } from 'vitest';
import { compareBusinessDates, formatBusinessDate, parseBusinessDate } from './business-date.js';

describe('parseBusinessDate', () => {
  it('analyse une date valide', () => {
    expect(parseBusinessDate('2026-09-24')).toEqual({ year: 2026, month: 9, day: 24 });
  });

  it.each([
    '2026-02-29',
    '2026-13-01',
    '2026-00-10',
    '2026-04-31',
    '26-09-24',
    '2026-09-24T00:00:00Z',
    '',
  ])('rejette %s', (value) => {
    expect(parseBusinessDate(value)).toBeNull();
  });

  it('accepte le 29 février des années bissextiles', () => {
    expect(parseBusinessDate('2028-02-29')).not.toBeNull();
    expect(parseBusinessDate('2000-02-29')).not.toBeNull();
    expect(parseBusinessDate('1900-02-29')).toBeNull();
  });
});

describe('formatBusinessDate / compareBusinessDates', () => {
  it('fait un aller-retour sans décalage de fuseau', () => {
    const date = parseBusinessDate('2027-01-01');
    expect(date && formatBusinessDate(date)).toBe('2027-01-01');
  });

  it('compare les dates', () => {
    const a = parseBusinessDate('2026-09-01')!;
    const b = parseBusinessDate('2027-06-30')!;
    expect(compareBusinessDates(a, b)).toBeLessThan(0);
    expect(compareBusinessDates(b, a)).toBeGreaterThan(0);
    expect(compareBusinessDates(a, a)).toBe(0);
  });
});
