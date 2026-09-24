import { colors, spacing, typography } from '@cspad/ui';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Écran d'accueil provisoire (Phase 1 — socle technique).
 * Les espaces Parent et Enseignant (Phase 8) utiliseront la même API et les mêmes
 * contrôles d'autorisation serveur que le Web.
 */
export default function HomeScreen() {
  return (
    <View style={styles.container} accessibilityRole="summary">
      <Text style={styles.title} accessibilityRole="header">
        CSPAD DJOUGOU
      </Text>
      <Text style={styles.subtitle}>Système intégré de gestion scolaire</Text>
      <Text style={styles.body}>
        Application en cours de construction. L’accès sera ouvert après la mise en place de
        l’authentification.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: { fontSize: typography.size.xxl, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: typography.size.md, color: colors.textMuted, marginTop: spacing.sm },
  body: { fontSize: typography.size.md, color: colors.text, marginTop: spacing.xl },
});
