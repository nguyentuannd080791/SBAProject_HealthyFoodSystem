import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router";
import { FloatingCartLink } from "../../modules/cart/components/FloatingCartLink";
import { HomeFooter } from "../../modules/home/components/HomeFooter";
import { PaymentNotificationWatcher } from "../../modules/orders/components/PaymentNotificationWatcher";
import { StaffHandoverNotificationWatcher } from "../../modules/staff/components/StaffHandoverNotificationWatcher";
import { CartIcon, LeafIcon, ShieldCheckIcon, ShoppingBagIcon } from "../../shared/components/Icons";
import { NotificationProvider } from "../../shared/notifications/NotificationProvider";
import { useAuth } from "../provider/useAuth";
import { UserMenu } from "./UserMenu";

import "../../modules/menu/styles/menu.css";

function HeaderIcon({ type }) {
  const paths = {
    home: <><path d="m2 11 10-8 10 8" /><path d="M5 10v11h14V10M10 21v-7h4v7" /></>,
    menu: <><path d="M4 3v8M7 3v8M10 3v8M7 11v10M17 3c-3 3-3 7 0 10h2V3M18 13v8" /></>,
    nutrition: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

export function MainLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isMenuPage = pathname === "/menu";
  const isMenuOrProduct = isMenuPage || pathname.startsWith("/products/");
  const isCustomer = !user?.role || user.role.toLowerCase() === "customer";
  const isCustomerPage = !/^\/(manager|staff|admin|delivery)(\/|$)/.test(pathname);
  const isManagerPage = pathname.startsWith("/manager");
  const isStaffPage = pathname.startsWith("/staff");
  const isAdminPage = pathname.startsWith("/admin");
  const isManagementWorkspace = isManagerPage || isStaffPage || isAdminPage;
  const showFloatingCart = isCustomer && (pathname === "/" || isMenuPage || pathname.startsWith("/products/"));

  return (
    <NotificationProvider key={user?.id ?? "guest"}>
      <PaymentNotificationWatcher />
      <StaffHandoverNotificationWatcher />
      <div className="menu-layout">
        <Navbar expand="lg" className="menu-navbar">
          <Container fluid className="menu-shell menu-navbar-inner">
            {isManagerPage ? (
              <Navbar.Brand as={Link} to="/manager" className="menu-brand">
                <span
                  className="menu-brand-mark"
                  style={{
                    backgroundColor: "#15803d",
                    color: "#ffffff",
                  }}
                >
                  <ShoppingBagIcon size={20} />
                </span>
                <span className="menu-brand-copy">
                  <strong>
                    Healthy<span>Food</span>
                  </strong>
                  <small className="text-success fw-bold">
                    Cổng Quản Lý Cửa Hàng
                  </small>
                </span>
              </Navbar.Brand>
            ) : isStaffPage ? (
              <Navbar.Brand as={Link} to="/staff" className="menu-brand">
                <span
                  className="menu-brand-mark"
                  style={{
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                  }}
                >
                  <CartIcon size={20} />
                </span>
                <span className="menu-brand-copy">
                  <strong>
                    Healthy<span>Food</span>
                  </strong>
                  <small className="text-info fw-bold">
                    Cổng Vận Hành Đơn Hàng
                  </small>
                </span>
              </Navbar.Brand>
            ) : isAdminPage ? (
              <Navbar.Brand as={Link} to="/admin" className="menu-brand">
                <span
                  className="menu-brand-mark"
                  style={{
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                  }}
                >
                  <ShieldCheckIcon size={20} />
                </span>
                <span className="menu-brand-copy">
                  <strong>
                    Healthy<span>Food</span>
                  </strong>
                  <small className="text-primary fw-bold">
                    Cổng Quản Trị Hệ Thống
                  </small>
                </span>
              </Navbar.Brand>
            ) : (
              <Navbar.Brand as={Link} to="/" className="menu-brand">
                <span className="menu-brand-mark">
                  <LeafIcon size={20} />
                </span>
                <span className="menu-brand-copy">
                  <strong>
                    Healthy<span>Food</span>
                  </strong>
                  <small>Ăn lành sống khỏe</small>
                </span>
              </Navbar.Brand>
            )}

            <Navbar.Toggle
              aria-controls="main-navbar"
              aria-label="Mở menu điều hướng"
            />
            <Navbar.Collapse id="main-navbar">
              <Nav className="menu-primary-nav me-auto">
                {isManagerPage ? (
                  <div className="d-none d-lg-flex align-items-center gap-2 ms-3 text-muted small">
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-semibold">
                      Workspace
                    </span>
                    <span>Hệ thống điều hành thực đơn & kinh doanh</span>
                  </div>
                ) : isStaffPage ? (
                  <div className="d-none d-lg-flex align-items-center gap-2 ms-3 text-muted small">
                    <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fw-semibold">
                      Workspace
                    </span>
                    <span>Hệ thống điều phối & xử lý đơn hàng</span>
                  </div>
                ) : isAdminPage ? (
                  <div className="d-none d-lg-flex align-items-center gap-2 ms-3 text-muted small">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fw-semibold">
                      Workspace
                    </span>
                    <span>Hệ thống quản trị tài khoản & phân quyền</span>
                  </div>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/"
                      className={pathname === "/" ? "is-current" : undefined}
                    >
                      <HeaderIcon type="home" />
                      <span>Trang chủ</span>
                    </Nav.Link>
                    {user && (
                      <>
                        <Nav.Link
                          as={Link}
                          to="/menu"
                          className={isMenuOrProduct ? "is-current" : undefined}
                        >
                          <HeaderIcon type="menu" />
                          <span>Thực đơn</span>
                        </Nav.Link>
                        <Nav.Link
                          as={Link}
                          to="/nutrition"
                          className={
                            pathname.startsWith("/nutrition")
                              ? "is-current"
                              : undefined
                          }
                        >
                          <HeaderIcon type="nutrition" />
                          <span>Đo chỉ số</span>
                        </Nav.Link>
                      </>
                    )}
                  </>
                )}
              </Nav>

              <div className="d-flex align-items-center gap-2">
                <UserMenu showCart={!isManagementWorkspace} />
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container
          as="main"
          fluid={isMenuPage || isManagementWorkspace}
          className={
            isMenuPage
              ? "menu-shell menu-main"
              : isManagementWorkspace
                ? "menu-shell py-3 px-3 px-sm-4"
                : "py-4"
          }
        >
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
