import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, Col, Row } from "react-bootstrap";
import { authApi } from "../api/authApi";
import { RegisterForm } from "../components/RegisterForm";
import { LeafIcon } from "../../../shared/components/Icons";

export function RegisterPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitError("");
    setIsSubmitting(true);
    const result = await authApi.register(values);
    setIsSubmitting(false);

    if (result.error) {
      return setSubmitError(result.error);
    }

    navigate("/login", {
      state: { notice: "Đăng ký tài khoản thành công! Vui lòng đăng nhập." },
    });
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} sm={10} md={8} lg={6} xl={5}>
        <Card className="auth-card">
          <Card.Body className="p-4 p-sm-5">
            <div className="text-center mb-4">
              <div className="auth-icon-badge">
                <LeafIcon size={24} />
              </div>
              <h2 className="h4 fw-bold mb-1 text-dark">Tạo tài khoản</h2>
              <p className="text-muted small mb-0">
                Khởi đầu hành trình ăn sạch và chăm sóc sức khỏe
              </p>
            </div>

            <RegisterForm
              onSubmit={handleSubmit}
              submitError={submitError}
              isSubmitting={isSubmitting}
            />

            <div className="text-center mt-4 pt-3 border-top small">
              <span className="text-muted">Đã có tài khoản? </span>
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
