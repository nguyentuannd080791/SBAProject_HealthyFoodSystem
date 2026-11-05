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

export const productApi = {
  async list() {
    try { const response = await httpClient.get('/manager/products'); return listResult(response); }
    catch (error) { return failure(error); }
  },
  async categories() {
    try { const response = await httpClient.get('/manager/products/categories'); return listResult(response); }
    catch (error) { return failure(error); }
  },
  async create(values) {
    const body = new FormData();
    for (const [name, value] of Object.entries(values)) {
      if (value !== null && value !== undefined && value !== '') body.append(name, value);
    }
    try {
      const response = await httpClient.post('/manager/products', body, { headers: { 'Content-Type': undefined } });
      return { data: response.data };
    } catch (error) { return failure(error); }
  },
};
