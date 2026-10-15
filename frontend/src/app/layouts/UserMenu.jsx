import { Link, useNavigate } from "react-router";
import { Button, Dropdown } from "react-bootstrap";
import { authApi } from "../../modules/auth/api/authApi";
import {
  ChevronDownIcon,
  LogInIcon,
  LogOutIcon,
  LockIcon,
  UserIcon,
} from "../../shared/components/Icons";
import { getRoleLabel, getUserInitials } from "../../shared/utils/roleUtils";
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
      <Button
        as={Link}
        to="/login"
        variant="outline-primary"
        size="sm"
        className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1"
      >
        <LogInIcon size={16} />
        <span>Đăng nhập</span>
      </Button>
    );
  }

  const initials = getUserInitials(user.fullName);

  return (
    <Dropdown align="end" className="d-inline-block">
      <Dropdown.Toggle
        as="div"
        role="button"
        tabIndex={0}
        className="user-dropdown-toggle"
        id="user-dropdown-menu"
      >
        <span className="user-avatar-circle">{initials}</span>
        <span
          className="d-none d-sm-inline-block text-truncate"
          style={{ maxWidth: 140 }}
        >
          {user.fullName}
        </span>
        <ChevronDownIcon size={14} className="text-muted ms-1" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-dropdown-menu">
        <div className="px-3 py-2">
          <div className="fw-semibold text-dark text-truncate">
            {user.fullName}
          </div>
          <div className="text-muted small text-truncate mb-2">
            {user.email}
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle">
            {getRoleLabel(user.role)}
          </span>
        </div>

        <Dropdown.Divider className="my-1" />

        {user.role === "customer" && (
          <Dropdown.Item as={Link} to="/profile">
            <UserIcon size={16} className="text-secondary" />
            <span>Hồ sơ</span>
          </Dropdown.Item>
        )}

        <Dropdown.Item
          as={Link}
          to={user.role === "customer" ? "/profile?tab=password" : "/change-password"}
        >
          <LockIcon size={16} className="text-secondary" />
          <span>Đổi mật khẩu</span>
        </Dropdown.Item>

        <Dropdown.Divider className="my-1" />

        <Dropdown.Item onClick={handleLogout} className="text-danger">
          <LogOutIcon size={16} />
          <span>Đăng xuất</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
