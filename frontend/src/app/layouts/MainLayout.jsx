import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router";
import { FloatingCartLink } from "../../modules/cart/components/FloatingCartLink";
import { HomeFooter } from "../../modules/home/components/HomeFooter";
import { PaymentNotificationWatcher } from "../../modules/orders/components/PaymentNotificationWatcher";
import { StaffHandoverNotificationWatcher } from "../../modules/staff/components/StaffHandoverNotificationWatcher";
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
    nutrition: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  };
  return <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

export function MainLayout() {
  const { user } = useAuth();
  const { pathname, search } = useLocation();
  const isMenuPage = pathname === "/menu";
  const isOffersPage = isMenuPage && new URLSearchParams(search).get("offers") === "1";
  const isMenuOrProduct = isMenuPage || pathname.startsWith("/products/");
  const isCustomer = !user?.role || user.role.toLowerCase() === "customer";
  const isCustomerPage = !/^\/(manager|staff|admin|delivery)(\/|$)/.test(pathname);
  const showFloatingCart = isCustomer && (pathname === "/" || isMenuPage || pathname.startsWith("/products/"));

  return (
    <NotificationProvider key={user?.id ?? "guest"}>
      <PaymentNotificationWatcher />
      <StaffHandoverNotificationWatcher />
      <div className="menu-layout">
        <Navbar expand="lg" className="menu-navbar">
          <Container fluid className="menu-shell menu-navbar-inner">
            <Navbar.Brand as={Link} to="/" className="menu-brand">
              <span className="menu-brand-mark"><LeafIcon size={24} /></span>
              <span className="menu-brand-copy">
                <strong>Healthy<span>Food</span></strong>
                <small>Ăn lành sống khỏe</small>
              </span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-navbar" aria-label="Mở menu điều hướng" />
            <Navbar.Collapse id="main-navbar">
              <Nav className="menu-primary-nav me-auto">
                <Nav.Link as={Link} to="/" className={pathname === "/" ? "is-current" : undefined}>
                  <HeaderIcon type="home" /><span>Trang chủ</span>
                </Nav.Link>
                {user && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/menu"
                      className={isMenuOrProduct && !isOffersPage ? "is-current" : undefined}
                    >
                      <HeaderIcon type="menu" /><span>Thực đơn</span>
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/menu?offers=1"
                      className={isOffersPage ? "is-current" : undefined}
                    >
                      <HeaderIcon type="offer" /><span>Khuyến mãi</span>
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/nutrition"
                      className={pathname === "/nutrition" ? "is-current" : undefined}
                    >
                      <HeaderIcon type="nutrition" /><span>Đo chỉ số</span>
                    </Nav.Link>
                  </>
                )}
              </Nav>
              <UserMenu showCart={true} />
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container as="main" fluid={isMenuPage} className={isMenuPage ? "menu-shell menu-main" : "py-4"}>
          <Outlet />
        </Container>
        {isCustomerPage && (
          <Container fluid={isMenuPage} className={isMenuPage ? "menu-shell" : "pb-4"}>
            <HomeFooter />
          </Container>
        )}
        {showFloatingCart && <FloatingCartLink />}
      </div>
    </NotificationProvider>
  );
}
