import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { authApi } from "../api/authApi";
import { LoginForm } from "../components/LoginForm";
import { LeafIcon } from "../../../shared/components/Icons";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitError("");
    setIsSubmitting(true);

    const result = await authApi.login(values.email, values.password);
    setIsSubmitting(false);

    if (result.error) {
      return setSubmitError(result.error);
    }

    if (!result.data?.user || !result.data?.token) {
      return setSubmitError(
        "Đăng nhập thất bại: dữ liệu người dùng không hợp lệ.",
      );
    }

    login(result.data.user, result.data.token);
    navigate(location.state?.from || "/", { replace: true });
  }

  return (
    <>
      <Button
        as={Link}
        to="/"
        variant="outline-success"
        size="sm"
        className="position-fixed top-0 start-0 m-4 z-3"
      >
        <span aria-hidden="true">←</span> Quay lại trang chủ
      </Button>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="auth-card">
            <Card.Body className="p-4 p-sm-5">
              <div className="text-center mb-4">
                <div className="auth-icon-badge">
                  <LeafIcon size={24} />
                </div>
                <h2 className="h4 fw-bold mb-1 text-dark">Đăng nhập</h2>
                <p className="text-muted small mb-0">
                  Thực phẩm sạch & Dinh dưỡng theo nhu cầu
                </p>
              </div>

              <LoginForm
                onSubmit={handleSubmit}
                notice={location.state?.notice}
                submitError={submitError}
                isSubmitting={isSubmitting}
              />

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top small">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none text-muted"
                >
                  Quên mật khẩu?
                </Link>
                <span>
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-none"
                  >
                    Đăng ký
                  </Link>
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
