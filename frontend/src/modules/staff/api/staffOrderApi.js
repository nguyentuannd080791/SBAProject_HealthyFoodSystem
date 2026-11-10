import { httpClient } from "../../../shared/api/httpClient";
import { callApi } from "../../../shared/api/callApi";

export const staffOrderApi = {
  invoice: (id) => callApi(() => httpClient.get(`/api/staff/orders/${encodeURIComponent(id)}/invoice`)),
  list: (status, page) => callApi(() => httpClient.get("/api/staff/orders", { params: { status, page } })),
  get: (id) => callApi(() => httpClient.get(`/api/staff/orders/${encodeURIComponent(id)}`)),
  update: (id, expectedStatus, status) => callApi(() => httpClient.patch(
    `/api/staff/orders/${encodeURIComponent(id)}/status`, { expectedStatus, status })),
  getDeliveryPartners: () => callApi(() => httpClient.get("/api/staff/handovers/partners")),
  getArrivedHandovers: () => callApi(() => httpClient.get("/api/staff/handovers/arrived")),
  getHandoversByOrders: (orderIds) => {
    if (!orderIds || orderIds.length === 0) return Promise.resolve({ data: [] });
    return callApi(() =>
      httpClient.get("/api/staff/handovers/by-orders", {
        params: { orderIds: orderIds.join(",") },
      }),
    );
  },
  dispatchHandover: (orderId, payload = {}) => callApi(() => httpClient.post(
    `/api/staff/handovers/orders/${encodeURIComponent(orderId)}/dispatch`, payload)),
  confirmHandover: (orderId) => callApi(() => httpClient.post(
    `/api/staff/handovers/orders/${encodeURIComponent(orderId)}/confirm`)),
  rejectHandover: (orderId, note = "") => callApi(() => httpClient.post(
    `/api/staff/handovers/orders/${encodeURIComponent(orderId)}/reject`, { note })),
};
