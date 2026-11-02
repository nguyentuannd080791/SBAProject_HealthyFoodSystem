import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "react-bootstrap";
import { authApi } from "../api/authApi";
import { RegisterHookForm } from "../components/RegisterHookForm";

export function RegisterHookFormPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitError("");
    setIsSubmitting(true);
    const result = await authApi.register(values);
    setIsSubmitting(false);
    if (result.error) return setSubmitError(result.error);
    navigate("/login", {
      state: { notice: "Đăng ký tài khoản thành công! Vui lòng đăng nhập." },
    });
  }

  return (
    <Card body>
      <h2 className="h5 mb-1">Tạo tài khoản</h2>
      <p className="text-muted small mb-3">Phiên bản thử nghiệm: React Hook Form + Zod</p>
      <RegisterHookForm
        onSubmit={handleSubmit}
        submitError={submitError}
        isSubmitting={isSubmitting}
      />
      <p className="mt-3 mb-0 text-center">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
      <p className="mt-1 mb-0 text-center">
        <Link to="/register">Quay lại form đăng ký gốc</Link>
      </p>
    </Card>
  );
}
