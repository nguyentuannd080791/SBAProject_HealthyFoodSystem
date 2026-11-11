export const ingredientUnits = ['kg', 'g', 'l', 'ml', 'cái', 'gói', 'hộp'];

const normalizeUnit = unit => String(unit || '').trim().toLowerCase();

const convertibleUnits = [
  ['kg', 'g'],
  ['l', 'ml'],
];

export function inputUnit(unit) {
  const normalized = normalizeUnit(unit);
  return ingredientUnits.includes(normalized) ? normalized : unit;
}

export function compatibleUnitOptions(unit) {
  const normalized = normalizeUnit(unit);
  return convertibleUnits.find(group => group.includes(normalized)) || [unit];
}

export function quantityInputStep(enteredUnit, ingredientUnit) {
  const source = normalizeUnit(enteredUnit || ingredientUnit);
  const target = normalizeUnit(ingredientUnit);
  return (source === 'g' && target === 'kg') || (source === 'ml' && target === 'l') ? '1' : '0.001';
}

export function toIngredientUnit(quantity, enteredUnit, ingredientUnit) {
  const source = normalizeUnit(enteredUnit || ingredientUnit);
  const target = normalizeUnit(ingredientUnit);
  const amount = Number(quantity);
  if (!Number.isFinite(amount)) return NaN;
  if (source === target) return amount;
  if (source === 'kg' && target === 'g') return amount * 1000;
  if (source === 'g' && target === 'kg') return amount / 1000;
  if (source === 'l' && target === 'ml') return amount * 1000;
  if (source === 'ml' && target === 'l') return amount / 1000;
  return NaN;
}

export function hasSupportedPrecision(quantity, enteredUnit, ingredientUnit) {
  const match = /^(\d+)(?:\.(\d{1,3}))?$/.exec(String(quantity));
  if (!match) return false;
  const source = normalizeUnit(enteredUnit || ingredientUnit);
  const target = normalizeUnit(ingredientUnit);
  if (source === target || ((source === 'kg' && target === 'g') || (source === 'l' && target === 'ml')))
    return true;
  if ((source === 'g' && target === 'kg') || (source === 'ml' && target === 'l')) {
    const thousandths = BigInt(match[1]) * 1000n + BigInt((match[2] || '').padEnd(3, '0'));
    return thousandths % 1000n === 0n;
  }
  return false;
}
