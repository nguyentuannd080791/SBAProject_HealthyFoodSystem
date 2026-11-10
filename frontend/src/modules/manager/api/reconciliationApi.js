import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const reconciliationApi = {
  list: (page, filters) => callApi(() => httpClient.get("/api/manager/reconciliation", { params: { page, ...filters } })),
  detail: (id) => callApi(() => httpClient.get(`/api/manager/reconciliation/${encodeURIComponent(id)}`)),
  resume: (id, values) => callApi(() => httpClient.post(`/api/manager/reconciliation/${encodeURIComponent(id)}/resume-order`, values)),
};
