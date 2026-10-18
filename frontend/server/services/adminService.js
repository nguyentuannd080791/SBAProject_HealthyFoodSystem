import { HttpError } from '../errors/HttpError.js'
import {
  validateCreateInternalAccountBody,
  validateUpdateUserBody,
} from '../validation/requestValidators.js'

const INTERNAL_ROLES = ['staff', 'manager', 'administrator', 'delivery_partner']
const ALL_ROLES = ['customer', 'staff', 'manager', 'administrator', 'delivery_partner']

function omitPassword(user) {
  if (!user) return null
  const { password: _password, ...safe } = user
  return safe
}

export function createAdminService({ users }) {
  function findUser(id) {
    return users.findById(Number(id)) || users.findById(String(id))
  }

  return {
    listUsers(filters = {}) {
      let all = users.findAll()
      if (filters.role) all = all.filter(u => u.role === filters.role)
      if (filters.status) all = all.filter(u => u.status === filters.status)
      if (filters.search) {
        const q = filters.search.toLowerCase().trim()
        all = all.filter(
          u =>
            (u.fullName && u.fullName.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.phone && u.phone.includes(q))
        )
      }
      return all.map(omitPassword)
    },

    getUserById(id) {
      const user = findUser(id)
      if (!user) throw new HttpError(404, 'Không tìm thấy tài khoản.')
      return omitPassword(user)
    },

    createInternalAccount({ fullName, email, phone, password, role }) {
      if (!INTERNAL_ROLES.includes(role))
        throw new HttpError(400, 'Vai trò không hợp lệ cho tài khoản nội bộ.')

      validateCreateInternalAccountBody({ fullName, email, phone, password })

      const existing = users.findByEmail(email.trim().toLowerCase())
      if (existing) throw new HttpError(409, 'Email đã được sử dụng.')

      const newUser = users.create({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        password,
        role,
        status: 'active',
        emailVerified: true,
      })
      return omitPassword(newUser)
    },

    updateUser(id, { fullName, phone, role, status }, currentUserId) {
      const user = findUser(id)
      if (!user) throw new HttpError(404, 'Không tìm thấy tài khoản.')

      validateUpdateUserBody({ fullName, phone })

      const isSelf = currentUserId && String(user.id) === String(currentUserId)

      const changes = {}
      if (fullName !== undefined) {
        changes.fullName = fullName.trim()
      }
      if (phone !== undefined) changes.phone = phone?.trim() || ''

      if (role !== undefined) {
        if (!ALL_ROLES.includes(role))
          throw new HttpError(400, 'Vai trò không hợp lệ.')
        if (isSelf && role !== 'administrator')
          throw new HttpError(400, 'Không thể tự thay đổi vai trò quản trị viên của chính bạn.')
        changes.role = role
      }
      if (status !== undefined) {
        if (!['active', 'inactive'].includes(status))
          throw new HttpError(400, 'Trạng thái không hợp lệ.')
        if (isSelf && status === 'inactive')
          throw new HttpError(400, 'Không thể tự tạm khóa tài khoản của chính bạn.')
        changes.status = status
      }

      const updated = users.update(user.id, changes)
      return omitPassword(updated)
    },

    toggleStatus(id, currentUserId) {
      const user = findUser(id)
      if (!user) throw new HttpError(404, 'Không tìm thấy tài khoản.')

      const isSelf = currentUserId && String(user.id) === String(currentUserId)
      if (isSelf && user.status === 'active') {
        throw new HttpError(400, 'Không thể tạm khóa tài khoản của chính bạn.')
      }

      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      const updated = users.update(user.id, { status: newStatus })
      return omitPassword(updated)
    },

    getStats() {
      const all = users.findAll()
      const byRole = {}
      const byStatus = { active: 0, inactive: 0 }
      for (const u of all) {
        byRole[u.role] = (byRole[u.role] || 0) + 1
        byStatus[u.status] = (byStatus[u.status] || 0) + 1
      }
      return { total: all.length, byRole, byStatus }
    },
  }
}

