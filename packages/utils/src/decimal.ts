import decimalJs from 'decimal.js';

// Interop : sous `nodenext`, les types de decimal.js sont lus comme CommonJS (objet `module.exports`),
// alors qu'à l'exécution ESM l'import par défaut EST déjà la classe. On normalise les deux cas.
const Decimal = ((decimalJs as { default?: unknown }).default ??
  decimalJs) as typeof decimalJs.Decimal;

/**
 * Arithmétique décimale exacte (prompt maître §12, §49 : jamais de float pour l'argent ou les notes).
 * Instance isolée : ne modifie pas la configuration globale de decimal.js.
 */
export const DecimalExact = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP });
export type DecimalValue = InstanceType<typeof DecimalExact>;

export type DecimalInput = string | number | DecimalValue;

/**
 * Construit un décimal exact.
 * Les `number` non entiers sont REFUSÉS : ils portent déjà une erreur binaire
 * (ex. 12.345 vaut 12.3449999…). Transmettre les valeurs décimales sous forme de chaîne.
 */
export function toDecimal(value: DecimalInput): DecimalValue {
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError(
        'Nombre non entier ou hors plage : fournir la valeur décimale sous forme de chaîne',
      );
    }
    return new DecimalExact(value);
  }
  const decimal = new DecimalExact(value);
  if (!decimal.isFinite()) {
    throw new TypeError('Valeur décimale non finie');
  }
  return decimal;
}

/**
 * Arrondi « au demi supérieur » réservé à l'AFFICHAGE (§22, §49 : 12,345 → 12,35).
 * Ne jamais réinjecter le résultat dans un calcul (pas de double arrondi).
 */
export function roundForDisplay(value: DecimalInput, decimals = 2): string {
  return toDecimal(value).toFixed(decimals, DecimalExact.ROUND_HALF_UP);
}

/** Même arrondi d'affichage, avec la virgule décimale française (12,35). */
export function formatDecimalFr(value: DecimalInput, decimals = 2): string {
  return roundForDisplay(value, decimals).replace('.', ',');
}
