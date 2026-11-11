export const ROLES = [
  {
    value: "customer",
    label: "Khách hàng",
    color: "#475569",
    bg: "#f1f5f9",
    border: "#cbd5e1",
  },
  {
    value: "staff",
    label: "Nhân viên",
    color: "#0369a1",
    bg: "#e0f2fe",
    border: "#bae6fd",
  },
  {
    value: "manager",
    label: "Quản lý",
    color: "#6d28d9",
    bg: "#ede9fe",
    border: "#ddd6fe",
  },
  {
    value: "administrator",
    label: "Quản trị viên",
    color: "#b91c1c",
    bg: "#fee2e2",
    border: "#fecaca",
  },
  {
    value: "delivery_partner",
    label: "Đối tác giao hàng",
    color: "#b45309",
    bg: "#fef3c7",
    border: "#fde68a",
  },
];

export const INTERNAL_ROLES = ROLES.filter((r) => r.value !== "customer");

export const PERMISSION_LABELS = {
  MANAGE_USERS: "Quản lý tài khoản người dùng",
  CREATE_INTERNAL_ACCOUNT: "Tạo tài khoản nội bộ",
  ASSIGN_ROLES: "Phân quyền & đổi vai trò",
  VIEW_STATS: "Xem thống kê hệ thống",
  SYSTEM_CONFIG: "Cấu hình hệ thống",
  VIEW_REPORTS: "Xem báo cáo & đối soát",
  MANAGE_MENU: "Quản lý thực đơn & khuyến mãi",
  MANAGE_ORDERS: "Quản lý tất cả đơn hàng",
  VIEW_ORDERS: "Xem đơn hàng cần xử lý",
  PROCESS_ORDERS: "Xử lý & in hóa đơn đơn hàng",
  VIEW_DELIVERIES: "Xem đơn cần giao",
  UPDATE_DELIVERY_STATUS: "Cập nhật trạng thái giao hàng",
  BROWSE_MENU: "Xem thực đơn & sản phẩm",
  CREATE_ORDER: "Đặt hàng & thanh toán",
  MANAGE_PROFILE: "Quản lý hồ sơ & địa chỉ cá nhân",
};

export function getPermissionLabel(code) {
  return PERMISSION_LABELS[code] || code;
}

export function getRoleLabel(role) {
  const found = ROLES.find((r) => r.value === role);
  return found ? found.label : role;
}

export function getRoleStyle(role) {
  const found = ROLES.find((r) => r.value === role);
  return found
    ? {
        color: found.color,
        backgroundColor: found.bg,
        border: `1px solid ${found.border}`,
        fontWeight: 600,
        fontSize: "0.78rem",
        padding: "4px 10px",
        borderRadius: "20px",
        display: "inline-block",
      }
    : {
        color: "#475569",
        backgroundColor: "#f1f5f9",
        border: "1px solid #cbd5e1",
        fontWeight: 600,
        fontSize: "0.78rem",
        padding: "4px 10px",
        borderRadius: "20px",
        display: "inline-block",
      };
}

export function getStatusStyle(status) {
  return status === "active"
    ? {
        color: "#15803d",
        backgroundColor: "#dcfce7",
        border: "1px solid #bbf7d0",
        fontWeight: 600,
        fontSize: "0.78rem",
        padding: "4px 10px",
        borderRadius: "20px",
        display: "inline-block",
      }
    : {
        color: "#64748b",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        fontWeight: 600,
        fontSize: "0.78rem",
        padding: "4px 10px",
        borderRadius: "20px",
        display: "inline-block",
      };
}
