import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const authApi = {
  login(email, password) {
    return callApi(() => httpClient.post("/api/auth/login", { email, password }));
  },

  logout() {
    return callApi(() => httpClient.post("/api/auth/logout"));
  },

  register({ fullName, email, phone, password }) {
    return callApi(() =>
      httpClient.post("/api/auth/register", { fullName, email, phone, password }),
    );
  },

  forgotPassword(email) {
    return callApi(() => httpClient.post("/api/auth/forgot-password", { email }));
  },

  resetPassword(email, code, password) {
    return callApi(() =>
      httpClient.post("/api/auth/reset-password", { email, code, password }),
    );
  },

  changePassword(currentPassword, newPassword) {
    return callApi(() =>
      httpClient.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      }),
    );
  },
};
