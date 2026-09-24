import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('affiche le nom de l’établissement sans donnée métier', () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain('CSPAD DJOUGOU');
    expect(html).toContain('<main>');
    expect(html).not.toMatch(/FCFA|paiement|note/i);
  });
});
