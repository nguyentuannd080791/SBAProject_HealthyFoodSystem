import { useNavigate } from "react-router";
import { authApi } from "../../auth/api/authApi";
import {
  LockIcon,
  LogOutIcon,
  MapPinIcon,
  UserIcon,
} from "../../../shared/components/Icons";
import { getRoleLabel, getUserInitials } from "../../../shared/utils/roleUtils";
import { useAuth } from "../../../app/provider/useAuth";

export function ProfileSidebar({ activeTab, onSelectTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await authApi.logout();
    logout();
    navigate("/login");
  }

  const initials = getUserInitials(user?.fullName);

  const menuItems = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      description: "Thông tin liên hệ & tài khoản",
      icon: UserIcon,
    },
    {
      key: "address",
      label: "Địa chỉ giao hàng",
      description: "Sổ địa chỉ nhận hàng của bạn",
      icon: MapPinIcon,
    },
    {
      key: "password",
      label: "Đổi mật khẩu",
      description: "Quản lý mật khẩu & bảo mật",
      icon: LockIcon,
    },
  ];

  return (
    <div className="profile-sidebar-card">
      <div className="profile-sidebar-header">
        <div className="profile-avatar-large">{initials}</div>
        <h3 className="h6 fw-bold mb-1 text-dark text-truncate">
          {user?.fullName || "Người dùng"}
        </h3>
        <p className="text-muted small mb-2 text-truncate">{user?.email}</p>
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
          {getRoleLabel(user?.role)}
        </span>
      </div>

      <div className="p-3">
        <nav className="d-flex flex-column gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`profile-nav-btn ${isActive ? "active" : ""}`}
                onClick={() => onSelectTab(item.key)}
              >
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center p-2"
                  style={{
                    backgroundColor: isActive ? "#dcfce7" : "#f1f5f9",
                    color: isActive ? "var(--hf-primary)" : "#64748b",
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className="text-truncate">
                  <div className="fw-semibold lh-sm">{item.label}</div>
                  <div
                    className="small text-muted text-truncate"
                    style={{ fontSize: "11.5px" }}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <hr className="my-3 border-secondary-subtle" />

        <button
          type="button"
          className="profile-nav-btn text-danger"
          onClick={handleLogout}
          style={{ "--hf-primary": "#dc2626" }}
        >
          <div
            className="rounded-3 d-flex align-items-center justify-content-center p-2"
            style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
          >
            <LogOutIcon size={18} />
          </div>
          <div className="fw-semibold">Đăng xuất</div>
        </button>
      </div>
    </div>
  );
}
