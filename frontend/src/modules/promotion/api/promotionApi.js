import { httpClient } from '../../../shared/api/httpClient';

function failure(error) {
  return { error: error.response?.data?.message || 'Không thể kết nối đến máy chủ.',
    validationErrors: error.response?.data?.validationErrors || {} };
}

export const promotionApi = {
  async list() {
    try {
      const response = await httpClient.get('/api/manager/promotions');
      return Array.isArray(response.data) ? { data: response.data } : { error: 'Dữ liệu khuyến mãi không hợp lệ.' };
    } catch (error) { return failure(error); }
  },
  async save(values, id) {
    try {
      const response = id
        ? await httpClient.put(`/api/manager/promotions/${id}`, values)
        : await httpClient.post('/api/manager/promotions', values);
      return { data: response.data };
    } catch (error) { return failure(error); }
  },
  async setEnabled(id, enabled) {
    try {
      const response = await httpClient.patch(`/api/manager/promotions/${id}/enabled`, { enabled });
      return { data: response.data };
    } catch (error) { return failure(error); }
  },
};
