export const ROLE_LABELS = {
  customer: "Khách hàng",
  staff: "Nhân viên",
  manager: "Quản lý",
  administrator: "Quản trị viên",
  delivery_partner: "Đối tác giao hàng",
};

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || "Thành viên";
}

export function getUserInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
