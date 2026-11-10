import { httpClient } from "../../../shared/api/httpClient";
import { callApi } from "../../../shared/api/callApi";

export const staffOrderApi = {
  invoice: (id) => callApi(() => httpClient.get(`/api/staff/orders/${encodeURIComponent(id)}/invoice`)),
  list: (status, page) => callApi(() => httpClient.get("/api/staff/orders", { params: { status, page } })),
  get: (id) => callApi(() => httpClient.get(`/api/staff/orders/${encodeURIComponent(id)}`)),
  update: (id, expectedStatus, status) => callApi(() => httpClient.patch(
    `/api/staff/orders/${encodeURIComponent(id)}/status`, { expectedStatus, status })),
};
