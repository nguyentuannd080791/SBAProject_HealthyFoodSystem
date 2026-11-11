import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCategoryName } from '../category/validators/categoryValidation.js';
import { validateIngredient, validateStockChange } from '../ingredient/validators/ingredientValidation.js';
import { validateProduct } from '../product/validators/productValidation.js';
import { validatePromotion } from '../promotion/validators/promotionValidation.js';

test('category and ingredient names detect existing records before save', () => {
  assert.match(validateCategoryName('  rau củ  ', [{ id: 1, name: 'Rau củ' }]).error, /đã tồn tại/);
  assert.equal(validateCategoryName('Rau củ', [{ id: 1, name: 'Rau củ' }], 1).error, '');
  const values = { name: ' Gà ', unit: 'con', stockQuantity: '10', warningQuantity: '2', note: '' };
  assert.match(validateIngredient(values, [{ id: 2, name: 'Gà' }]).name, /đã tồn tại/);
  assert.equal(validateIngredient(values, [{ id: 2, name: 'Gà' }], 2).name, undefined);
  assert.ok(validateIngredient({ ...values, stockQuantity: '1.1234' }).stockQuantity);
  assert.ok(validateIngredient({ ...values, unit: 'kg' }, [], 2,
    { unit: 'con', stockQuantity: '10' }).unit);
});

test('stock changes reject overselling and unchanged adjustments', () => {
  const ingredient = { unit: 'con', stockQuantity: 5 };
  assert.ok(validateStockChange({ type: 'OUT', quantity: '6', unit: 'con' }, ingredient).quantity);
  assert.ok(validateStockChange({ type: 'ADJUSTMENT', quantity: '5', unit: 'con' }, ingredient).quantity);
  assert.deepEqual(validateStockChange({ type: 'IN', quantity: '2', unit: 'con' }, ingredient), {});
});

test('product checks recipe quantity and duplicate name on the client', () => {
  const values = {
    name: 'Combo gà', categoryId: '1', price: '120000', status: 'AVAILABLE',
    ingredientLines: [{ ingredientId: '1', requiredQuantity: '1', unit: 'con' }],
    caloriesKcal: '100', proteinG: '10', carbohydrateG: '10', fatG: '5',
    fiberG: '', sugarG: '', sodiumMg: '', potassiumMg: '', imageFile: null,
  };
  const ingredients = [{ id: 1, unit: 'con' }];
  assert.deepEqual(validateProduct(values, ingredients), {});
  assert.match(validateProduct(values, ingredients, [{ id: 2, name: 'COMBO GÀ' }]).name, /đã tồn tại/);
  assert.ok(validateProduct({ ...values, ingredientLines: [
    { ingredientId: '1', requiredQuantity: '0', unit: 'con' },
  ] }, ingredients).ingredientLines);
});

test('promotion checks duplicate codes, amount and selected product price', () => {
  const values = {
    code: 'SALE10', name: 'Ưu đãi', type: 'fixed', value: '1000', productIds: [1],
    startsAt: '2030-01-01T10:00', endsAt: '2030-01-02T10:00', enabled: true,
  };
  const products = [{ id: 1, price: 5000 }];
  assert.deepEqual(validatePromotion(values, products), {});
  assert.match(validatePromotion(values, products, [{ id: 2, code: 'sale10' }]).code, /đã tồn tại/);
  assert.ok(validatePromotion({ ...values, value: '6000' }, products).value);
  assert.ok(validatePromotion({ ...values, endsAt: values.startsAt }, products).endsAt);
});
