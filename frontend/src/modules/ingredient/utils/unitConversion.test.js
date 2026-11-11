import test from 'node:test';
import assert from 'node:assert/strict';
import { compatibleUnitOptions, hasSupportedPrecision, quantityInputStep, toIngredientUnit } from './unitConversion.js';

test('weight and volume units convert in both directions', () => {
  assert.equal(toIngredientUnit('2', 'kg', 'g'), 2000);
  assert.equal(toIngredientUnit('250', 'g', 'kg'), 0.25);
  assert.equal(toIngredientUnit('1.5', 'l', 'ml'), 1500);
  assert.equal(toIngredientUnit('250', 'ml', 'l'), 0.25);
  assert.deepEqual(compatibleUnitOptions('ml'), ['l', 'ml']);
  assert.deepEqual(compatibleUnitOptions('g'), ['kg', 'g']);
  assert.equal(quantityInputStep('ml', 'l'), '1');
  assert.equal(quantityInputStep('l', 'ml'), '0.001');
});

test('conversion does not round stock to more than three decimal places', () => {
  assert.equal(hasSupportedPrecision('1', 'ml', 'l'), true);
  assert.equal(hasSupportedPrecision('0.001', 'ml', 'l'), false);
  assert.equal(hasSupportedPrecision('0.001', 'g', 'kg'), false);
  assert.equal(hasSupportedPrecision('1', 'ml', 'kg'), false);
  assert.equal(toIngredientUnit('1', 'ml', 'kg'), NaN);
});
