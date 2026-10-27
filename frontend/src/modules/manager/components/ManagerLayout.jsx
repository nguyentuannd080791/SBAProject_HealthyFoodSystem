import { NavLink, Outlet } from 'react-router';
import './manager.css';

export function ManagerLayout() {
  return <section className="manager-area">
    <div className="manager-banner mb-4"><div className="small text-uppercase fw-semibold mb-2">Healthy Food · Manager</div><h1 className="h3">Quản lý thực đơn & ưu đãi</h1><p className="mb-0">Chăm chút từng món ngon, mang đến nhiều lựa chọn lành mạnh hơn.</p></div>
    <nav className="manager-nav mb-4" aria-label="Quản lý"><NavLink to="/manager/products">Sản phẩm</NavLink><NavLink to="/manager/promotions">Khuyến mãi</NavLink></nav>
    <Outlet />
  </section>;
}
