import { Link, useNavigate } from "react-router";
import { Dropdown, Nav } from "react-bootstrap";
import { authApi } from "../../modules/auth/api/authApi";
import { useCart } from "../../modules/cart/hooks/useCart";
import {
  CartIcon,
  ChevronDownIcon,
  LockIcon,
  LogOutIcon,
  ShoppingBagIcon,
  UserIcon,
} from "../../shared/components/Icons";
import { useAuth } from "../provider/useAuth";

export function UserMenu({ showCart = true }) {
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
      navigate("/login", { replace: true });
    }
  }

  const role = (user?.role || "").toLowerCase();
  const isCustomer = !role || role === "customer";
  const displayName = user?.fullName || user?.email || "Tài khoản";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (!user) {
    return (
      <div className="menu-header-actions">
        {showCart && (
          <Link
            to="/cart"
            className="menu-header-cart"
            aria-label={`Giỏ hàng (${totalItems})`}
          >
            <CartIcon size={22} />
            <span>Giỏ hàng ({totalItems})</span>
          </Link>
        )}
        <Link to="/login" className="menu-login-link">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="menu-header-actions">
      {showCart && isCustomer && (
        <Link
          to="/cart"
          className="menu-header-cart"
          aria-label={`Giỏ hàng (${totalItems})`}
        >
          <CartIcon size={22} />
          <span>Giỏ hàng ({totalItems})</span>
        </Link>
      )}

      <Dropdown align="end" className="menu-account-dropdown">
        <Dropdown.Toggle
          variant="link"
          id="menu-account-toggle"
          className="menu-account-toggle"
        >
          <span className="menu-account-avatar">{initials}</span>
          <span className="menu-account-name">{displayName}</span>
          <ChevronDownIcon size={17} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="menu-account-list">
          {isCustomer ? (
            <>
              <Dropdown.Item as={Link} to="/profile">
                <UserIcon size={19} /> Hồ sơ cá nhân
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/orders">
                <ShoppingBagIcon size={19} /> Đơn hàng của tôi
              </Dropdown.Item>
            </>
          ) : (
            <Dropdown.Item as={Link} to="/profile">
              <UserIcon size={19} /> Thông tin tài khoản
            </Dropdown.Item>
          )}

          {role === "manager" && (
            <Dropdown.Item as={Link} to="/manager">
              Quản lý cửa hàng
            </Dropdown.Item>
          )}
          {role === "staff" && (
            <Dropdown.Item as={Link} to="/staff">
              Xử lý đơn hàng
            </Dropdown.Item>
          )}
          {role === "administrator" && (
            <Dropdown.Item as={Link} to="/admin">
              Quản trị hệ thống
            </Dropdown.Item>
          )}

          <Dropdown.Item as={Link} to="/change-password">
            <LockIcon size={19} /> Đổi mật khẩu
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as="button" onClick={handleLogout}>
            <LogOutIcon size={19} /> Đăng xuất
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
