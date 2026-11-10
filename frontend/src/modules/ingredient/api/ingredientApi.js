import { httpClient } from '../../../shared/api/httpClient';

async function call(request) {
  try { return { data: (await request()).data }; }
  catch (error) { return { error: error.response?.data?.message || 'Không thể kết nối máy chủ.' }; }
}

export const ingredientApi = {
  list: () => call(() => httpClient.get('/api/manager/ingredients')),
  get: id => call(() => httpClient.get(`/api/manager/ingredients/${id}`)),
  create: values => call(() => httpClient.post('/api/manager/ingredients', values)),
  update: (id, values) => call(() => httpClient.put(`/api/manager/ingredients/${id}`, values)),
  changeStock: (id, values) => call(() => httpClient.post(`/api/manager/ingredients/${id}/stock`, values)),
  history: id => call(() => httpClient.get(`/api/manager/ingredients/${id}/transactions`)),
};
