import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const cartApi = {
  get() {
    return callApi(() => httpClient.get("/api/user/cart"));
  },
  add(productId, quantity) {
    return callApi(() => httpClient.post("/api/user/cart/items", { productId, quantity }));
  },
  update(itemId, quantity) {
    return callApi(() => httpClient.patch(`/api/user/cart/items/${itemId}`, { quantity }));
  },
  remove(itemId) {
    return callApi(() => httpClient.delete(`/api/user/cart/items/${itemId}`));
  },
};
