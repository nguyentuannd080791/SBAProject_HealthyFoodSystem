import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";

const ADDRESS_STORAGE_KEY = "hf_delivery_addresses_v1";

function loadLocalAddresses() {
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAddresses(list) {
  localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(list));
}

export const addressApi = {
  async list() {
    const result = await callApi(() => httpClient.get("/addresses"));
    if (result.error) {
      return { data: loadLocalAddresses() };
    }
    return result;
  },

  async create(values) {
    const result = await callApi(() => httpClient.post("/addresses", values));
    if (result.error) {
      const list = loadLocalAddresses();
      const newAddress = {
        id: Date.now(),
        ...values,
        isDefault: list.length === 0,
      };
      const updatedList = [...list, newAddress];
      saveLocalAddresses(updatedList);
      return { data: newAddress };
    }
    return result;
  },

  async update(addressId, values) {
    const result = await callApi(() =>
      httpClient.patch(`/addresses/${addressId}`, values),
    );
    if (result.error) {
      const list = loadLocalAddresses();
      const updatedList = list.map((a) =>
        a.id === addressId ? { ...a, ...values } : a,
      );
      saveLocalAddresses(updatedList);
      return { data: updatedList.find((a) => a.id === addressId) };
    }
    return result;
  },

  async remove(addressId) {
    const result = await callApi(() =>
      httpClient.delete(`/addresses/${addressId}`),
    );
    if (result.error) {
      const list = loadLocalAddresses().filter((a) => a.id !== addressId);
      saveLocalAddresses(list);
      return { data: { success: true } };
    }
    return result;
  },

  async makeDefault(addressId) {
    const result = await callApi(() =>
      httpClient.post(`/addresses/${addressId}/default`),
    );
    if (result.error) {
      const list = loadLocalAddresses().map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));
      saveLocalAddresses(list);
      return { data: { success: true } };
    }
    return result;
  },
};
