import { hasSupportedPrecision, toIngredientUnit } from '../../ingredient/utils/unitConversion.js';

const optionalNutrition = ['fiberG', 'sugarG', 'sodiumMg', 'potassiumMg'];

export function validateProduct(values, ingredients = [], products = [], editingId = null) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length > 150) errors.name = 'Tên sản phẩm cần từ 1 đến 150 ký tự.';
  else if (products.some(item => String(item.id) !== String(editingId) &&
    item.name.trim().toLocaleLowerCase('vi') === values.name.trim().toLocaleLowerCase('vi')))
    errors.name = 'Tên sản phẩm đã tồn tại.';
  if (!Number.isInteger(Number(values.categoryId)) || Number(values.categoryId) <= 0) errors.categoryId = 'Chọn danh mục.';
  if (!/^\d+$/.test(values.price) || Number(values.price) <= 0 || Number(values.price) > 999999999999) errors.price = 'Giá phải là số nguyên dương tối đa 12 chữ số.';
  if (!values.ingredientLines.length) errors.ingredientLines = 'Combo cần ít nhất một nguyên liệu.';
  const ids = new Set();
  for (const line of values.ingredientLines) {
    const ingredient = ingredients.find(item => String(item.id) === String(line.ingredientId));
    if (!/^\d+$/.test(String(line.ingredientId)) || ids.has(String(line.ingredientId)) ||
      !/^\d{1,15}(\.\d{1,3})?$/.test(String(line.requiredQuantity)) || Number(line.requiredQuantity) <= 0 ||
      !ingredient || !hasSupportedPrecision(line.requiredQuantity, line.unit, ingredient.unit) ||
      toIngredientUnit(line.requiredQuantity, line.unit, ingredient.unit) < 0.001)
      errors.ingredientLines = 'Chọn nguyên liệu không trùng; định lượng phải quy đổi chính xác đến 0,001 đơn vị kho.';
    ids.add(String(line.ingredientId));
  }
  if (!['AVAILABLE', 'UNAVAILABLE'].includes(values.status)) errors.status = 'Chọn trạng thái bán hợp lệ.';
  if (!/^\d+$/.test(values.caloriesKcal) || Number(values.caloriesKcal) > 2147483647) errors.caloriesKcal = 'Calories phải là số nguyên không âm.';
  for (const field of ['proteinG', 'carbohydrateG', 'fatG', 'fiberG', 'sugarG', 'sodiumMg', 'potassiumMg']) {
    if (optionalNutrition.includes(field) && values[field] === '') continue;
    const limit = ['sodiumMg', 'potassiumMg'].includes(field) ? 7 : 5;
    if (!new RegExp(`^\\d{1,${limit}}(\\.\\d)?$`).test(values[field])) errors[field] = 'Nhập số không âm, tối đa 1 chữ số thập phân.';
  }
  if (values.imageFile && (!['image/jpeg', 'image/png'].includes(values.imageFile.type) || values.imageFile.size > 5 * 1024 * 1024)) {
    errors.imageFile = 'Chọn ảnh JPEG hoặc PNG tối đa 5 MB.';
  }
  return errors;
}
