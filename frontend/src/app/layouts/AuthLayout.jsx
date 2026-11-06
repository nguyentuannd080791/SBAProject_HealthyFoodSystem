import { Outlet } from "react-router";
import { Container } from "react-bootstrap";

export function AuthLayout() {
  return (
    <div className="auth-layout-bg">
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}
