/**
 * Dates MÉTIER (prompt maître §50) : une date calendaire sans heure ni fuseau.
 * On ne passe jamais par `Date` pour éviter les décalages de fuseau implicites.
 */
export interface BusinessDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function daysInMonth(year: number, month: number): number {
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}

/** Analyse strictement une date `AAAA-MM-JJ`. Retourne `null` si invalide. */
export function parseBusinessDate(value: string): BusinessDate | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return Object.freeze({ year, month, day });
}

export function formatBusinessDate(date: BusinessDate): string {
  const pad = (n: number, size: number) => String(n).padStart(size, '0');
  return `${pad(date.year, 4)}-${pad(date.month, 2)}-${pad(date.day, 2)}`;
}

/** Comparaison : négatif si a < b, 0 si égal, positif si a > b. */
export function compareBusinessDates(a: BusinessDate, b: BusinessDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}
