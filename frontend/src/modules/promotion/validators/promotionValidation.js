export function validatePromotion(values, products, promotions = [], editingId = null) {
  const errors = {};
  const code = values.code?.trim() ?? '';
  if (!/^[A-Za-z0-9_-]{3,30}$/.test(code)) errors.code = 'Mã gồm 3–30 chữ, số, dấu gạch ngang hoặc gạch dưới.';
  else if (promotions.some(item => String(item.id) !== String(editingId) &&
    item.code?.toUpperCase() === code.toUpperCase())) errors.code = 'Mã khuyến mãi đã tồn tại.';
  if (!values.name.trim() || values.name.trim().length > 120) errors.name = 'Tên chương trình cần từ 1 đến 120 ký tự.';
  const value = Number(values.value);
  if (!['percentage', 'fixed'].includes(values.type)) errors.type = 'Vui lòng chọn loại giảm giá.';
  if (values.type === 'percentage'
    ? !/^\d{1,3}(\.\d{1,2})?$/.test(String(values.value)) || value <= 0 || value > 100
    : !/^\d{1,12}$/.test(String(values.value)) || value <= 0)
    errors.value = 'Phần trăm cần từ 0,01 đến 100 (tối đa 2 số lẻ); số tiền phải là số nguyên dương tối đa 12 chữ số.';
  const selected = products.filter(product => values.productIds.includes(product.id));
  if (!values.productIds.length || selected.length !== values.productIds.length || new Set(values.productIds).size !== values.productIds.length) errors.productIds = 'Chọn ít nhất một sản phẩm hợp lệ.';
  if (values.type === 'fixed' && selected.some(product => value > product.price)) errors.value = 'Số tiền giảm không được vượt giá của bất kỳ sản phẩm đã chọn.';
  const start = new Date(values.startsAt).getTime();
  const end = new Date(values.endsAt).getTime();
  if (!Number.isFinite(start)) errors.startsAt = 'Vui lòng chọn thời gian bắt đầu.';
  if (!Number.isFinite(end) || end <= start) errors.endsAt = 'Thời gian kết thúc phải sau thời gian bắt đầu.';
  return errors;
}
