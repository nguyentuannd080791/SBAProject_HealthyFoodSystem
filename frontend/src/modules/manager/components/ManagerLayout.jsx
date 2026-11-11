import { NavLink, Outlet, useLocation } from "react-router";
import {
  ActivityIcon,
  CartIcon,
  LeafIcon,
  LockIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
} from "../../../shared/components/Icons";
import "./manager.css";

const MANAGER_SECTIONS = [
  {
    title: "Vận hành & Đơn hàng",
    items: [
      { to: "/manager/orders", label: "Quản lý đơn hàng", icon: CartIcon },
      { to: "/manager/reconciliation", label: "Đối soát doanh thu", icon: ActivityIcon },
    ],
  },
  {
    title: "Thực đơn & Món ăn",
    items: [
      { to: "/manager/products", label: "Sản phẩm món ăn", icon: ShoppingBagIcon },
      { to: "/manager/categories", label: "Danh mục thực đơn", icon: TagIcon },
    ],
  },
  {
    title: "Kho & Tiếp thị",
    items: [
      { to: "/manager/ingredients", label: "Kho nguyên liệu", icon: LeafIcon },
      { to: "/manager/promotions", label: "Chương trình ưu đãi", icon: SparklesIcon },
    ],
  },
  {
    title: "Bảo mật",
    items: [
      { to: "/manager/password", label: "Đổi mật khẩu", icon: LockIcon },
    ],
  },
];

export function ManagerLayout() {
  const { pathname } = useLocation();

  return (
    <div className="manager-workspace">
      <div className="manager-grid">
        <aside className="manager-sidebar-container">
          <div className="manager-sidebar-card">
            <div className="manager-sidebar-brand-box">
              <div className="manager-sidebar-brand-badge">
                <span className="manager-sidebar-badge-dot"></span>
                <span>Hệ thống Quản lý</span>
              </div>
              <h2 className="manager-sidebar-brand-title">Điều hành Cửa hàng</h2>
              <p className="manager-sidebar-brand-subtitle">
                Xử lý đơn hàng, điều chỉnh thực đơn và kiểm soát doanh thu.
              </p>
            </div>

            <nav className="manager-sidebar-nav" aria-label="Điều hướng quản lý">
              {MANAGER_SECTIONS.map((section) => (
                <div key={section.title} className="manager-sidebar-group">
                  <div className="manager-sidebar-group-title">
                    {section.title}
                  </div>
                  <div className="manager-sidebar-group-items">
                    {section.items.map(({ to, label, icon: Icon }) => {
                      const isCurrent =
                        pathname === to ||
                        (to !== "/manager" && pathname.startsWith(to + "/"));
                      return (
                        <NavLink
                          key={to}
                          to={to}
                          className={`manager-sidebar-link ${isCurrent ? "is-active" : ""}`}
                        >
                          <span className="manager-sidebar-link-icon">
                            <Icon size={18} />
                          </span>
                          <span className="manager-sidebar-link-label">{label}</span>
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
