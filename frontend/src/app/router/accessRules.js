import { getHomePath } from "./roleHomePaths";

export function getAccessRedirect(user, allowedRoles) {
  if (!user) return "/login";
  const userRole = (user.role || "").toLowerCase();
  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(userRole)
  )
    return getHomePath(userRole);
  return "";
}
