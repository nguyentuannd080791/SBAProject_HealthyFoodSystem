import { httpClient } from '../../../shared/api/httpClient';

function failure(error) {
  return { error: error.response?.data?.message || 'Không thể kết nối đến máy chủ.',
    validationErrors: error.response?.data?.validationErrors || {} };
}

function listResult(response) {
  if (!Array.isArray(response.data)) {
    return { error: 'API trả về dữ liệu không đúng định dạng danh sách. Kiểm tra địa chỉ backend.' };
  }
  return { data: response.data };
}

function productBody(values) {
  const body = new FormData();
  for (const [name, value] of Object.entries(values)) {
    if (value !== null && value !== undefined && value !== '') body.append(name, value);
  }
  return body;
}

export const productApi = {
  async list() {
    try { const response = await httpClient.get('/api/manager/products'); return listResult(response); }
    catch (error) { return failure(error); }
  },
  async get(id) {
    try { const response = await httpClient.get(`/api/manager/products/${id}`); return { data: response.data }; }
    catch (error) { return { ...failure(error), notFound: error.response?.status === 404 }; }
  },
  async create(values) {
    try {
      const response = await httpClient.post('/api/manager/products', productBody(values));
      return { data: response.data };
    } catch (error) { return failure(error); }
  },
  async update(id, values) {
    try {
      const response = await httpClient.put(`/api/manager/products/${id}`, productBody(values));
      return { data: response.data };
    } catch (error) { return { ...failure(error), notFound: error.response?.status === 404 }; }
  },
};
