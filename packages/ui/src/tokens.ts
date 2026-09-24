/**
 * Jetons de design partagés Web (Next.js) + Mobile (React Native).
 *
 * Palette NEUTRE provisoire : la charte graphique CSPAD (logo, couleurs institutionnelles)
 * n'a pas été fournie (à valider).
 * Les couleurs de texte respectent un contraste ≥ 4,5:1 sur leur fond (WCAG AA).
 */
export const colors = {
  primary: '#1d4ed8',
  primaryContrast: '#ffffff',
  background: '#ffffff',
  surface: '#f8fafc',
  border: '#cbd5e1',
  text: '#0f172a',
  textMuted: '#475569',
  success: '#15803d',
  warning: '#b45309',
  danger: '#b91c1c',
  info: '#0369a1',
} as const;

export const darkColors: { readonly [K in keyof typeof colors]: string } = {
  primary: '#60a5fa',
  primaryContrast: '#0f172a',
  background: '#0b1120',
  surface: '#111827',
  border: '#334155',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#38bdf8',
};

/** Espacements (px) — échelle de 4. */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radii = { sm: 4, md: 8, lg: 12, full: 9999 } as const;

export const typography = {
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  size: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28 },
  weight: { regular: '400', medium: '500', bold: '700' },
  lineHeight: 1.5,
} as const;

/** Taille minimale d'une cible tactile (px) — accessibilité mobile. */
export const MIN_TOUCH_TARGET = 44;

export type ColorToken = keyof typeof colors;
