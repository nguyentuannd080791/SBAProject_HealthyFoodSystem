import { NavLink, Outlet, useLocation } from "react-router";
import { CartIcon, LockIcon } from "../../../shared/components/Icons";
import "../../manager/components/manager.css";

const STAFF_SECTIONS = [
  {
    title: "Vận hành Đơn hàng",
    items: [
      { to: "/staff", label: "Xử lý đơn hàng", icon: CartIcon, end: true },
    ],
  },
  {
    title: "Bảo mật",
    items: [
      {
        to: "/staff/password",
        label: "Đổi mật khẩu",
        icon: LockIcon,
        end: true,
      },
    ],
  },
];

export function StaffLayout() {
  const { pathname } = useLocation();

  return (
    <div className="manager-workspace">
      <div className="manager-grid">
        <aside className="manager-sidebar-container">
          <div className="manager-sidebar-card">
            <div className="manager-sidebar-brand-box">
              <div className="manager-sidebar-brand-badge">
                <span className="manager-sidebar-badge-dot"></span>
                <span>Vận hành Cửa hàng</span>
              </div>
              <h2 className="manager-sidebar-brand-title">
                Điều phối Đơn hàng
              </h2>
              <p className="manager-sidebar-brand-subtitle">
                Xác nhận chế biến, chuẩn bị món và bàn giao cho đối tác giao
                vận.
              </p>
            </div>

            <nav
              className="manager-sidebar-nav"
              aria-label="Điều hướng nhân viên"
            >
              {STAFF_SECTIONS.map((section) => (
                <div key={section.title} className="manager-sidebar-group">
                  <div className="manager-sidebar-group-title">
                    {section.title}
                  </div>
                  <div className="manager-sidebar-group-items">
                    {section.items.map(({ to, label, icon: Icon, end }) => {
                      const isCurrent = end
                        ? pathname === to
                        : pathname === to || pathname.startsWith(to + "/");
                      return (
                        <NavLink
                          key={to}
                          to={to}
                          end={end}
                          className={`manager-sidebar-link ${isCurrent ? "is-active" : ""}`}
                        >
                          <span className="manager-sidebar-link-icon">
                            <Icon size={18} />
                          </span>
                          <span className="manager-sidebar-link-label">
                            {label}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="manager-content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
