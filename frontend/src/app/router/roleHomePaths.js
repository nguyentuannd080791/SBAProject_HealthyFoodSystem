const roleHomePaths = {
  customer: "/menu",
  staff: "/staff",
  manager: "/manager",
  administrator: "/admin",
  delivery_partner: "/delivery",
};

export function getHomePath(role) {
  const normalized = (role || "").toLowerCase();
  return Object.hasOwn(roleHomePaths, normalized)
    ? roleHomePaths[normalized]
    : "/";
}
