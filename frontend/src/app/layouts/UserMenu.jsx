import { Link, useNavigate } from "react-router";
import { Dropdown } from "react-bootstrap";
import { authApi } from "../../modules/auth/api/authApi";
import { useCart } from "../../modules/cart/hooks/useCart";
import {
  ActivityIcon,
  CartIcon,
  ChevronDownIcon,
  HeartPulseIcon,
  LeafIcon,
  LockIcon,
  LogOutIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
} from "../../shared/components/Icons";
import { getUserInitials } from "../../shared/utils/roleUtils";
import { useAuth } from "../provider/useAuth";

export function UserMenu({ showCart = true }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  }

  const role = (user?.role || "").toLowerCase();
  const isCustomer = !role || role === "customer";
  const displayName = user?.fullName || user?.email || "Tài khoản";
  const initials = getUserInitials(displayName);

  if (!user) {
    return (
      <div className="menu-header-actions">
        {showCart && (
          <Link
            to="/cart"
            className="menu-header-cart"
            aria-label={`Giỏ hàng (${totalItems})`}
          >
            <CartIcon size={17} />
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
          <CartIcon size={17} />
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
          <ChevronDownIcon size={15} />
        </Dropdown.Toggle>

        <Dropdown.Menu className="menu-account-list">
          {role === "manager" ? (
            <>
              <Dropdown.Header className="menu-account-section-title">
                Nghiệp vụ Quản lý
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/manager/orders">
                <CartIcon size={18} />
                <span>Quản lý đơn hàng</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/manager/reconciliation">
                <ActivityIcon size={18} />
                <span>Đối soát doanh thu</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/manager/products">
                <ShoppingBagIcon size={18} />
                <span>Sản phẩm món ăn</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/manager/categories">
                <TagIcon size={18} />
                <span>Danh mục thực đơn</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/manager/ingredients">
                <LeafIcon size={18} />
                <span>Kho nguyên liệu</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/manager/promotions">
                <SparklesIcon size={18} />
                <span>Chương trình ưu đãi</span>
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Header className="menu-account-section-title">
                Bảo mật
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/manager/password">
                <LockIcon size={18} />
                <span>Đổi mật khẩu</span>
              </Dropdown.Item>
            </>
          ) : role === "staff" ? (
            <>
              <Dropdown.Header className="menu-account-section-title">
                Nghiệp vụ Vận hành
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/staff">
                <CartIcon size={18} />
                <span>Xử lý đơn hàng</span>
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Header className="menu-account-section-title">
                Bảo mật
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/staff/password">
                <LockIcon size={18} />
                <span>Đổi mật khẩu</span>
              </Dropdown.Item>
            </>
          ) : role === "delivery_partner" ? (
            <>
              <Dropdown.Header className="menu-account-section-title">
                Nghiệp vụ Giao hàng
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/delivery">
                <ShoppingBagIcon size={18} />
                <span>Đơn giao hàng</span>
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Header className="menu-account-section-title">
                Bảo mật
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/change-password">
                <LockIcon size={18} />
                <span>Đổi mật khẩu</span>
              </Dropdown.Item>
            </>
          ) : role === "administrator" ? (
            <>
              <Dropdown.Header className="menu-account-section-title">
                Nghiệp vụ Quản trị
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/admin?tab=users">
                <UserIcon size={18} />
                <span>Quản lý người dùng</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin?tab=roles">
                <ShieldCheckIcon size={18} />
                <span>Vai trò & Quyền hạn</span>
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Header className="menu-account-section-title">
                Bảo mật
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/admin?tab=password">
                <LockIcon size={18} />
                <span>Đổi mật khẩu</span>
              </Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Header className="menu-account-section-title">
                Tài khoản
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/profile?tab=profile">
                <UserIcon size={18} />
                <span>Thông tin cá nhân</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/profile?tab=address">
                <MapPinIcon size={18} />
                <span>Địa chỉ giao hàng</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/orders">
                <ShoppingBagIcon size={18} />
                <span>Đơn hàng của tôi</span>
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Header className="menu-account-section-title">
                Sức khỏe & Dinh dưỡng
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/profile?tab=clinical">
                <HeartPulseIcon size={18} />
                <span>Sàng lọc sức khỏe & dị ứng</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/nutrition">
                <ActivityIcon size={18} />
                <span>Chỉ số cơ thể & calo</span>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/nutrition/plan">
                <SparklesIcon size={18} />
                <span>Thực đơn dinh dưỡng</span>
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Header className="menu-account-section-title">
                Bảo mật
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/profile?tab=password">
                <LockIcon size={18} />
                <span>Đổi mật khẩu</span>
              </Dropdown.Item>
            </>
          )}

          <Dropdown.Divider />

          <Dropdown.Item
            as="button"
            onClick={handleLogout}
            className="text-danger"
          >
            <LogOutIcon size={18} />
            <span>Đăng xuất</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
