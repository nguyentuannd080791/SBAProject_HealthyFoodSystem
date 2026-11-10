import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const deliveryApi = {
  listOrders(status = "") {
    const params = status ? { status } : {};
    return callApi(() => httpClient.get("/api/delivery/orders", { params }));
  },

  markArrived(orderId, note = "") {
    return callApi(() =>
      httpClient.post(`/api/delivery/orders/${encodeURIComponent(orderId)}/arrive`, {
        note,
      }),
    );
  },

  markDelivered(orderId, note = "") {
    return callApi(() =>
      httpClient.post(`/api/delivery/orders/${encodeURIComponent(orderId)}/deliver`, {
        note,
      }),
    );
  },

  getOrderTracking(orderId) {
    return callApi(() =>
      httpClient.get(`/api/handovers/orders/${encodeURIComponent(orderId)}/tracking`),
    );
  },
};
