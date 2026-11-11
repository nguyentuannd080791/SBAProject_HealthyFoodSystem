import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const nutritionApi = {
  calculate: (payload) =>
    callApi(() => httpClient.post("/api/nutrition/calculate", payload)),
  getMyProfile: () => callApi(() => httpClient.get("/api/nutrition/me")),
  getOptions: () => callApi(() => httpClient.get("/api/nutrition/options")),
};
