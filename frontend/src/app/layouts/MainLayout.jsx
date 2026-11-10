import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { FloatingCartLink } from "../../modules/cart/components/FloatingCartLink";
import { PaymentNotificationWatcher } from "../../modules/orders/components/PaymentNotificationWatcher";
import { LeafIcon, ShoppingBagIcon } from "../../shared/components/Icons";
import { NotificationProvider } from "../../shared/notifications/NotificationProvider";
import { useAuth } from "../provider/useAuth";
import { UserMenu } from "./UserMenu";

import "../../modules/menu/styles/menu.css";

export function MainLayout() {
  const { user } = useAuth();
  const pathname = useLocation().pathname;
  const isMenuPage = pathname === "/menu";
  const isManagerPage = /^\/manager(\/|$)/.test(pathname);
  const isCustomerPage = !/^\/(manager|staff|admin)(\/|$)/.test(pathname);
  const showFloatingCart = pathname === "/" || isMenuPage || pathname.startsWith("/products/");
  const isManager = (user?.role || "").toLowerCase() === "manager";

  return (
    <NotificationProvider key={user?.id ?? "guest"}>
      <PaymentNotificationWatcher />
    <div className={isCustomerPage ? "menu-layout" : isManagerPage ? "manager-page-layout" : undefined}>
      <Navbar expand="lg" className={isCustomerPage ? "menu-navbar" : isManagerPage ? "manager-topbar" : "border-bottom bg-white"}>
        <Container fluid={isCustomerPage} className={isCustomerPage ? "menu-shell menu-navbar-inner" : isManagerPage ? "manager-topbar-inner" : undefined}>
          <Navbar.Brand as={Link} to="/" className={isCustomerPage ? "menu-brand" : isManagerPage ? "manager-brand" : undefined}>
            {(isCustomerPage || isManagerPage) && <span className="menu-brand-mark"><LeafIcon size={24} /></span>}
            Healthy Food
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" aria-label="Mở menu điều hướng" />
          <Navbar.Collapse id="main-navbar">
            <Nav className={isCustomerPage ? "menu-primary-nav me-auto" : isManagerPage ? "manager-topnav me-auto" : "me-auto"}>
              {isManagerPage && <Nav.Link as={NavLink} to="/manager">
                <ShoppingBagIcon size={18} /> Quản lý cửa hàng
              </Nav.Link>}
              <Nav.Link as={NavLink} to="/menu">
                {isManagerPage && <LeafIcon size={18} />}
                Thực đơn
              </Nav.Link>
              {isCustomerPage && <Nav.Link as={NavLink} to={isManager ? "/manager" : "/orders"}>
                {isManager ? "Quản lý cửa hàng" : "Đơn hàng"}
              </Nav.Link>}
            </Nav>
            <UserMenu menuStyle={isCustomerPage || isManagerPage} showCart={isCustomerPage} />
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
