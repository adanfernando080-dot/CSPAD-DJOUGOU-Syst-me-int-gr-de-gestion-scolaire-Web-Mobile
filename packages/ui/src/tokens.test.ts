import { describe, expect, it } from 'vitest';
import { buildCssVariables } from './css-variables.js';
import { colors, darkColors } from './tokens.js';

/** Contraste WCAG 2.x entre deux couleurs hexadécimales #rrggbb. */
function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe('jetons de couleur', () => {
  it.each([
    ['clair', colors],
    ['sombre', darkColors],
  ])('thème %s : texte lisible (≥ 4,5:1)', (_name, palette) => {
    for (const fg of ['text', 'textMuted', 'danger', 'success', 'primary'] as const) {
      expect(contrast(palette[fg], palette.background), fg).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(palette.primaryContrast, palette.primary)).toBeGreaterThanOrEqual(4.5);
  });

  it('le thème sombre définit les mêmes jetons que le thème clair', () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(colors).sort());
  });

  it('génère les variables CSS', () => {
    const css = buildCssVariables();
    expect(css).toContain('--color-text-muted: #475569;');
    expect(css).toContain('prefers-color-scheme: dark');
  });
});
