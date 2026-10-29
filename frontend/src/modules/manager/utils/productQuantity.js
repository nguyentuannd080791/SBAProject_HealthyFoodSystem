// Technical bound shared by forms, storage validation and the planned SQL INT column.
export const MAX_PRODUCT_QUANTITY = 2147483647;

export function validQuantity(value) {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PRODUCT_QUANTITY;
}

export function parseQuantity(value) {
  if (typeof value === 'number') return validQuantity(value) ? value : null;
  if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) return null;
  const quantity = Number(value.trim());
  return validQuantity(quantity) ? quantity : null;
}

export function quantityLabel(quantity) {
  return validQuantity(quantity) ? `${quantity.toLocaleString('vi-VN')} đơn vị` : 'Chưa nhập số lượng';
}

export function matchesQuantityFilter(product, filter) {
  if (filter === 'positive') return validQuantity(product.quantity) && product.quantity > 0;
  if (filter === 'zero') return product.quantity === 0;
  if (filter === 'unknown') return !validQuantity(product.quantity);
  return true;
}
