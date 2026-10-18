const storageKey = "healthy_orders_v1";

function readOrders() {
  const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
  return Array.isArray(parsed) ? parsed : [];
}

function withStorage(action) {
  try {
    return { data: action() };
  } catch {
    return { error: "Không thể lưu đơn hàng trên trình duyệt. Hãy kiểm tra dung lượng lưu trữ." };
  }
}

export const orderStore = {
  list(customerId) {
    return withStorage(() => readOrders()
      .filter((order) => String(order.customerId) === String(customerId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  },
  get(customerId, orderId) {
    return withStorage(() => readOrders().find((order) =>
      String(order.customerId) === String(customerId) && String(order.id) === String(orderId)) ?? null);
  },
  create(order) {
    return withStorage(() => {
      const orders = readOrders();
      orders.unshift(order);
      localStorage.setItem(storageKey, JSON.stringify(orders));
      return order;
    });
  },
  cancel(customerId, orderId) {
    return withStorage(() => {
      const orders = readOrders();
      const order = orders.find((item) => String(item.customerId) === String(customerId) && String(item.id) === String(orderId));
      if (!order) throw new Error("Không tìm thấy đơn hàng.");
      if (!["processing", "pending_payment"].includes(order.status)) {
        throw new Error("Đơn hàng hiện không thể hủy.");
      }
      const updated = { ...order, status: "cancelled", paymentStatus: "cancelled", updatedAt: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(orders.map((item) => item === order ? updated : item)));
      return updated;
    });
  },
};
