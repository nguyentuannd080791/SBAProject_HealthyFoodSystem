import { Link, Outlet } from "react-router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { UserMenu } from "./UserMenu";

export function MainLayout() {
  return (
    <>
      <Navbar bg="white" expand="lg" className="border-bottom">
        <Container>
          <Navbar.Brand as={Link} to="/">Healthy Food</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" aria-label="Mở menu điều hướng" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/menu">Thực đơn</Nav.Link>
            </Nav>
            <UserMenu />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as="main" className="py-4">
        <Outlet />
      </Container>
    </>
  );
}
