import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

function mapOrder(order) {
  return { ...order, items: order.items.map((item) => ({ ...item,
    image: item.image ? new URL(item.image, httpClient.defaults.baseURL).href : "",
  })) };
}

export const orderStore = {
  previewPromotion(code) { return callApi(() => httpClient.post("/api/orders/promotion-preview", { code })); },
  async list() {
    const result = await callApi(() => httpClient.get("/api/orders"));
    return result.error ? result : { data: result.data.map(mapOrder) };
  },
  async get(orderId) {
    const result = await callApi(() => httpClient.get(`/api/orders/${encodeURIComponent(orderId)}`));
    return result.error ? result : { data: mapOrder(result.data) };
  },
  create(request) { return callApi(() => httpClient.post("/api/orders", request)); },
  async cancel(orderId) {
    const result = await callApi(() => httpClient.post(`/api/orders/${encodeURIComponent(orderId)}/cancel`));
    return result.error ? result : { data: mapOrder(result.data) };
  },
  payment(orderId) { return callApi(() => httpClient.get(`/api/orders/${encodeURIComponent(orderId)}/payment`)); },
};
