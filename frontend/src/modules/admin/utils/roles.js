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
    label: "Tài xế",
    color: "#b45309",
    bg: "#fef3c7",
    border: "#fde68a",
  },
];

export const INTERNAL_ROLES = ROLES.filter((r) => r.value !== "customer");

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
