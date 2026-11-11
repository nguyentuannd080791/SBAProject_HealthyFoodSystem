import { httpClient } from "../../../shared/api/httpClient";

export const screeningApi = {
  getConditions() {
    return httpClient.get("/api/screening/conditions").then((res) => res.data);
  },

  getIngredients() {
    return httpClient.get("/api/screening/ingredients").then((res) => res.data);
  },

  getUserProfile() {
    return httpClient.get("/api/screening/profile").then((res) => res.data);
  },

  saveUserProfile(data) {
    return httpClient
      .put("/api/screening/profile", data)
      .then((res) => res.data);
  },

  evaluateProduct(productId) {
    return httpClient
      .get(`/api/screening/evaluate/${productId}`)
      .then((res) => res.data);
  },

  evaluateCatalog() {
    return httpClient
      .get("/api/screening/evaluate-catalog")
      .then((res) => res.data);
  },
};
