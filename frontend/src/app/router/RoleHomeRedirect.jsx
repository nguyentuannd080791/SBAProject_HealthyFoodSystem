import { Navigate } from "react-router";
import { useAuth } from "../provider/useAuth";
import { getHomePath } from "./roleHomePaths";

export function RoleHomeRedirect() {
  const { user } = useAuth();
  const homePath = user ? getHomePath(user.role) : "/menu";

  if (homePath !== "/") return <Navigate to={homePath} replace />;
  return <h1 className="h3">Healthy Food System</h1>;
}
