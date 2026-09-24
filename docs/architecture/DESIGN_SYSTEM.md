# Design system

Source unique : `packages/ui/src/tokens.ts`, partagé par le Web et le Mobile.

| Jeton              | Usage                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `colors`           | Thème clair : `primary`, `background`, `surface`, `border`, `text`, `textMuted`, `success`, `warning`, `danger`, `info` |
| `darkColors`       | Thème sombre, avec les mêmes clés (vérifié par test)                                                                    |
| `spacing`          | Échelle de 4 px : xs 4 → xxl 32                                                                                         |
| `radii`            | Arrondis des angles                                                                                                     |
| `typography`       | Police système, tailles, graisses                                                                                       |
| `MIN_TOUCH_TARGET` | 44 px, taille minimale d'une cible tactile                                                                              |

- **Web :** `buildCssVariables()` injecte les variables CSS (`--color-*`, `--space-*`,
  `--radius-*`), avec bascule automatique clair / sombre (`prefers-color-scheme`).
- **Mobile :** les jetons sont importés directement dans les `StyleSheet`.
- **Accessibilité :** un test vérifie un contraste d'au moins 4,5:1 (WCAG AA) pour chaque
  couleur de texte, dans les deux thèmes.
- **Palette provisoire et neutre :** la charte CSPAD n'a pas été fournie (UI-01).

## Principes d'interface (à appliquer à partir de la Phase 2)

- Menus filtrés selon les permissions, **sans jamais servir de sécurité** : l'API reste la seule frontière.
- Listes d'élèves **alphabétiques par défaut**. Un rang ou une moyenne n'est jamais le tri par défaut (§27, §44).
- Aucune valeur calculée (solde, moyenne, rang, remise) n'est saisie ou envoyée par l'interface (§40).
- Montants et notes affichés via `formatDecimalFr` (virgule décimale, arrondi d'affichage).
