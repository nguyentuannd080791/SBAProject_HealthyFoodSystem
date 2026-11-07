import { Navigate, useLocation } from "react-router";
import { useAuth } from "../provider/useAuth";
import { getAccessRedirect } from "./accessRules";

export function RequireRole({ roles, children }) {
  const { user, isRestoringSession } = useAuth();
  const location = useLocation();
  const redirectPath = getAccessRedirect(user, roles);

  if (isRestoringSession) return <p role="status">Đang khôi phục phiên đăng nhập...</p>;
  if (redirectPath) return <Navigate to={redirectPath}
    state={{ from: location.pathname + location.search }} replace />;
  return children;
}
