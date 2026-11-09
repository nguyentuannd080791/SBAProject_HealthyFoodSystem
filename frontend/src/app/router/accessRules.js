import { getHomePath } from "./roleHomePaths";
import { loadToken } from "../../shared/api/tokenStorage";

export function getAccessRedirect(user, allowedRoles) {
  const token = loadToken();
  if (!user || !token) return "/login";

  const userRole = (user.role || "").toLowerCase();
  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(userRole)
  )
    return getHomePath(userRole);

  return "";
}
