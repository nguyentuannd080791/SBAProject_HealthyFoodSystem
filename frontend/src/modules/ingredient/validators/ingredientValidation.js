import { hasSupportedPrecision, toIngredientUnit } from '../utils/unitConversion.js';

const quantityPattern = /^\d{1,15}(\.\d{1,3})?$/;
const maxStockExclusive = 1e15;

export function validateIngredient(values, ingredients = [], editingId = null, original = null, products = []) {
  const errors = {};
  const name = String(values.name ?? '').trim();
  const unit = String(values.unit ?? '').trim();

  if (!name || name.length > 150) errors.name = 'Tên nguyên liệu cần từ 1 đến 150 ký tự.';
  else if (ingredients.some(item => String(item.id) !== String(editingId) &&
    item.name.trim().toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi')))
    errors.name = 'Tên nguyên liệu đã tồn tại.';
  if (!unit || unit.length > 20) errors.unit = 'Đơn vị cần từ 1 đến 20 ký tự.';
  else if (original && unit !== original.unit &&
    (Number(original.stockQuantity) !== 0 || products.some(product =>
      product.ingredientLines?.some(line => String(line.ingredientId) === String(editingId)))))
    errors.unit = 'Không thể đổi đơn vị khi nguyên liệu còn tồn kho hoặc đã dùng trong sản phẩm.';
  for (const field of ['stockQuantity', 'warningQuantity']) {
    if (!quantityPattern.test(String(values[field] ?? '')))
      errors[field] = 'Nhập số không âm, tối đa 15 chữ số và 3 chữ số thập phân.';
  }
  if (String(values.note ?? '').length > 500) errors.note = 'Ghi chú tối đa 500 ký tự.';
  return errors;
}

export function validateStockChange(values, ingredient) {
  const errors = {};
  if (!ingredient) return errors;
  const raw = String(values.quantity ?? '');
  const quantity = Number(raw);
  if (!quantityPattern.test(raw) ||
      (values.type !== 'ADJUSTMENT' && quantity <= 0) ||
      !hasSupportedPrecision(raw, values.unit, ingredient.unit)) {
    errors.quantity = 'Nhập số hợp lệ, quy đổi chính xác đến 0,001 đơn vị kho.';
  } else {
    const converted = toIngredientUnit(raw, values.unit, ingredient.unit);
    const stock = Number(ingredient.stockQuantity);
    if (values.type === 'OUT' && converted > stock)
      errors.quantity = 'Số lượng xuất vượt tồn kho hiện tại.';
    if (values.type === 'ADJUSTMENT' && converted === stock)
      errors.quantity = 'Tồn kho mới phải khác tồn kho hiện tại.';
    if ((values.type === 'IN' ? stock + converted : converted) >= maxStockExclusive)
      errors.quantity = 'Số lượng vượt giới hạn kho.';
  }
  if (String(values.note ?? '').length > 500) errors.note = 'Ghi chú tối đa 500 ký tự.';
  return errors;
}
