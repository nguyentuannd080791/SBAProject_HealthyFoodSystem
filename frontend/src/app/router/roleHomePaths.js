const roleHomePaths = {
  customer: "/menu",
  staff: "/staff",
  manager: "/manager",
  administrator: "/admin",
};

export function getHomePath(role) {
  const normalized = (role || "").toLowerCase();
  return Object.hasOwn(roleHomePaths, normalized)
    ? roleHomePaths[normalized]
    : "/";
}
