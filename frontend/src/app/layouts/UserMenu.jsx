import { Link, useNavigate } from "react-router";
import { Button, Nav } from "react-bootstrap";
import { authApi } from "../../modules/auth/api/authApi";
import { useAuth } from "../provider/useAuth";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await authApi.logout();
    logout();
    navigate("/login");
  }

  if (!user) {
    return (
      <Nav.Link as={Link} to="/login">
        Đăng nhập
      </Nav.Link>
    );
  }

  return (
    <div className="d-flex align-items-center flex-wrap gap-3">
      <span>{user.fullName}</span>
      {user.role === "manager" && <Link to="/manager">Quản lý cửa hàng</Link>}
      {user.role === "customer" && <Link to="/profile">Hồ sơ</Link>}
      {user.role === "administrator" && <Link to="/admin">Quản trị</Link>}
      <Link to="/change-password">Đổi mật khẩu</Link>
      <Button variant="outline-primary" size="sm" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>

  );
}
