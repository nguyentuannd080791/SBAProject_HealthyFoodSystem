import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { FloatingCartLink } from "../../modules/cart/components/FloatingCartLink";
import { PaymentNotificationWatcher } from "../../modules/orders/components/PaymentNotificationWatcher";
import { LeafIcon } from "../../shared/components/Icons";
import { NotificationProvider } from "../../shared/notifications/NotificationProvider";
import { useAuth } from "../provider/useAuth";
import { UserMenu } from "./UserMenu";

import "../../modules/menu/styles/menu.css";

function HeaderIcon({ type }) {
  const paths = {
    home: <><path d="m2 11 10-8 10 8" /><path d="M5 10v11h14V10M10 21v-7h4v7" /></>,
    menu: <><path d="M4 3v8M7 3v8M10 3v8M7 11v10M17 3c-3 3-3 7 0 10h2V3M18 13v8" /></>,
    offer: <><path d="M20 13 13 20a2 2 0 0 1-2.8 0L3 12.8V4a1 1 0 0 1 1-1h8.8L20 10.2a2 2 0 0 1 0 2.8Z" /><circle cx="8" cy="8" r="1" /></>,
  };
  return <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

export function MainLayout() {
  const { user } = useAuth();
  const { pathname, search } = useLocation();
  const isMenuPage = pathname === "/menu";
  const isOffersPage = isMenuPage && new URLSearchParams(search).get("offers") === "1";
  const isCustomerPage = !/^\/(manager|staff|admin)(\/|$)/.test(pathname);
  const showFloatingCart = pathname === "/" || isMenuPage || pathname.startsWith("/products/");

  return (
    <NotificationProvider key={user?.id ?? "guest"}>
      <PaymentNotificationWatcher />
    <div className={isCustomerPage ? "menu-layout" : undefined}>
      <Navbar expand="lg" className={isCustomerPage ? `menu-navbar${isMenuPage ? " menu-navbar-catalog" : ""}` : "border-bottom bg-white"}>
        <Container fluid={isCustomerPage} className={isCustomerPage ? "menu-shell menu-navbar-inner" : undefined}>
          <Navbar.Brand as={Link} to="/" className={isCustomerPage ? "menu-brand" : undefined}>
            {isCustomerPage && <span className="menu-brand-mark"><LeafIcon size={28} /></span>}
            {isMenuPage ? <span className="menu-brand-copy"><strong>Healthy<span>Food</span></strong><small>Ăn lành sống khỏe</small></span> : "Healthy Food"}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" aria-label="Mở menu điều hướng" />
          <Navbar.Collapse id="main-navbar">
            {isMenuPage ? <Nav className="menu-primary-nav menu-catalog-nav me-auto">
              <Nav.Link as={Link} to="/"><HeaderIcon type="home" /><span>Trang chủ</span></Nav.Link>
              {user && <>
                <Nav.Link as={Link} to="/menu" className={!isOffersPage ? "is-current" : undefined}><HeaderIcon type="menu" /><span>Thực đơn</span></Nav.Link>
                <Nav.Link as={Link} to="/menu?offers=1" className={isOffersPage ? "is-current" : undefined}><HeaderIcon type="offer" /><span>Khuyến mãi</span></Nav.Link>
              </>}
            </Nav> : <Nav className={isCustomerPage ? "menu-primary-nav me-auto" : "me-auto"}>
              {user && <Nav.Link as={NavLink} to="/menu">Thực đơn</Nav.Link>}
              {user && isCustomerPage && <Nav.Link as={NavLink} to="/orders">Đơn hàng</Nav.Link>}
            </Nav>}
            {isMenuPage && <button type="button" className="menu-header-search" aria-label="Tìm món ăn"
              onClick={() => document.getElementById("menu-search")?.focus()}>
              <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></svg>
            </button>}
            <UserMenu menuStyle={isCustomerPage} hideCart={isMenuPage} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as="main" fluid={isMenuPage} className={isMenuPage ? "menu-shell menu-main" : "py-4"}>
        <Outlet />
      </Container>
      {showFloatingCart && <FloatingCartLink />}
    </div>
    </NotificationProvider>
  );
}
