import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "react-bootstrap";
import { authApi } from "../api/authApi";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitError("");
    setIsSubmitting(true);
    const result = await authApi.register(values);
    setIsSubmitting(false);
    if (result.error) return setSubmitError(result.error);
    navigate("/verify-email", { state: { email: result.data.email } });
  }

  return (
    <Card body>
      <h2 className="h5 mb-3">Tạo tài khoản</h2>
      <RegisterForm
        onSubmit={handleSubmit}
        submitError={submitError}
        isSubmitting={isSubmitting}
      />
      <p className="mt-3 mb-0 text-center">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
      <p className="mt-1 mb-0 text-center">
        <Link to="/register-rhf" className="text-muted small">
          React Hook Form + Zod
        </Link>
      </p>
    </Card>
  );
}
