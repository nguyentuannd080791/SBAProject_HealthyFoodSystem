import { lazy, Suspense } from "react";
import { Navigate } from "react-router";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../provider/useAuth";
import { getHomePath } from "./roleHomePaths";

const HomePage = lazy(() =>
  import("../../modules/home/page/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);

function PageLoadingFallback() {
  return (
    <div className="text-center py-5" role="status">
      <Spinner
        animation="border"
        variant="success"
        size="sm"
        className="me-2"
      />
      <span className="text-muted">Đang tải trang chủ...</span>
    </div>
  );
}

export function RoleHomeRedirect() {
  const { user } = useAuth();
  const homePath = user ? getHomePath(user.role) : "/menu";

  if (homePath !== "/") return <Navigate to={homePath} replace />;

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <HomePage />
    </Suspense>
  );
}
