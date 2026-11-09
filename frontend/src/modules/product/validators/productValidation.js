const optionalNutrition = ['fiberG', 'sugarG', 'sodiumMg'];

export function validateProduct(values) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length > 150) errors.name = 'Tên sản phẩm cần từ 1 đến 150 ký tự.';
  if (!Number.isInteger(Number(values.categoryId)) || Number(values.categoryId) <= 0) errors.categoryId = 'Chọn danh mục.';
  if (!/^\d+$/.test(values.price) || Number(values.price) <= 0 || Number(values.price) > 999999999999) errors.price = 'Giá phải là số nguyên dương tối đa 12 chữ số.';
  if (!/^\d+$/.test(String(values.stockQuantity)) || Number(values.stockQuantity) > 2147483647) {
    errors.stockQuantity = 'Tồn kho ban đầu phải là số nguyên từ 0 đến 2.147.483.647.';
  }
  if (!['AVAILABLE', 'UNAVAILABLE'].includes(values.status)) errors.status = 'Chọn trạng thái bán hợp lệ.';
  if (!/^\d+$/.test(values.caloriesKcal) || Number(values.caloriesKcal) > 2147483647) errors.caloriesKcal = 'Calories phải là số nguyên không âm.';
  for (const field of ['proteinG', 'carbohydrateG', 'fatG', 'fiberG', 'sugarG', 'sodiumMg']) {
    if (optionalNutrition.includes(field) && values[field] === '') continue;
    const limit = field === 'sodiumMg' ? 7 : 5;
    if (!new RegExp(`^\\d{1,${limit}}(\\.\\d)?$`).test(values[field])) errors[field] = 'Nhập số không âm, tối đa 1 chữ số thập phân.';
  }
  if (values.imageFile && (!['image/jpeg', 'image/png'].includes(values.imageFile.type) || values.imageFile.size > 5 * 1024 * 1024)) {
    errors.imageFile = 'Chọn ảnh JPEG hoặc PNG tối đa 5 MB.';
  }
  return errors;
}
