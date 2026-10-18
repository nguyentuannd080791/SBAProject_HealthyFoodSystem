export const money = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
export const dateTime = value => new Date(value).toLocaleString('vi-VN');
export function promotionStatus(promotion, now = Date.now()) {
  if (!promotion.enabled) return { key: 'disabled', label: 'Tạm tắt', color: 'secondary' };
  if (now < new Date(promotion.startsAt).getTime()) return { key: 'scheduled', label: 'Sắp diễn ra', color: 'info' };
  if (now >= new Date(promotion.endsAt).getTime()) return { key: 'expired', label: 'Đã kết thúc', color: 'secondary' };
  return { key: 'active', label: 'Đang áp dụng', color: 'success' };
}
export function toLocalInput(value) {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
