import { NavLink, Outlet } from 'react-router';
import { ActivityIcon, CartIcon, LeafIcon, ShoppingBagIcon, SparklesIcon } from '../../../shared/components/Icons';
import './manager.css';

const sections = [
  { to: '/manager/products', label: 'Sản phẩm', Icon: ShoppingBagIcon },
  { to: '/manager/ingredients', label: 'Kho nguyên liệu', Icon: LeafIcon },
  { to: '/manager/categories', label: 'Danh mục', Icon: ShoppingBagIcon },
  { to: '/manager/promotions', label: 'Khuyến mãi', Icon: SparklesIcon },
  { to: '/manager/orders', label: 'Đơn hàng', Icon: CartIcon },
  { to: '/manager/reconciliation', label: 'Đối soát', Icon: ActivityIcon },
];

export function ManagerLayout() {
  return <section className="manager-area">
    <div className="manager-banner">
      <div className="manager-banner-icon"><ShoppingBagIcon size={42} /></div>
      <div className="manager-banner-copy">
        <div className="manager-banner-eyebrow">Healthy Food · Manager</div>
        <h1>Quản lý cửa hàng</h1>
        <p>Quản lý thực đơn, khuyến mãi và đơn hàng của cửa hàng.</p>
      </div>
      <img className="manager-banner-food"
        src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"
        alt="" />
    </div>
    <nav className="manager-nav" aria-label="Quản lý">
      {sections.map(({ to, label, Icon }) => <NavLink key={to} to={to}>
        <Icon size={22} /><span>{label}</span>
      </NavLink>)}
    </nav>
    <Outlet />
  </section>;
}
