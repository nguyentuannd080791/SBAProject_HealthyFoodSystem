export const orderStatuses = {
  pending_payment: { label: "Chờ thanh toán", variant: "warning" },
  processing: { label: "Đã tiếp nhận", variant: "primary" },
  shipping: { label: "Đơn hàng đang được giao đến cho bạn", variant: "success" },
  delivered: { label: "Đã giao (đơn cũ)", variant: "success" },
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
  return order.paymentStatus === "pending" && order.status === "pending_payment";
}
