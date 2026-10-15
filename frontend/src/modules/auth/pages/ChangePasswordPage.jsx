import { Navigate } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { ChangePasswordSection } from "../components/ChangePasswordSection";

export function ChangePasswordPage() {
  const { user } = useAuth();

  if (user?.role === "customer") {
    return <Navigate to="/profile?tab=password" replace />;
  }

  return (
    <div className="mx-auto py-3" style={{ maxWidth: 560 }}>
      <ChangePasswordSection />
    </div>
  );
}
