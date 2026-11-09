import test from 'node:test';
import assert from 'node:assert/strict';
import { bestActivePromotion } from './promotionPricing.js';

const product = { id: 1, price: 200000 };
const now = Date.parse('2026-11-08T12:00:00Z');
const promotion = (id, overrides = {}) => ({
  id, name: `Ưu đãi ${id}`, type: 'percentage', value: 10, productIds: [1],
  startsAt: '2026-11-08T11:00:00Z', endsAt: '2026-11-08T13:00:00Z', enabled: true,
  ...overrides,
});

test('chọn khuyến mại cho giá thấp nhất khi nhiều chương trình cùng hiệu lực', () => {
  const result = bestActivePromotion(product, [
    promotion(1, { value: 20 }),
    promotion(2, { type: 'fixed', value: 50000 }),
    promotion(3, { value: 10 }),
  ], now);
  assert.equal(result.promotion.id, 2);
  assert.equal(result.price, 150000);
  assert.equal(product.price, 200000);
});

test('chỉ tính chương trình đang bật, đúng sản phẩm và trong khoảng thời gian hiệu lực', () => {
  const result = bestActivePromotion(product, [
    promotion(1, { value: 100, enabled: false }),
    promotion(2, { value: 100, productIds: [2] }),
    promotion(3, { value: 100, startsAt: '2026-11-08T13:00:00Z' }),
    promotion(4, { value: 100, endsAt: '2026-11-08T12:00:00Z' }),
    promotion(5, { value: 25 }),
  ], now);
  assert.equal(result.promotion.id, 5);
  assert.equal(result.price, 150000);
  assert.equal(bestActivePromotion(product, [promotion(4, { endsAt: '2026-11-08T12:00:00Z' })], now), null);
});

test('không cộng dồn và không trả về giá âm', () => {
  const result = bestActivePromotion(product, [
    promotion(1, { value: 25 }),
    promotion(2, { type: 'fixed', value: 250000 }),
  ], now);
  assert.equal(result.promotion.id, 2);
  assert.equal(result.price, 0);
});
