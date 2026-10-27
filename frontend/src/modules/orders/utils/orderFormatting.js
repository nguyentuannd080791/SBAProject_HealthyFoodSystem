export const orderStatuses = {
  pending_payment: { label: "Chờ thanh toán", variant: "warning" },
  processing: { label: "Đã tiếp nhận", variant: "primary" },
  preparing: { label: "Đang chuẩn bị", variant: "info" },
  shipping: { label: "Đang giao", variant: "success" },
  delivered: { label: "Đã giao", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "secondary" },
};

export function formatOrderDate(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatOrderAddress(delivery) {
  return [delivery.street, delivery.ward, delivery.district, delivery.city]
    .filter(Boolean).join(", ");
}

export function canCancelOrder(order) {
  return order.status === "processing" || order.status === "pending_payment";
}
