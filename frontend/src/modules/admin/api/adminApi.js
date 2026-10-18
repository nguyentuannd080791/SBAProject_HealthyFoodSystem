import { callApi } from '../../../shared/api/callApi'
import { httpClient } from '../../../shared/api/httpClient'

export const adminApi = {
  getStats() {
    return callApi(() => httpClient.get('/admin/stats'))
  },

  listUsers(filters = {}) {
    const params = {}
    if (filters.role) params.role = filters.role
    if (filters.status) params.status = filters.status
    if (filters.search) params.search = filters.search
    return callApi(() => httpClient.get('/admin/users', { params }))
  },

  getUserById(id) {
    return callApi(() => httpClient.get(`/admin/users/${id}`))
  },

  createAccount({ fullName, email, phone, password, role }) {
    return callApi(() =>
      httpClient.post('/admin/users', { fullName, email, phone, password, role })
    )
  },

  updateUser(id, changes) {
    return callApi(() => httpClient.put(`/admin/users/${id}`, changes))
  },

  toggleStatus(id) {
    return callApi(() => httpClient.patch(`/admin/users/${id}/toggle-status`))
  },
}
