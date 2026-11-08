import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LeafIcon } from "../../shared/components/Icons";
import { FloatingCartLink } from "../../modules/cart/components/FloatingCartLink";
import { UserMenu } from "./UserMenu";

export function MainLayout() {
  const pathname = useLocation().pathname;
  const isMenuPage = pathname === "/menu";
  const showFloatingCart = pathname === "/" || isMenuPage || pathname.startsWith("/products/");

  return (
    <div className={isMenuPage ? "menu-layout" : undefined}>
      <Navbar expand="lg" className={isMenuPage ? "menu-navbar" : "border-bottom bg-white"}>
        <Container fluid={isMenuPage} className={isMenuPage ? "menu-shell menu-navbar-inner" : undefined}>
          <Navbar.Brand as={Link} to="/" className={isMenuPage ? "menu-brand" : undefined}>
            {isMenuPage && <span className="menu-brand-mark"><LeafIcon size={24} /></span>}
            Healthy Food
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" aria-label="Mở menu điều hướng" />
          <Navbar.Collapse id="main-navbar">
            <Nav className={isMenuPage ? "menu-primary-nav me-auto" : "me-auto"}>
              <Nav.Link as={NavLink} to="/menu">Thực đơn</Nav.Link>
              {isMenuPage && <Nav.Link as={NavLink} to="/orders">Đơn hàng</Nav.Link>}
            </Nav>
            <UserMenu menuStyle={isMenuPage} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as="main" fluid={isMenuPage} className={isMenuPage ? "menu-shell menu-main" : "py-4"}>
        <Outlet />
      </Container>
      {showFloatingCart && <FloatingCartLink />}
    </div>
  );
}
