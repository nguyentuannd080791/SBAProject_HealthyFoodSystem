import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LeafIcon } from "../../shared/components/Icons";
import { FloatingCartLink } from "../../modules/cart/components/FloatingCartLink";
import { UserMenu } from "./UserMenu";
import { NotificationProvider } from "../../shared/notifications/NotificationProvider";
import { PaymentNotificationWatcher } from "../../modules/orders/components/PaymentNotificationWatcher";
import { StaffHandoverNotificationWatcher } from "../../modules/staff/components/StaffHandoverNotificationWatcher";
import { useAuth } from "../provider/useAuth";

import "../../modules/menu/styles/menu.css";

export function MainLayout() {
  const { user } = useAuth();
  const pathname = useLocation().pathname;
  const isMenuPage = pathname === "/menu";
  const isCustomerPage = !/^\/(manager|staff|admin|delivery)(\/|$)/.test(pathname);
  const showFloatingCart = pathname === "/" || isMenuPage || pathname.startsWith("/products/");

  return (
    <NotificationProvider key={user?.id ?? "guest"}>
      <PaymentNotificationWatcher />
      <StaffHandoverNotificationWatcher />
    <div className={isCustomerPage ? "menu-layout" : undefined}>
      <Navbar expand="lg" className={isCustomerPage ? "menu-navbar" : "border-bottom bg-white"}>
        <Container fluid={isCustomerPage} className={isCustomerPage ? "menu-shell menu-navbar-inner" : undefined}>
          <Navbar.Brand as={Link} to="/" className={isCustomerPage ? "menu-brand" : undefined}>
            {isCustomerPage && <span className="menu-brand-mark"><LeafIcon size={24} /></span>}
            Healthy Food
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" aria-label="Mở menu điều hướng" />
          <Navbar.Collapse id="main-navbar">
            <Nav className={isCustomerPage ? "menu-primary-nav me-auto" : "me-auto"}>
              <Nav.Link as={NavLink} to="/menu">Thực đơn</Nav.Link>
              {isCustomerPage && <Nav.Link as={NavLink} to="/orders">Đơn hàng</Nav.Link>}
            </Nav>
            <UserMenu menuStyle={isCustomerPage} />
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
