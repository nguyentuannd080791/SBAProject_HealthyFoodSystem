import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";
import { loadSessionUser, saveSessionUser } from "../../../app/provider/authStorage";

export const profileApi = {
  async get() {
    const result = await callApi(() => httpClient.get("/profile"));
    if (result.error) {
      const user = loadSessionUser();
      if (user) {
        return {
          data: {
            id: user.id,
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
          },
        };
      }
    }
    return result;
  },

  async update({ fullName, phone }) {
    const result = await callApi(() =>
      httpClient.patch("/profile", { fullName, phone }),
    );
    if (result.error) {
      const user = loadSessionUser();
      if (user) {
        const updated = { ...user, fullName, phone };
        saveSessionUser(updated);
        return { data: updated };
      }
    }
    return result;
  },
};
