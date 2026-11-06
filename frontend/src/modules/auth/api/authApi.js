import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

export const authApi = {
  login(email, password) {
    return callApi(() => httpClient.post("/auth/login", { email, password }));
  },

  logout() {
    return callApi(() => httpClient.post("/auth/logout"));
  },

  register({ fullName, email, phone, password }) {
    return callApi(() =>
      httpClient.post("/auth/register", { fullName, email, phone, password }),
    );
  },

  forgotPassword(email) {
    return callApi(() => httpClient.post("/auth/forgot-password", { email }));
  },

  resetPassword(email, code, password) {
    return callApi(() =>
      httpClient.post("/auth/reset-password", { email, code, password }),
    );
  },

  changePassword(currentPassword, newPassword) {
    return callApi(() =>
      httpClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      }),
    );
  },
};
