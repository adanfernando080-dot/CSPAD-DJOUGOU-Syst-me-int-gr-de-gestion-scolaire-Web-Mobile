import { colors, darkColors, radii, spacing } from './tokens.js';

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function declarations(palette: Record<string, string>): string {
  return Object.entries(palette)
    .map(([name, value]) => `--color-${kebab(name)}: ${value};`)
    .join(' ');
}

/** Génère les variables CSS (thème clair + sombre) à partir des jetons, pour le Web. */
export function buildCssVariables(): string {
  const layout = [
    ...Object.entries(spacing).map(([k, v]) => `--space-${k}: ${v}px;`),
    ...Object.entries(radii).map(([k, v]) => `--radius-${k}: ${v}px;`),
  ].join(' ');
  return [
    `:root { ${declarations(colors)} ${layout} color-scheme: light; }`,
    `@media (prefers-color-scheme: dark) { :root { ${declarations(darkColors)} color-scheme: dark; } }`,
  ].join('\n');
}
