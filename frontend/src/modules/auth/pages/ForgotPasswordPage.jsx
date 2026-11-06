import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, Col, Row } from "react-bootstrap";
import { authApi } from "../api/authApi";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { MailIcon } from "../../../shared/components/Icons";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit({ email }) {
    setSubmitError("");
    setIsSubmitting(true);
    const result = await authApi.forgotPassword(email);
    setIsSubmitting(false);

    if (result.error) {
      return setSubmitError(result.error);
    }

    navigate("/reset-password", { state: { email } });
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} sm={10} md={8} lg={5} xl={4}>
        <Card className="auth-card">
          <Card.Body className="p-4 p-sm-5">
            <div className="text-center mb-4">
              <div className="auth-icon-badge">
                <MailIcon size={24} />
              </div>
              <h2 className="h4 fw-bold mb-1 text-dark">Quên mật khẩu</h2>
              <p className="text-muted small mb-0">
                Nhập email của bạn để nhận mã xác thực đặt lại mật khẩu
              </p>
            </div>

            <ForgotPasswordForm
              onSubmit={handleSubmit}
              submitError={submitError}
              isSubmitting={isSubmitting}
            />

            <div className="text-center mt-4 pt-3 border-top small">
              <Link to="/login" className="text-decoration-none text-muted">
                ← Quay lại đăng nhập
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
