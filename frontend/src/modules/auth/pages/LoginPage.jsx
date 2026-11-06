import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Card } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { authApi } from "../api/authApi";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit({ email, password }) {
    setSubmitError("");
    setIsSubmitting(true);
    const result = await authApi.login(email, password);
    setIsSubmitting(false);
    if (result.error) return setSubmitError(result.error);
    if (!result.data?.user || !result.data?.token) {
      return setSubmitError("Đăng nhập thất bại: dữ liệu người dùng không hợp lệ.");
    }
    login(result.data.user, result.data.token);
    navigate(location.state?.from || "/", { replace: true });
  }

  return (
    <Card body>
      <h2 className="h5 mb-3">Đăng nhập</h2>
      <LoginForm
        onSubmit={handleSubmit}
        notice={location.state?.notice}
        submitError={submitError}
        isSubmitting={isSubmitting}
      />
      <p className="mt-3 mb-0 text-center">
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </p>
      <p className="mt-1 mb-0 text-center">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </Card>
  );
}
