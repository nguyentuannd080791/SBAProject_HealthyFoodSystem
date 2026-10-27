export const CART_STORAGE_KEY = "healthy_cart";

function validItem(item) {
  return item && (typeof item.id === "string" || typeof item.id === "number") &&
    typeof item.name === "string" && Number.isFinite(item.price) && item.price >= 0 &&
    Number.isSafeInteger(item.quantity) && item.quantity > 0;
}

function normalizeItem(item) {
  const nutrition = Object.fromEntries(
    ["calories", "protein", "carbs", "fat"].map((key) => [
      key,
      Number.isFinite(item.nutrition?.[key]) && item.nutrition[key] >= 0
        ? item.nutrition[key] : 0,
    ]),
  );
  return {
    id: item.id, name: item.name, price: item.price,
    image: typeof item.image === "string" ? item.image : "",
    nutrition, quantity: item.quantity,
  };
}

export function addCartItem(items, product, quantity = 1) {
  if (!validItem({ ...product, quantity })) return items;
  const existing = items.find((item) => String(item.id) === String(product.id));
  if (!existing) return [...items, normalizeItem({ ...product, quantity })];
  if (!Number.isSafeInteger(existing.quantity + quantity)) return items;
  return items.map((item) => item === existing
    ? { ...item, quantity: item.quantity + quantity } : item);
}

export function updateCartQuantity(items, productId, quantity) {
  if (!Number.isFinite(quantity)) return items;
  if (quantity <= 0) return items.filter((item) => String(item.id) !== String(productId));
  if (!Number.isSafeInteger(quantity)) return items;
  return items.map((item) => String(item.id) === String(productId)
    ? { ...item, quantity } : item);
}

export function parseStoredCart(value) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(validItem).reduce(
      (items, item) => addCartItem(items, item, item.quantity), [],
    );
  } catch {
    return [];
  }
}

export function getCartTotals(items) {
  return items.reduce((totals, item) => ({
    totalItems: totals.totalItems + item.quantity,
    totalPrice: totals.totalPrice + item.price * item.quantity,
    totalCalories: totals.totalCalories + (item.nutrition?.calories ?? 0) * item.quantity,
  }), { totalItems: 0, totalPrice: 0, totalCalories: 0 });
}
