import { HttpError } from '../errors/HttpError.js'
import {
  toText, validateChangedPassword, validateEmail, validateFullName, validateNewPassword,
  validatePhone, validateRequired, validateVerificationCode,
} from './fieldValidators.js'

function ensureNoErrors(messagesByField) {
  const firstMessage = Object.values(messagesByField).find(Boolean)
  if (firstMessage) throw new HttpError(400, firstMessage)
}

export function validateRegisterBody(body) {
  ensureNoErrors({
    fullName: validateFullName(toText(body.fullName)),
    email: validateEmail(toText(body.email)),
    phone: validatePhone(toText(body.phone)),
    password: validateNewPassword(toText(body.password)),
  })
}

export function validateEmailBody(body) {
  ensureNoErrors({ email: validateEmail(toText(body.email)) })
}

export function validateVerifyEmailBody(body) {
  ensureNoErrors({
    email: validateEmail(toText(body.email)),
    code: validateVerificationCode(toText(body.code)),
  })
}

export function validateLoginBody(body) {
  ensureNoErrors({
    email: validateEmail(toText(body.email)),
    password: validateRequired(toText(body.password), 'Vui lòng nhập mật khẩu.'),
  })
}

export function validateResetPasswordBody(body) {
  ensureNoErrors({
    email: validateEmail(toText(body.email)),
    code: validateVerificationCode(toText(body.code)),
    password: validateNewPassword(toText(body.password)),
  })
}

export function validateChangePasswordBody(body) {
  const currentPassword = toText(body.currentPassword)
  ensureNoErrors({
    currentPassword: validateRequired(currentPassword, 'Vui lòng nhập mật khẩu hiện tại.'),
    newPassword: validateChangedPassword(currentPassword, toText(body.newPassword)),
  })
}

export function validateProfileBody(body) {
  ensureNoErrors({
    fullName: validateFullName(toText(body.fullName)),
    phone: validatePhone(toText(body.phone)),
  })
}

export function validateAddressBody(body) {
  ensureNoErrors({
    recipientName: validateFullName(toText(body.recipientName)),
    recipientPhone: validatePhone(toText(body.recipientPhone)),
    street: validateRequired(toText(body.street), 'Vui lòng nhập số nhà, tên đường.'),
    ward: validateRequired(toText(body.ward), 'Vui lòng nhập phường/xã.'),
    district: validateRequired(toText(body.district), 'Vui lòng nhập quận/huyện.'),
    city: validateRequired(toText(body.city), 'Vui lòng nhập tỉnh/thành phố.'),
  })
}

export function validateCreateInternalAccountBody(body) {
  ensureNoErrors({
    fullName: validateFullName(toText(body.fullName)),
    email: validateEmail(toText(body.email)),
    phone: validatePhone(toText(body.phone)),
    password: validateRequired(toText(body.password), 'Vui lòng nhập mật khẩu.'),
  })
  if (toText(body.password).length < 6) {
    throw new HttpError(400, 'Mật khẩu phải có ít nhất 6 ký tự.')
  }
}

export function validateUpdateUserBody(body) {
  if (body.fullName !== undefined) {
    ensureNoErrors({ fullName: validateFullName(toText(body.fullName)) })
  }
  if (body.phone !== undefined && body.phone) {
    ensureNoErrors({ phone: validatePhone(toText(body.phone)) })
  }
}

