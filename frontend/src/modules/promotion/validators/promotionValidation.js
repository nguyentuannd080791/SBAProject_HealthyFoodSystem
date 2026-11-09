export function validatePromotion(values, products) {
  const errors = {};
  if (!/^[A-Za-z0-9_-]{3,30}$/.test(values.code?.trim() ?? '')) errors.code = 'Mã gồm 3–30 chữ, số, dấu gạch ngang hoặc gạch dưới.';
  if (!values.name.trim() || values.name.trim().length > 120) errors.name = 'Tên chương trình cần từ 1 đến 120 ký tự.';
  const value = Number(values.value);
  if (!['percentage', 'fixed'].includes(values.type)) errors.type = 'Vui lòng chọn loại giảm giá.';
  if (!Number.isFinite(value) || value <= 0 || (values.type === 'percentage' && value > 100) || (values.type === 'fixed' && !Number.isSafeInteger(value))) errors.value = 'Phần trăm phải lớn hơn 0 và tối đa 100; số tiền phải là số nguyên dương.';
  const selected = products.filter(product => values.productIds.includes(product.id));
  if (!values.productIds.length || selected.length !== values.productIds.length || new Set(values.productIds).size !== values.productIds.length) errors.productIds = 'Chọn ít nhất một sản phẩm hợp lệ.';
  if (values.type === 'fixed' && selected.some(product => value > product.price)) errors.value = 'Số tiền giảm không được vượt giá của bất kỳ sản phẩm đã chọn.';
  const start = new Date(values.startsAt).getTime();
  const end = new Date(values.endsAt).getTime();
  if (!Number.isFinite(start)) errors.startsAt = 'Vui lòng chọn thời gian bắt đầu.';
  if (!Number.isFinite(end) || end <= start) errors.endsAt = 'Thời gian kết thúc phải sau thời gian bắt đầu.';
  return errors;
}
