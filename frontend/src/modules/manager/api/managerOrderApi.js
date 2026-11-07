import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const managerOrderApi = {
  list(params) {
    return callApi(() => httpClient.get("/api/manager/orders", { params }));
  },
  get(orderId) {
    return callApi(() => httpClient.get(`/api/manager/orders/${encodeURIComponent(orderId)}`));
  },
};
