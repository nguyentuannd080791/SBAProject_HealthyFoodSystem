import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const publicPromotionApi = {
  async listActive() {
    const result = await callApi(() => httpClient.get("/api/promotions"));
    if (result.error) return result;
    return Array.isArray(result.data)
      ? result
      : { error: "Dữ liệu khuyến mãi không hợp lệ." };
  },
};
