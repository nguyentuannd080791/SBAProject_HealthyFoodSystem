import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { authApi } from "../api/authApi";
import { LeafIcon } from "../../../shared/components/Icons";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSubmitError("");
    setIsSubmitting(true);

    const result = await authApi.login(email.trim(), password);
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
    navigate("/", { replace: true });
  }

  return (
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

            {/* Thông báo thông tin / trạng thái */}
            {location.state?.notice && (
              <Alert variant="success" className="py-2 small">
                {location.state.notice}
              </Alert>
            )}
            {submitError && (
              <Alert variant="danger" className="py-2 small">
                {submitError}
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label className="small fw-semibold text-secondary">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập địa chỉ email hợp lệ.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label className="small fw-semibold text-secondary">Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập mật khẩu (tối thiểu 6 ký tự).
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-2 py-2 fw-semibold"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "var(--hf-primary)",
                  borderColor: "var(--hf-primary)",
                }}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form>

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
  );
}
