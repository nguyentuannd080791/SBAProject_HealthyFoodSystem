import { collectErrors } from "../../../shared/utils/collectErrors";
import {
  validateFullName,
  validatePhone,
} from "../../../shared/utils/fieldValidators";

const emailPattern = /^\S+@\S+\.\S+$/;

export function validateEmail(value) {
  const email = (value || "").trim();
  if (!email) return "Vui lòng nhập email.";
  if (!emailPattern.test(email)) return "Email không hợp lệ.";
  return "";
}

export function validateRole(value) {
  if (!value) return "Vui lòng chọn vai trò.";
  return "";
}

export function validateCreatePassword(value) {
  if (!value) return "Vui lòng nhập mật khẩu.";
  if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
  return "";
}

export function validateCreateAccountValues(values) {
  return collectErrors({
    fullName: validateFullName(values.fullName || ""),
    email: validateEmail(values.email || ""),
    phone: validatePhone(values.phone || ""),
    role: validateRole(values.role || ""),
    password: validateCreatePassword(values.password || ""),
    confirmPassword:
      values.password !== values.confirmPassword
        ? "Mật khẩu nhập lại không khớp."
        : "",
  });
}

export function validateEditAccountValues(values) {
  return collectErrors({
    fullName: validateFullName(values.fullName || ""),
    phone: validatePhone(values.phone || ""),
    role: validateRole(values.role || ""),
  });
}

