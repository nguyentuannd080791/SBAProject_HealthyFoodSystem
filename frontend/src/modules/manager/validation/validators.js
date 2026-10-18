import { categories } from '../data/seed.js';

export function validImage(value) {
  if (!value) return true;
  if (/^data:image\/(png|jpeg|webp);base64,/.test(value)) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
}

export function validateProduct(values) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length > 120) errors.name = 'Tên sản phẩm cần từ 1 đến 120 ký tự.';
  if (!categories.includes(values.category)) errors.category = 'Vui lòng chọn danh mục.';
  if (!values.description.trim() || values.description.length > 2000) errors.description = 'Mô tả cần từ 1 đến 2.000 ký tự.';
  if (String(values.price).trim() === '' || !Number.isSafeInteger(Number(values.price)) || Number(values.price) <= 0 || Number(values.price) > 100000000) errors.price = 'Giá phải là số nguyên từ 1 đến 100.000.000 đồng.';
  if (!validImage(values.image.trim())) errors.image = 'Dùng URL http/https hoặc ảnh PNG, JPG, WebP.';
  return errors;
}

export function validatePromotion(values, products) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length > 120) errors.name = 'Tên chương trình cần từ 1 đến 120 ký tự.';
  const value = Number(values.value);
  if (!['percentage', 'fixed'].includes(values.type)) errors.type = 'Vui lòng chọn loại giảm giá.';
  if (!Number.isFinite(value) || value <= 0 || (values.type === 'percentage' && value > 100) || (values.type === 'fixed' && !Number.isSafeInteger(value))) errors.value = 'Phần trăm phải lớn hơn 0 và tối đa 100; số tiền phải là số nguyên dương.';
  const selected = products.filter(product => values.productIds.includes(product.id));
  if (!values.productIds.length || selected.length !== values.productIds.length) errors.productIds = 'Chọn ít nhất một sản phẩm hợp lệ.';
  if (values.type === 'fixed' && selected.some(product => value > product.price)) errors.value = 'Số tiền giảm không được vượt giá của bất kỳ sản phẩm đã chọn.';
  const start = new Date(values.startsAt).getTime();
  const end = new Date(values.endsAt).getTime();
  if (!Number.isFinite(start)) errors.startsAt = 'Vui lòng chọn thời gian bắt đầu.';
  if (!Number.isFinite(end) || end <= start) errors.endsAt = 'Thời gian kết thúc phải sau thời gian bắt đầu.';
  return errors;
}
