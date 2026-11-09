import { callApi } from '../../../shared/api/callApi';
import { httpClient } from '../../../shared/api/httpClient';

function failure(error) {
  return { error: error.response?.data?.message || 'Không thể kết nối đến máy chủ.',
    validationErrors: error.response?.data?.validationErrors || {} };
}

async function managerList(path) {
  try {
    const response = await httpClient.get(path);
    if (!Array.isArray(response.data)) {
      return { error: 'API trả về dữ liệu không đúng định dạng danh sách. Kiểm tra địa chỉ backend.' };
    }
    return { data: response.data };
  } catch (error) {
    return failure(error);
  }
}

export const categoryApi = {
  list() {
    return callApi(() => httpClient.get('/api/products/categories'));
  },

  listForManager() {
    return managerList('/api/manager/products/categories');
  },

  listAllForManager() {
    return managerList('/api/manager/categories');
  },

  async create(name) {
    try {
      const response = await httpClient.post('/api/manager/categories', { name });
      return { data: response.data };
    } catch (error) {
      return failure(error);
    }
  },

  async update(id, name) {
    try {
      const response = await httpClient.put(`/api/manager/categories/${id}`, { name });
      return { data: response.data };
    } catch (error) {
      return failure(error);
    }
  },

  async setActive(id, active) {
    try {
      const response = await httpClient.patch(`/api/manager/categories/${id}/active`, { active });
      return { data: response.data };
    } catch (error) {
      return failure(error);
    }
  },
};
