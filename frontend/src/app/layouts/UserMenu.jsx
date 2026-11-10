import { Link, useNavigate } from "react-router";
import { Button, Dropdown, Nav } from "react-bootstrap";
import { authApi } from "../../modules/auth/api/authApi";
import { CartBadge } from "../../modules/cart/components/CartBadge";
import { useCart } from "../../modules/cart/hooks/useCart";
import { CartIcon, ChevronDownIcon, LockIcon, LogOutIcon, UserIcon } from "../../shared/components/Icons";
import { useAuth } from "../provider/useAuth";

export function UserMenu({ menuStyle = false }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore server logout error
    } finally {
      logout();
      navigate("/");
    }
  }

  if (menuStyle) {
    const role = (user?.role || "").toLowerCase();
    const displayName = user?.fullName || user?.email || "Tài khoản";
    const initials = displayName.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();

    return (
      <div className="menu-header-actions">
        <Link to="/cart" className="menu-header-cart" aria-label={`Giỏ hàng (${totalItems})`}>
          <CartIcon size={22} />
          <span>Giỏ hàng ({totalItems})</span>
        </Link>
        {user ? (
          <Dropdown align="end" className="menu-account-dropdown">
            <Dropdown.Toggle variant="link" id="menu-account-toggle" className="menu-account-toggle">
              <span className="menu-account-avatar">{initials}</span>
              <span className="menu-account-name">{displayName}</span>
              <ChevronDownIcon size={17} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="menu-account-list">
              <Dropdown.Item as={Link} to="/profile"><UserIcon size={19} /> Hồ sơ cá nhân</Dropdown.Item>
              <Dropdown.Item as={Link} to="/change-password"><LockIcon size={19} /> Đổi mật khẩu</Dropdown.Item>
              {role === "manager" && <Dropdown.Item as={Link} to="/manager">Quản lý cửa hàng</Dropdown.Item>}
              {role === "staff" && <Dropdown.Item as={Link} to="/staff">Xử lý đơn hàng</Dropdown.Item>}
              {role === "administrator" && <Dropdown.Item as={Link} to="/admin">Quản trị</Dropdown.Item>}
              <Dropdown.Divider />
              <Dropdown.Item as="button" onClick={handleLogout}><LogOutIcon size={19} /> Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : <Link to="/login" className="menu-login-link">Đăng nhập</Link>}
      </div>
    );
  }

  if (!user) {
    return (
      <Nav className="d-flex align-items-center gap-3 py-2 py-lg-0">
        <CartBadge />
        <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
      </Nav>
    );
  }

  const role = (user.role || "").toLowerCase();
  return (
    <div className="d-flex flex-wrap align-items-center gap-3 py-2 py-lg-0">
      <CartBadge />
      <span>{user.fullName}</span>
      {role === "manager" && <Link to="/manager">Quản lý cửa hàng</Link>}
      {role === "staff" && <Link to="/staff">Xử lý đơn hàng</Link>}
      {role === "customer" && <><Link to="/orders">Đơn hàng</Link><Link to="/profile">Hồ sơ</Link></>}
      {role === "administrator" && <Link to="/admin">Quản trị</Link>}
      <Link to="/change-password">Đổi mật khẩu</Link>
      <Button variant="outline-primary" size="sm" onClick={handleLogout}>Đăng xuất</Button>
    </div>
  );
}
