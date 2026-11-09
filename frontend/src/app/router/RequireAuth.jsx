import { Navigate, useLocation } from "react-router";
import { useAuth } from "../provider/useAuth";

export function RequireAuth({ children }) {
  const { user, isRestoringSession } = useAuth();
  const location = useLocation();
  if (isRestoringSession) return <p role="status">Đang khôi phục phiên đăng nhập...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  return children;
}
