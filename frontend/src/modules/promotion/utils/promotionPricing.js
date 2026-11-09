import { promotionStatus } from './format.js';

export function bestActivePromotion(product, promotions, now = Date.now()) {
  const originalPrice = Number(product.price);
  if (!Number.isFinite(originalPrice)) return null;

  let best = null;
  for (const promotion of promotions) {
    if (!promotion.productIds?.includes(product.id) || promotionStatus(promotion, now).key !== 'active') continue;
    const value = Number(promotion.value);
    if (!Number.isFinite(value) || value <= 0) continue;
    const discountedPrice = promotion.type === 'percentage'
      ? originalPrice * (1 - value / 100)
      : promotion.type === 'fixed' ? originalPrice - value : null;
    if (discountedPrice === null) continue;
    const price = Math.max(0, discountedPrice);
    if (!best || price < best.price || (price === best.price && promotion.id < best.promotion.id)) {
      best = { promotion, price };
    }
  }
  return best;
}
