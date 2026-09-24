import { buildCssVariables } from '@cspad/ui';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'CSPAD DJOUGOU',
  description: 'Système intégré de gestion scolaire — CSPAD Djougou',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Variables CSS générées depuis les jetons partagés @cspad/ui (contenu statique). */}
        <style>{buildCssVariables()}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
