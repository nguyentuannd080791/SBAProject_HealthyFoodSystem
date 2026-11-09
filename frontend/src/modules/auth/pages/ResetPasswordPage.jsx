import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Card, Col, Row } from "react-bootstrap";
import { authApi } from "../api/authApi";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { KeyIcon } from "../../../shared/components/Icons";

const requestedNotice =
  "Nếu email tồn tại trong hệ thống, mã xác thực đã được gửi. Vui lòng kiểm tra hòm thư của bạn.";
const resetNotice =
  "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? "";
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitError("");
    setIsSubmitting(true);
    const result = await authApi.resetPassword(
      values.email,
      values.code,
      values.password,
    );
    setIsSubmitting(false);

    if (result.error) {
      return setSubmitError(result.error);
    }

    navigate("/login", { state: { notice: resetNotice } });
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} sm={10} md={8} lg={5} xl={4}>
        <Card className="auth-card">
          <Card.Body className="p-4 p-sm-5">
            <div className="text-center mb-4">
              <div className="auth-icon-badge">
                <KeyIcon size={24} />
              </div>
              <h2 className="h4 fw-bold mb-1 text-dark">Đặt lại mật khẩu</h2>
              <p className="text-muted small mb-0">
                Nhập mã xác thực và thiết lập mật khẩu mới
              </p>
            </div>

            <ResetPasswordForm
              initialEmail={email}
              onSubmit={handleSubmit}
              notice={email ? requestedNotice : ""}
              submitError={submitError}
              isSubmitting={isSubmitting}
            />

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top small">
              <Link to="/forgot-password" className="text-decoration-none text-muted">
                Gửi lại mã OTP
              </Link>
              <Link to="/login" className="fw-semibold text-decoration-none">
                Đăng nhập
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
