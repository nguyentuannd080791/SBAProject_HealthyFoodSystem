export function isWeightUnit(unit) {
  return ['g', 'kg'].includes(String(unit || '').trim().toLowerCase());
}

export function inputUnit(unit) {
  return isWeightUnit(unit) ? String(unit).trim().toLowerCase() : unit;
}

export function weightUnitOptions(unit) {
  return isWeightUnit(unit) ? ['g', 'kg'] : [unit];
}

export function toIngredientUnit(quantity, enteredUnit, ingredientUnit) {
  const source = String(enteredUnit || ingredientUnit).trim().toLowerCase();
  const target = String(ingredientUnit).trim().toLowerCase();
  const amount = Number(quantity);
  if (!Number.isFinite(amount)) return NaN;
  if (source === target) return amount;
  if (source === 'kg' && target === 'g') return amount * 1000;
  if (source === 'g' && target === 'kg') return amount / 1000;
  return NaN;
}

export function hasSupportedPrecision(quantity, enteredUnit, ingredientUnit) {
  const converted = toIngredientUnit(quantity, enteredUnit, ingredientUnit);
  return Number.isFinite(converted) &&
    Math.abs(converted * 1000 - Math.round(converted * 1000)) < 0.000001;
}
